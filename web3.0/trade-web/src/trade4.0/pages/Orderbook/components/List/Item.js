/*
 * owner: Clyne@kupotech.com
 */
import React, { memo, useMemo, useContext, useCallback } from 'react';
import { useDispatch, useSelector } from 'dva';
import { findIndex } from 'lodash';
import { useTradeType } from '@/hooks/common/useTradeType';
import { formatNumber, formatNumberKMB } from '../../utils/numberFormat';
import {
  ORDER_BOOK_BUY,
  ORDER_BOOK_SELL,
  WrapperContext,
  namespace,
} from '@/pages/Orderbook/config';
import { useEvent } from '@/pages/Orderbook/hooks/useEvent';
import PCT from './PCT';
import { RowItem, Price, Amount, Total } from './style';
import { useTransformAmount, qtyToBaseCurrency, useUnit } from '@/hooks/futures/useUnit';
import { getSymbolInfo, useGetCurrentSymbol } from '@//hooks/common/useSymbol';
import { getRequestPrecision } from '../../utils/format';
import Decimal from 'decimal.js';
import { FUTURES } from 'src/trade4.0/meta/const';

const Box = ({ type, data, index, style, activeIndexs, children }) => {
  const dispatch = useDispatch();
  const screen = useContext(WrapperContext);
  const isCombineSell = screen !== 'sm' && type === ORDER_BOOK_SELL;
  const hoverIndex = useSelector((state) => state[namespace].hoverIndex);
  const hoverType = useSelector((state) => state[namespace].hoverType);
  const [price, amount, total] = data;
  const isActive = findIndex(activeIndexs, (item) => item === index) !== -1;
  const unique = `${price}-${amount}-${isActive}-${index}`;
  const { listClick = () => {} } = useEvent(dispatch);
  const showHover = useMemo(() => {
    // 如果hover的类型与当前类型一致
    if (hoverType === type) {
      // 并排模式用买盘的hover逻辑
      // 买盘显示选中，hoverIndex <= 当前索引，买盘显示选中，hoverIndex >= 当前索引
      return type === ORDER_BOOK_BUY || isCombineSell ? index <= hoverIndex : index >= hoverIndex;
    }
    return false;
  }, [hoverType, type, isCombineSell, index, hoverIndex]);

  return (
    <RowItem
      showHover={showHover}
      onClick={(e) => listClick({ type, price, amount, total }, e)}
      className={unique}
      style={style}
      isActive={isActive}
    >
      {children}
    </RowItem>
  );
};

const Item = memo(
  (props) => {
    const { type, data, index } = props;
    const [price, _amount, _total] = data;
    const tradeType = useTradeType();
    const symbol = useGetCurrentSymbol();
    const futuresUnit = useUnit();
    const isFutures = tradeType === FUTURES;
    const amountPrecision = useSelector((state) => state[namespace].amountPrecision);
    const currentDepth = useSelector((state) => state[namespace].currentDepth);
    const { baseIncrement, isInverse } = getSymbolInfo({ tradeType, symbol });
    // 显示张，反向合约，正向合约逻辑
    const isQuantity = futuresUnit === 'Quantity' || isInverse;
    // 张 -> baseCurrency
    const quantityToBaseCurrency = useCallback(
      (amount) => {
        return qtyToBaseCurrency({ amount, baseIncrement, isFutures, isQuantity });
      },
      [baseIncrement, isFutures, isQuantity],
    );

    const precision = getRequestPrecision(currentDepth);
    // 合约融合
    const amount = quantityToBaseCurrency(_amount);
    const total = quantityToBaseCurrency(_total);
    // 最小步长
    const amountMinStep =
      typeof amountPrecision === 'number' ? new Decimal(10).pow(-amountPrecision).toFixed() : 0;
    const dataProps = {
      type,
      'data-orderbook-item': [price, amount, total, index].join('-'),
    };

    // 用于表单的设置
    const dataArr = [price, amount, total];

    return (
      <Box {...props} data={dataArr}>
        <PCT total={total} amount={amount} {...dataProps} />
        <Price data-item-type="all" {...dataProps}>
          <span data-item-type="price" {...dataProps}>
            {formatNumber(price, {
              pointed: true,
              fixed: precision,
              dropZ: false,
              step: currentDepth,
            })}
          </span>
        </Price>
        <Amount data-item-type="all" {...dataProps}>
          <span data-item-type="amount" {...dataProps}>
            {formatNumberKMB(amount, {
              fixed: amountPrecision,
              showMinStep: true,
              minStep: amountMinStep,
            })}
          </span>
        </Amount>
        <Total data-item-type="total" {...dataProps}>
          {formatNumberKMB(total, {
            fixed: amountPrecision,
            showMinStep: true,
            minStep: amountMinStep,
          })}
        </Total>
      </Box>
    );
  },
  (oldProps, newProps) => {
    return JSON.stringify(oldProps) === JSON.stringify(newProps);
  },
);

export default Item;

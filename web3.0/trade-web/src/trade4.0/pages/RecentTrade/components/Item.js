/*
 * owner: Clyne@kupotech.com
 */
import React from 'react';
import { widthCfg } from '../style';
import { formatNumber, transUnix, formatNumberKMB, lessThanMinValue } from '@/utils/format';
import { useSelector } from 'dva';
import { showDatetime } from 'helper';
import { useEvent } from '../hooks/useEvent';
import { namespace } from '../config';
import { useTransformAmount } from 'src/trade4.0/hooks/futures/useUnit';
import { useTradeType } from 'src/trade4.0/hooks/common/useTradeType';
import { useGetCurrentSymbol } from 'src/trade4.0/hooks/common/useSymbol';

const Item = ({ data = {}, style, index }) => {
  const { listClick } = useEvent();
  const precision = useSelector((state) => state[namespace].precision);
  const amountPrecision = useSelector((state) => state[namespace].amountPrecision);
  const { price, size: _size, side, time } = data;
  // 合约融合
  const tradeType = useTradeType();
  const symbol = useGetCurrentSymbol();
  const { quantityToBaseCurrency } = useTransformAmount({ tradeType, symbol });
  const size = quantityToBaseCurrency(_size);
  const priceCls = `recent-${side}`;
  let priceValue;

  const lessThanMinValueResult = lessThanMinValue(price, precision);
  if (lessThanMinValueResult !== false) {
    priceValue = lessThanMinValueResult;
  } else {
    priceValue = formatNumber(price, {
      pointed: true,
      fixed: precision,
      dropZ: false,
    }).toString();
  }

  let amountValue;
  const lessThanMinAmountValueResult = lessThanMinValue(size, amountPrecision);
  if (lessThanMinAmountValueResult !== false) {
    amountValue = lessThanMinAmountValueResult;
  } else {
    amountValue = formatNumberKMB(size, {
      fixed: amountPrecision,
      showMinStep: false,
    }).toString();
  }

  const timeValue = showDatetime(transUnix(time), 'HH:mm:ss');
  const unique = `${price}-${size}-${size}-${index}`;
  const eData = {
    price,
    amount: size,
  };
  return (
    <div
      className="recent-item"
      style={style}
      key={unique}
      onClick={(e) => {
        listClick(eData, e);
      }}
    >
      <div style={{ width: widthCfg[0] }} data-item-type="all" className={priceCls}>
        <span data-item-type="price">{priceValue}</span>
      </div>
      <div style={{ width: widthCfg[1] }} data-item-type="all" className="recent-amount">
        <span data-item-type="amount">{amountValue}</span>
      </div>
      <div style={{ width: widthCfg[2] }} className="recent-time">
        {timeValue}
      </div>
    </div>
  );
};

export default Item;

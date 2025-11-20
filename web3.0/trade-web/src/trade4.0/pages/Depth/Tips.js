/*
 * owner: Clyne@kupotech.com
 */
import React from 'react';
import { useSelector } from 'dva';
import Tooltip from '@mui/Tooltip';
import { useGetCurrentSymbol, useGetCurrentSymbolInfo } from '@/hooks/common/useSymbol';
import { namespace as orderBookNamespace } from '../Orderbook/config';
import { includes } from 'lodash';
import { _t } from 'src/utils/lang';
import { numberResolve, thousandPointed, formatNumber, formatNumberKMB } from '@/utils/format';
import { getHoverIndexByPrice, getVolume } from '@/pages/Orderbook/components/List/utils';
import styled from '@emotion/styled';
import { fx } from '@/style/emotion';
import { useTransformAmount, useUnit } from '@/hooks/futures/useUnit';
import { useTradeType } from '@/hooks/common/useTradeType';
import { getCurrenciesPrecision } from 'src/trade4.0/hooks/futures/useGetCurrenciesPrecision';
import { isSpotTypeSymbol } from 'src/trade4.0/hooks/common/useIsSpotSymbol';
import { FUTURES } from 'src/trade4.0/meta/const';

const ToolTip = styled(Tooltip)`
  &.KuxTooltip-root {
    ${fx.borderRadius('4px')}
  }
`;

const Title = ({ item, isSell }) => {
  const currentSymbol = useGetCurrentSymbol();
  const amountPrecision = useSelector((state) => state[orderBookNamespace].amountPrecision);
  // 合约融合
  const {
    baseCurrency: _baseCurrency,
    quoteCurrency,
    isInverse,
    pricePrecision,
  } = useGetCurrentSymbolInfo();
  const tradeType = useTradeType();
  const futuresUnit = useUnit();
  const { quantityToBaseCurrency } = useTransformAmount({ tradeType, symbol: currentSymbol });
  const isFutures = !isSpotSymbol && tradeType === FUTURES;
  const isQuantity = isFutures && (futuresUnit === 'Quantity' || isInverse);
  const baseCurrency = isQuantity ? _t('global.unit') : _baseCurrency;
  const isSpotSymbol = isSpotTypeSymbol(currentSymbol);
  const categories = useSelector((state) => state.categories);
  const volumePrecision =
    (isFutures
      ? getCurrenciesPrecision(quoteCurrency)?.shortPrecision
      : categories[quoteCurrency]?.precision) || 2;

  const [price, total] = item;
  // 获取当前价格的index以及所在的盘口类型
  const { index, dataKey } = getHoverIndexByPrice({
    currentSymbol,
    price,
    isSell,
  });
  // 获取volume
  const { volume } = getVolume({
    currentSymbol,
    type: dataKey,
    hoverIndex: index,
    isFormat: false,
  });

  return (
    <div className="depth-tips">
      <div>
        <div>{_t('span.price')}</div>
        <div className="tip-value">
          {formatNumber(price, {
            fixed: pricePrecision,
            dropZ: false,
          })}
        </div>
      </div>
      <div>
        <div>{_t('span.vol', { currency: baseCurrency })}</div>
        <div className="tip-value">
          {formatNumberKMB(Number(quantityToBaseCurrency(total)), {
            fixed: amountPrecision,
            showMinStep: false,
          })}
        </div>
      </div>
      <div>
        <div>{_t('span.amount', { currency: quoteCurrency })}</div>
        <div className="tip-value">{formatNumberKMB(volume, { fixed: volumePrecision })}</div>
      </div>
    </div>
  );
};
const OverLay = (props) => {
  return <Title {...props} />;
};

const getTips = (sellList) => (target, parent, item) => {
  return (
    <ToolTip
      rootClass="depth-tooltips"
      open
      placement="top"
      getPopupContainer={parent}
      title={<OverLay item={item} isSell={includes(sellList, item)} />}
    >
      {target}
    </ToolTip>
  );
};

export default getTips;

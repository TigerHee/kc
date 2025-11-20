/**
 * Owner: clyne@kupotech.com
 */
import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { _t } from 'utils/lang';
import { toNonExponential } from 'utils/operation';
import { formatNumber } from '@/utils/futures';
import { FUTURES } from '@/meta/const';

import { Button } from '@kux/mui';
import { styled } from '@kux/mui/emotion';

import { useGetSymbolInfo } from '@/hooks/common/useSymbol';

import ProfitLossTips from './ProfitLossTips';

import { PROFIT_TYPE, priceTypeToLocaleKey } from '../constants';
import { futuresSensors } from 'src/trade4.0/meta/sensors';

const InfoWrapper = styled.div``;

const InfoProfitAndLoss = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 130%;
  color: ${(props) => (props.isProfit ? props.theme.colors.primary : props.theme.colors.secondary)};
`;

const InfoContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InfoContentLeft = styled.div`
  flex: 1;
`;

const InfoContentRight = styled.div`
  flex-shrink: 0;
  margin-left: 48px;
`;

const StopPlInfo = ({ type, currentQty, stopInfo = {}, onCancel }) => {
  const loading = useSelector(
    (state) => state.loading.effects['futures_orders/cancelStopOrderFromShortcut'],
  );

  const { stopPrice, stopPriceType, symbol } = stopInfo;

  const { pricePrecision, indexPricePrecision } = useGetSymbolInfo({ symbol, tradeType: FUTURES });

  const isProfit = type === PROFIT_TYPE;
  let stopSymbol = isProfit ? '≥' : '≤';
  if (currentQty < 0) {
    stopSymbol = isProfit ? '≤' : '≥';
  }

  const handleCancel = useCallback(() => {
    if (loading) return;
    if (onCancel) {
      futuresSensors.position.stopLPCancel.click();
      onCancel();
    }
  }, [loading, onCancel]);

  const priceFixed = useMemo(() => {
    return stopPriceType === 'TP' ? pricePrecision : indexPricePrecision;
  }, [indexPricePrecision, pricePrecision, stopPriceType]);

  return (
    <InfoWrapper>
      <InfoContent>
        <InfoContentLeft>
          <InfoProfitAndLoss isProfit={type === PROFIT_TYPE}>
            <span>{_t(priceTypeToLocaleKey[stopPriceType])}</span>
            <span>{`${stopSymbol} ${formatNumber(toNonExponential(stopPrice), {
              fixed: priceFixed,
            })}`}</span>
          </InfoProfitAndLoss>
          <ProfitLossTips type={type} price={stopPrice} stopPriceType={stopPriceType} />
        </InfoContentLeft>
        <InfoContentRight>
          <Button loading={loading} variant="outlined" size="small" onClick={handleCancel}>
            {_t('trade.positionsOrders.cancel')}
          </Button>
        </InfoContentRight>
      </InfoContent>
    </InfoWrapper>
  );
};

export default React.memo(StopPlInfo);

/**
 * Owner: clyne@kupotech.com
 */
import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  useI18n,
  formatNumber,
  styled,
  useGetSymbolInfo,
  priceTypeToLocaleKey,
} from '@/pages/Futures/import';
import { toNonExponential } from 'utils/operation';
import { Button } from '@kux/mui';
// import { futuresSensors } from 'src/trade4.0/meta/sensors';
import ProfitLossTips from './ProfitLossTips';

import { PROFIT_TYPE } from '../constants';
import { namespace } from '../../../config';
import { FUTURES } from 'src/trade4.0/meta/const';

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
  const { _t } = useI18n();
  const loading = useSelector(
    (state) => state.loading.effects[`${namespace}/cancelStopOrderFromShortcut`],
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
            <span>
              {`${stopSymbol} ${formatNumber(toNonExponential(stopPrice), {
                fixed: priceFixed,
              })}`}
            </span>
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

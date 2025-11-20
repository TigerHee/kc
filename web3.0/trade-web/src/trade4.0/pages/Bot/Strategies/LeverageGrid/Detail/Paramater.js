/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback, useRef, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'dva';
import { ParamRow } from 'Bot/components/Common/Row';
import { _t, _tHTML } from 'Bot/utils/lang';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';
import useStateRef from '@/hooks/common/useStateRef';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import { formatNumber } from 'Bot/helper';
import { Button, Divider } from '@kux/mui';
import { useSnackbar } from '@kux/mui/hooks';
import ParamaterPage from 'Bot/Strategies/components/ParamaterPage';
import FutureAddMargin from 'Bot/Strategies/components/FutureAddMargin';
import { addMarginApiConfig } from 'LeverageGrid/config';
import StopLoss from 'Bot/Strategies/components/StopLoss';
import StopProfit from 'Bot/Strategies/components/StopProfit';

export default ({ isActive, onClose, runningData: { id, symbol, status }, mode }) => {
  const params = useSelector((state) => state.leveragegrid.runParams);
  const ParamaterLoading = useSelector((state) => state.leveragegrid.ParamaterLoading);
  const { message } = useSnackbar();
  const showToast = () => {
    message.info(_t('hassetentryprice'));
  };
  const dispatch = useDispatch();
  const symbolInfo = useSpotSymbolInfo(symbol);
  const { base, quota, pricePrecision, quotaPrecision, symbolNameText, symbolCode } = symbolInfo;
  const price = 1;
  const useDataRef = useStateRef({
    symbolInfo,
    item: {
      symbol: symbolCode,
      id,
      price,
      ...params,
    },
  });
  const stopped = mode === 'history';
  const notEdit = stopped;
  const onFresh = useCallback(() => {
    dispatch({
      type: 'leveragegrid/getParameter',
      payload: {
        id,
      },
    });
  }, []);
  useLayoutEffect(() => {
    isActive && onFresh();
  }, [isActive]);

  const addMarginRef = useRef();
  const stopLossPriceRef = useRef();
  const stopProfitPriceRef = useRef();

  const toggleMargin = useCallback(() => {
    addMarginRef.current.toggle(useDataRef.current);
  }, []);

  const onStopLoss = useCallback(
    debounce(() => {
      if (stopped) return;
      stopLossPriceRef.current.toggle(useDataRef.current);
    }, 600),
    [stopped],
  );

  const toggleStopProfitPrice = useCallback(
    debounce(() => {
      if (stopped) return;
      stopProfitPriceRef.current.toggle(useDataRef.current);
    }, 600),
    [stopped],
  );

  if (isEmpty(params) || ParamaterLoading) return null;
  return (
    <ParamaterPage
      id={id}
      symbolNameText={symbolNameText}
      direction={params.direction}
      leverage={params.leverage}
    >
      <ParamRow
        label={_t('card13')}
        value={`${formatNumber(params.down, pricePrecision)}～${formatNumber(
          params.up,
          pricePrecision,
        )}`}
        unit={quota}
      />

      <ParamRow
        label={_t('card14')}
        value={Number(params.entryPrice) ? formatNumber(params.entryPrice, pricePrecision) : '--'}
        unit={quota}
      />

      <ParamRow label={_t('robotparams10')} value={`${+params.depth - 1}`} unit={_t('unit')} />

      <ParamRow
        label={_t('futrgrid.currentmargin')}
        value={formatNumber(params.limitAsset, quotaPrecision)}
        unit={quota}
      />

      <Divider mt={32} mb={32} />

      <ParamRow
        checkUnSet
        hasArrow={!notEdit}
        label={_t('gridform21')}
        rawValue={params.stopLossPrice}
        value={formatNumber(params.stopLossPrice, pricePrecision)}
        unit={quota}
        onClick={onStopLoss}
      />
      <ParamRow
        checkUnSet
        hasArrow={!notEdit}
        label={_t('stopprofit')}
        rawValue={params.stopProfitPrice}
        value={formatNumber(params.stopProfitPrice, pricePrecision)}
        unit={quota}
        onClick={toggleStopProfitPrice}
      />
      <ParamRow
        checkUnSet
        hasArrow={false}
        label={_t('openprice')}
        rawValue={params.openUnitPrice}
        value={formatNumber(params.openUnitPrice, pricePrecision)}
        unit={quota}
        onClick={showToast}
      />

      {status === 'RUNNING' && (
        <>
          <Divider mt={32} mb={32} />
          <Button variant="outlined" fullWidth onClick={toggleMargin}>
            {_t('smart.saddmargin')}
          </Button>
          <FutureAddMargin
            apiConfig={addMarginApiConfig}
            onFresh={onFresh}
            actionSheetRef={addMarginRef}
            hasPreCalcBlowUpPrice={false}
          />
        </>
      )}
      <StopProfit type="futuregrid" onFresh={onFresh} actionSheetRef={stopProfitPriceRef} />
      <StopLoss type="futuregrid" onFresh={onFresh} actionSheetRef={stopLossPriceRef} />
    </ParamaterPage>
  );
};

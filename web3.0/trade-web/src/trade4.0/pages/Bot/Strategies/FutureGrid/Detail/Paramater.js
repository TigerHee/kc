/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'dva';
import { ParamRow } from 'Bot/components/Common/Row';
import { _t, _tHTML } from 'Bot/utils/lang';
import useFutureSymbolInfo from 'Bot/hooks/useFutureSymbolInfo';
import isEmpty from 'lodash/isEmpty';
import { formatNumber, floatToPercent, convertBool } from 'Bot/helper';
import { Button, Divider, Switch } from '@kux/mui';
import { Text } from 'Bot/components/Widgets';
import ParamaterPage from 'Bot/Strategies/components/ParamaterPage';
import { setNoticeOutbound } from 'Bot/services/running';
import debounce from 'lodash/debounce';
import FutureAddMargin from 'Bot/Strategies/components/FutureAddMargin';
import useStateRef from '@/hooks/common/useStateRef';
import { addMarginApiConfig } from 'FutureGrid/config';
import StopLoss from 'Bot/Strategies/components/StopLoss';
import StopProfit from 'Bot/Strategies/components/StopProfit';

const getGridProfit = (params) => {
  let gridProfit = null;
  if (!isEmpty(params)) {
    gridProfit = `${floatToPercent(params.gridProfitLowerRatio, 2)}～${floatToPercent(
      params.gridProfitUpperRatio,
      2,
    )}`;
  }
  return gridProfit;
};
export default ({
  isActive,
  onClose,
  runningData: { id, symbolCode, status, price, ...etcItem },
  mode,
}) => {
  const params = useSelector((state) => state.futuregrid.runParams);
  const ParamaterLoading = useSelector((state) => state.futuregrid.ParamaterLoading);
  const dispatch = useDispatch();
  const symbolInfo = useFutureSymbolInfo(symbolCode);
  const { precision, quota, symbolNameText } = symbolInfo;

  const stopped = mode === 'history';
  const onFresh = useCallback(() => {
    dispatch({
      type: 'futuregrid/getParameter',
      payload: {
        id,
      },
    });
  }, []);
  useLayoutEffect(() => {
    isActive && onFresh();
  }, [isActive]);

  const isCanModify = status === 'RUNNING';
  const addMarginRef = useRef();
  const stopLossPriceRef = useRef();
  const stopProfitPriceRef = useRef();

  const useDataRef = useStateRef({
    symbolInfo,
    item: {
      symbolCode,
      id,
      price,
      ...etcItem,
      ...params,
    },
  });

  const toggleMargin = useCallback(() => {
    addMarginRef.current.toggle(useDataRef.current);
  }, []);

  const toggleStopLossPrice = useCallback(
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

  const submitNoticeOutbound = useCallback(
    (e) => {
      setNoticeOutbound({
        taskId: id,
        isNoticeOutbound: e,
        stopLossPrice: params.stopLossPrice,
      }).then(onFresh);
    },
    [id, params, onFresh],
  );
  if (isEmpty(params) || ParamaterLoading) return null;
  return (
    <ParamaterPage
      id={id}
      symbolNameText={symbolNameText}
      direction={params.direction}
      leverage={params.leverage}
    >
      {status !== 'RISK_PROTECTION' && (
        <ParamRow
          label={_t('card13')}
          value={`${formatNumber(params.down, precision)}～${formatNumber(params.up, precision)}`}
          unit={quota}
        />
      )}

      {/* 为空 为0 显示-- */}
      <ParamRow
        label={_t('card14')}
        value={Number(params.entryPrice) ? formatNumber(params.entryPrice, precision) : '--'}
        unit={quota}
      />

      {status !== 'RISK_PROTECTION' && (
        <>
          <ParamRow label={_t('robotparams10')} value={+params.depth - 1} unit={_t('unit')} />
          <ParamRow
            label={_tHTML('robotparams3')}
            value={formatNumber(params.size, precision)}
            unit={_t('futrgrid.zhang')}
          />
          <ParamRow label={_t('robotparams6')} value={getGridProfit(params) || '--'} />
        </>
      )}

      <ParamRow
        label={_t('futrgrid.expectbaoprice')}
        value={formatNumber(params.blowUpPrice, precision)}
        unit={quota}
      />
      <ParamRow
        label={_t('futrgrid.currentmargin')}
        value={formatNumber(params.limitAsset, precision)}
        unit={quota}
      />
      {/* 风险提示 */}
      {Number(params.riskLimitLevel) > 1 && (
        <Text as="div" color="complementary" fs={12}>
          {_t('futrgrid.risthint1')}
          {/* <RiskDialog /> */}
        </Text>
      )}

      <Divider mt={32} mb={32} />

      {status !== 'RISK_PROTECTION' && isCanModify && (
        <>
          <ParamRow
            checkUnSet
            onClick={toggleStopLossPrice}
            label={_t('futrgrid.stoplossprice')}
            rawValue={params.stopLossPrice}
            value={formatNumber(params.stopLossPrice, precision)}
            unit={quota}
            hasArrow={isCanModify}
          />
          <ParamRow
            checkUnSet
            onClick={toggleStopProfitPrice}
            label={_t('futrgrid.stopprofitprice')}
            rawValue={params.stopProfitPrice}
            value={formatNumber(params.stopProfitPrice, precision)}
            unit={quota}
            hasArrow={isCanModify}
          />
          <ParamRow
            checkUnSet
            label={_t('openprice')}
            rawValue={params.openUnitPrice}
            value={formatNumber(params.openUnitPrice, precision)}
            unit={quota}
            hasArrow={false}
          />
          <ParamRow
            labelPopoverContent={_t('outrangecontent')}
            label={_t('outrangehint')}
            valueSlot={
              <Switch
                className="customSwitch"
                onChange={submitNoticeOutbound}
                checked={convertBool(params.isNoticeOutbound)}
                disabled={stopped}
              />
            }
          />
        </>
      )}

      {isCanModify && (
        <>
          <Divider mt={32} mb={32} />
          <Button variant="outlined" fullWidth onClick={toggleMargin}>
            {_t('smart.saddmargin')}
          </Button>
          <FutureAddMargin
            apiConfig={addMarginApiConfig}
            onFresh={onFresh}
            actionSheetRef={addMarginRef}
          />
        </>
      )}
      <StopProfit
        type="futuregrid"
        onFresh={onFresh}
        actionSheetRef={stopProfitPriceRef}
      />
      <StopLoss
        type="futuregrid"
        onFresh={onFresh}
        actionSheetRef={stopLossPriceRef}
      />
    </ParamaterPage>
  );
};

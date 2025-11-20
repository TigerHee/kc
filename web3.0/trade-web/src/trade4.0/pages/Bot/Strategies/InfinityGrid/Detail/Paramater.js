/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'dva';
import { ParamRow } from 'Bot/components/Common/Row';
import { _t, _tHTML } from 'Bot/utils/lang';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';
import isEmpty from 'lodash/isEmpty';
import { formatNumber, floatToPercent } from 'Bot/helper';
import { Button, Divider } from '@kux/mui';
import { Text, Flex } from 'Bot/components/Widgets';
import ParamaterPage from 'Bot/Strategies/components/ParamaterPage';
import StopLoss from 'Bot/Strategies/components/StopLoss';
import StopProfit from 'Bot/Strategies/components/StopProfit';
import useStateRef from '@/hooks/common/useStateRef';
import debounce from 'lodash/debounce';
import AddMoneyActionSheet from 'InfinityGrid/components/AddMoneyActionSheet';
import UpdatePriceRangeActionSheet from 'InfinityGrid/components/UpdatePriceRangeActionSheet';

export default ({ isActive, onClose, runningData: { id, symbol, status, price }, mode }) => {
  const params = useSelector((state) => state.infinitygrid.runParams);
  const ParamaterLoading = useSelector((state) => state.infinitygrid.ParamaterLoading);
  const dispatch = useDispatch();
  const symbolInfo = useSpotSymbolInfo(symbol);
  const { base, quota, pricePrecision, symbolNameText } = symbolInfo;
  const useDataRef = useStateRef({
    symbolInfo,
    item: {
      symbol,
      id,
      price,
      ...params,
    },
  });
  const stopped = mode === 'history';
  const onFresh = useCallback(() => {
    dispatch({
      type: 'infinitygrid/getParameter',
      payload: {
        id,
      },
    });
  }, []);
  useLayoutEffect(() => {
    isActive && onFresh();
  }, [isActive]);

  const notEdit = stopped;
  const stopProfitPriceRef = useRef();
  const stopLossPriceRef = useRef();
  const addInvestRef = useRef();
  const priceRangeRef = useRef();

  const addInvestmentHandler = useCallback(() => {
    addInvestRef.current.toggle(useDataRef.current);
  }, []);

  const toggleStopProfitPrice = useCallback(
    debounce(() => {
      if (stopped) return;
      stopProfitPriceRef.current.toggle(useDataRef.current);
    }, 600),
    [stopped],
  );

  const toggleStopLossPrice = useCallback(
    debounce(() => {
      if (!stopped) {
        stopLossPriceRef.current.toggle(useDataRef.current);
      }
    }, 600),
    [stopped],
  );

  const showUpdatePriceRangeHandler = useCallback(
    (e) => {
      if (!stopped) {
        const { item } = useDataRef.current;
        priceRangeRef.current.toggle({
          taskId: item.id,
          down: item.down,
          symbolCode: symbol,
        });
      }
    },
    [stopped],
  );
  if (isEmpty(params) || ParamaterLoading) return null;
  return (
    <ParamaterPage id={id} symbolNameText={symbolNameText}>
      <ParamRow
        hasArrow={!notEdit}
        label={_t('robotparams1')}
        value={formatNumber(params.down, pricePrecision)}
        unit={quota}
        onClick={showUpdatePriceRangeHandler}
      />
      <ParamRow
        label={_t('card14')}
        unit={quota}
        value={Number(params.entryPrice) ? formatNumber(params.entryPrice, pricePrecision) : '--'}
      />
      <ParamRow
        label={_t('pergridpr')}
        value={params.gridProfitRatio ? floatToPercent(params.gridProfitRatio, 2) : '--'}
      />

      <Divider mt={32} mb={32} />

      <ParamRow
        checkUnSet
        hasArrow={!notEdit}
        label={_t('gridform21')}
        onClick={toggleStopLossPrice}
        rawValue={params.stopLossPrice}
        value={formatNumber(params.stopLossPrice, pricePrecision)}
        unit={quota}
      />
      <ParamRow
        checkUnSet
        hasArrow={!notEdit}
        label={_t('stopprofit')}
        onClick={toggleStopProfitPrice}
        rawValue={params.stopProfitPrice}
        value={formatNumber(params.stopProfitPrice, pricePrecision)}
        unit={quota}
      />

      {status === 'RUNNING' && (
        <Button variant="outlined" fullWidth onClick={addInvestmentHandler}>
          {_t('smart.saddmargin')}
        </Button>
      )}
      <StopProfit onFresh={onFresh} actionSheetRef={stopProfitPriceRef} type="infinitygrid" />
      <StopLoss type="infinitygrid" onFresh={onFresh} actionSheetRef={stopLossPriceRef} />
      <UpdatePriceRangeActionSheet actionSheetRef={priceRangeRef} onFresh={onFresh} />
      <AddMoneyActionSheet actionSheetRef={addInvestRef} onFresh={onFresh} />
    </ParamaterPage>
  );
};

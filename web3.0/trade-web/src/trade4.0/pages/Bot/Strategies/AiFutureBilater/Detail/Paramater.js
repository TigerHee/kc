/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'dva';
import { ParamRow } from 'Bot/components/Common/Row';
import { _t, _tHTML } from 'Bot/utils/lang';
import useFutureSymbolInfo from 'Bot/hooks/useFutureSymbolInfo';
import isEmpty from 'lodash/isEmpty';
import { formatNumber, floatToPercent } from 'Bot/helper';
import ParamaterPage from 'Bot/Strategies/components/ParamaterPage';
import FutureTag from 'Bot/components/Common/FutureTag';
import debounce from 'lodash/debounce';
import StopLossPercent from 'Bot/Strategies/components/StopLossPercent';
import useStateRef from '@/hooks/common/useStateRef';

export default ({ isActive, onClose, runningData: { id, symbolCode, status, price }, mode }) => {
  const params = useSelector((state) => state.aiFutureBilater.runParams);
  const ParamaterLoading = useSelector((state) => state.aiFutureBilater.ParamaterLoading);
  const dispatch = useDispatch();
  const symbolInfo = useFutureSymbolInfo(symbolCode);
  const { precision, quota, symbolNameText } = symbolInfo;

  const stopped = mode === 'history';
  const onFresh = useCallback(() => {
    dispatch({
      type: 'aiFutureBilater/getParameter',
      payload: {
        id,
      },
    });
  }, []);
  useLayoutEffect(() => {
    isActive && onFresh();
  }, [isActive]);
  const useDataRef = useStateRef({
    stopped,
    symbolInfo,
    item: {
      symbolCode,
      id,
      price,
      ...params,
    },
  });

  const isCanModify = status === 'RUNNING';
  const stopLossRef = useRef();

  const toggleStopPrice = useCallback(
    debounce(() => {
      if (useDataRef.current.stopped) return;
      stopLossRef.current.toggle(useDataRef.current);
    }, 600),
    [],
  );

  if (isEmpty(params) || ParamaterLoading) return null;
  return (
    <ParamaterPage
      id={id}
      symbolNameText={symbolNameText}
      RightSlot={
        <>
          <FutureTag direction="short" leverage={params.leverage} mr={6} />
          <FutureTag direction="long" leverage={params.leverage} />
        </>
      }
    >
      <ParamRow
        label={_t('futrgrid.currentmargin')}
        value={formatNumber(params.limitAsset, precision)}
        unit={quota}
      />
      <ParamRow
        checkUnSet
        onClick={toggleStopPrice}
        labelPopoverContent={_tHTML('aiStopLossContent')}
        label={_t('lossstop')}
        rawValue={params.stopLossPercent}
        value={floatToPercent(params.stopLossPercent)}
        hasArrow={isCanModify}
      />
      <StopLossPercent onFresh={onFresh} actionSheetRef={stopLossRef} type="aiFutureBilater" />
    </ParamaterPage>
  );
};

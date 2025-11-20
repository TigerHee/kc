/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'dva';
import { ParamRow } from 'Bot/components/Common/Row';
import { _t, _tHTML } from 'Bot/utils/lang';
import useFutureSymbolInfo from 'Bot/hooks/useFutureSymbolInfo';
import isEmpty from 'lodash/isEmpty';
import { formatNumber, floatToPercent } from 'Bot/helper';
import ParamaterPage from 'Bot/Strategies/components/ParamaterPage';

export default ({ isActive, runningData: { id, symbolCode } }) => {
  const params = useSelector((state) => state.aifuturetrend.runParams);
  const ParamaterLoading = useSelector((state) => state.aifuturetrend.ParamaterLoading);
  const dispatch = useDispatch();
  const symbolInfo = useFutureSymbolInfo(symbolCode);
  const { quota, symbolNameText, precision } = symbolInfo;

  const onFresh = useCallback(() => {
    dispatch({
      type: 'aifuturetrend/getParameter',
      payload: {
        id,
      },
    });
  }, []);
  useLayoutEffect(() => {
    isActive && onFresh();
  }, [isActive]);

  if (isEmpty(params) || ParamaterLoading) return null;
  return (
    <ParamaterPage id={id} symbolNameText={symbolNameText}>
      <ParamRow
        label={_t('card6')}
        value={formatNumber(params.limitAsset, precision)}
        unit={quota}
      />
      <ParamRow label={_t('futrgrid.leveragex')} value={`${params.leverage}x`} />
      <ParamRow label={_t('bearmaxback')} value={floatToPercent(params.pullBack)} />
      <ParamRow
        label={_t('lossstop')}
        checkUnSet
        rawValue={params.stopLossPercent}
        value={floatToPercent(params.stopLossPercent)}
      />
      <ParamRow
        label={_t('takeprofit')}
        checkUnSet
        rawValue={params.stopProfitPercent}
        value={floatToPercent(params.stopProfitPercent)}
      />
    </ParamaterPage>
  );
};

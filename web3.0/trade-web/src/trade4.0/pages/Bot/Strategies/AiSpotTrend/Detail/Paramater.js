/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'dva';
import { ParamRow } from 'Bot/components/Common/Row';
import { _t, _tHTML } from 'Bot/utils/lang';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';
import isEmpty from 'lodash/isEmpty';
import { formatNumber } from 'Bot/helper';
import ParamaterPage from 'Bot/Strategies/components/ParamaterPage';

export default ({ isActive, runningData: { id, symbol } }) => {
  const params = useSelector((state) => state.aispottrend.runParams);
  const ParamaterLoading = useSelector((state) => state.aispottrend.ParamaterLoading);
  const dispatch = useDispatch();
  const symbolInfo = useSpotSymbolInfo(symbol);
  const { quota, symbolNameText, quotaPrecision } = symbolInfo;

  const onFresh = useCallback(() => {
    dispatch({
      type: 'aispottrend/getParameter',
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
        value={formatNumber(params.limitAsset, quotaPrecision)}
        unit={quota}
      />
    </ParamaterPage>
  );
};

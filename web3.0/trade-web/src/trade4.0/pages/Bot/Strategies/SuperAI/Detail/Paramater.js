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
import { Switch } from '@kux/mui';
import Popover from 'Bot/components/Common/Popover';
import ParamaterPage from 'Bot/Strategies/components/ParamaterPage';
import { DashText } from 'Bot/components/Widgets';

export default ({ isActive, onClose, runningData: { id, symbol, status }, mode }) => {
  const params = useSelector((state) => state.superai.runParams);
  const ParamaterLoading = useSelector((state) => state.superai.ParamaterLoading);
  const dispatch = useDispatch();
  const symbolInfo = useSpotSymbolInfo(symbol);
  const { quota, pricePrecision, symbolNameText } = symbolInfo;

  const onFresh = useCallback(() => {
    dispatch({
      type: 'superai/getParameter',
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
        labelPopoverContent={_tHTML('bgDzqPo1QJkQBdvGkVD5dQ')}
        label={_t('ceKb5AFY7BnmumCxsKpJ4b')}
        valueSlot={<Switch checked disabled />}
      />

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
        value={formatNumber(params.entryPrice, pricePrecision)}
        unit={quota}
      />
      <ParamRow label={_t('robotparams10')} value={`${+params.depth - 1}`} unit={_t('unit')} />
    </ParamaterPage>
  );
};

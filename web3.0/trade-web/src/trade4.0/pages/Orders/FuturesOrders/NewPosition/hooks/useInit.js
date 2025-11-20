/**
 * Owner: charles.yang@kupotech.com
 */
import React, { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { namespace } from '../config';
import { useGetUserOpenFutures } from '@/hooks/futures/useGetUserFuturesInfo';
import { FUTURES } from '@/meta/const';
import { useTradeType } from '@/hooks/common/useTradeType';
import { useFuturesWorkerSubscribe } from '@/hooks/useWorkerSubscribe';
import { useGetPosTableData } from 'src/trade4.0/hooks/futures/usePosition';

const prefixTopic = '/contract/positionAll';
const prefixTopicTrialFund = '/trialContract/positionAll';

export const useInit = () => {
  const dispatch = useDispatch();
  const openPositions = useGetPosTableData();
  const openContract = useGetUserOpenFutures();
  const tradeType = useTradeType();
  const isFutures = tradeType === FUTURES;

  useFuturesWorkerSubscribe(prefixTopic, true);
  useFuturesWorkerSubscribe(prefixTopicTrialFund, true);

  const initPullPositions = useCallback(() => {
    if (openContract && isFutures) {
      dispatch({
        type: `${namespace}/initPullPositions`,
        payload: { queryAll: true },
      });
    }
  }, [dispatch, openContract, isFutures]);

  useEffect(() => {
    if (isFutures) {
      initPullPositions();
      dispatch({
        type: `${namespace}/pullMarketList`,
        payload: { queryAll: true },
      });
    }
  }, [initPullPositions, dispatch, isFutures]);

  const Len = openPositions.length;
  useEffect(() => {
    if (Len > 0 && isFutures) {
      dispatch({
        type: `${namespace}/getBattleDetail`,
        payload: {
          symbol: 'XBTUSDTM',
        },
      });
    }
  }, [Len, dispatch, isFutures]);
};

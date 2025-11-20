/**
 * Owner: charles.yang@kupotech.com
 */
import React, { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import useFuturesPositionData from '../hooks/positions/useFuturesPositionData';
import { futuresPositionNameSpace } from '../config';
import { useGetUserOpenFutures } from '@/hooks/futures/useGetUserFuturesInfo';
import useLoginDrawer from '@/hooks/useLoginDrawer';
import { FUTURES } from '@/meta/const';
import { useTradeType } from '@/hooks/common/useTradeType';
import { useFuturesWorkerSubscribe } from '@/hooks/useWorkerSubscribe';

const prefixTopic = '/contract/positionAll';
const prefixTopicTrialFund = '/trialContract/positionAll';

const usePositionsInit = () => {
  const dispatch = useDispatch();
  const openPositions = useFuturesPositionData();
  const openContract = useGetUserOpenFutures();
  const { isLogin } = useLoginDrawer();
  const tradeType = useTradeType();
  const isFutures = tradeType === FUTURES;

  useFuturesWorkerSubscribe(prefixTopic, true);
  useFuturesWorkerSubscribe(prefixTopicTrialFund, true);

  const initPullPositions = useCallback(() => {
    if (openContract && isFutures) {
      dispatch({
        type: `${futuresPositionNameSpace}/initPullPositions`,
        payload: { queryAll: true },
      });
    }
  }, [dispatch, openContract, isFutures]);

  useEffect(() => {
    if (isFutures) {
      initPullPositions();
      dispatch({
        type: `${futuresPositionNameSpace}/pullMarketList`,
        payload: { queryAll: true },
      });
    }
  }, [initPullPositions, dispatch, isFutures]);

  const Len = openPositions.length;
  useEffect(() => {
    if (Len > 0 && isFutures) {
      dispatch({
        type: `${futuresPositionNameSpace}/getBattleDetail`,
        payload: {
          symbol: 'XBTUSDTM',
        },
      });
    }
  }, [Len, dispatch, isFutures]);
};

export default usePositionsInit;

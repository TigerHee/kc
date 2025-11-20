/**
 * Owner: borden@kupotech.com
 */
import { useEffect } from 'react';
import { isArray } from 'lodash';
import { Topic } from '@kc/socket';
import { useDispatch, useSelector } from 'dva';
import workerSocket from 'common/utils/socketProcess';
import futuresWorkerSocket from 'common/utils/futuresSocketProcess';

export function getTopic(topicTemp, symbols) {
  if (!symbols || !symbols?.length) return '';
  return Topic.get(topicTemp, {
    SYMBOLS: isArray(symbols) ? symbols : [symbols],
  });
}
// 同步记录topic的使用情况，以便处理重复订阅 & 错误取消订阅
const syncStatistics = {};

export default function useWorkerSubscribe(topic, privateChannel = false) {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => !!state.user.isLogin);

  useEffect(() => {
    if (isLogin && privateChannel && topic) {
      if ((syncStatistics[topic] || 0) <= 0) {
        workerSocket.subscribe(topic, privateChannel);
      }
      syncStatistics[topic] = (syncStatistics[topic] || 0) + 1;
      dispatch({
        type: 'socket/updateStatistics',
        payload: { topic },
      });
    }
    return () => {
      if (isLogin && privateChannel && topic) {
        if ((syncStatistics[topic] || 0) - 1 <= 0) {
          workerSocket.unsubscribe(topic, privateChannel);
        }
        syncStatistics[topic] = (syncStatistics[topic] || 0) - 1;
        dispatch({
          type: 'socket/updateStatistics',
          payload: { topic, count: -1 },
        });
      }
    };
  }, [privateChannel, topic, isLogin, dispatch]);

  useEffect(() => {
    if (!privateChannel && topic) {
      if ((syncStatistics[topic] || 0) <= 0) {
        workerSocket.subscribe(topic, privateChannel);
      }
      dispatch({
        type: 'socket/updateStatistics',
        payload: { topic },
      });
    }
    return () => {
      if (!privateChannel && topic) {
        if ((syncStatistics[topic] || 0) - 1 <= 0) {
          workerSocket.unsubscribe(topic, privateChannel);
        }
        syncStatistics[topic] = (syncStatistics[topic] || 0) - 1;
        dispatch({
          type: 'socket/updateStatistics',
          payload: { topic, count: -1 },
        });
      }
    };
  }, [topic, privateChannel, dispatch]);
}

export function useFuturesWorkerSubscribe(topic, privateChannel = false) {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => !!state.user.isLogin);

  useEffect(() => {
    if (isLogin && privateChannel && topic) {
      if ((syncStatistics[topic] || 0) <= 0) {
        futuresWorkerSocket.subscribe(topic, privateChannel);
      }
      syncStatistics[topic] = (syncStatistics[topic] || 0) + 1;
      dispatch({
        type: 'socket/updateFuturesStatistics',
        payload: { topic },
      });
    }
    return () => {
      if (isLogin && privateChannel && topic) {
        if ((syncStatistics[topic] || 0) - 1 <= 0) {
          futuresWorkerSocket.unsubscribe(topic, privateChannel);
        }
        syncStatistics[topic] = (syncStatistics[topic] || 0) - 1;
        dispatch({
          type: 'socket/updateFuturesStatistics',
          payload: { topic, count: -1 },
        });
      }
    };
  }, [privateChannel, topic, isLogin, dispatch]);

  useEffect(() => {
    if (!privateChannel && topic) {
      if ((syncStatistics[topic] || 0) <= 0) {
        futuresWorkerSocket.subscribe(topic, privateChannel);
      }
      dispatch({
        type: 'socket/updateFuturesStatistics',
        payload: { topic },
      });
    }
    return () => {
      if (!privateChannel && topic) {
        if ((syncStatistics[topic] || 0) - 1 <= 0) {
          futuresWorkerSocket.unsubscribe(topic, privateChannel);
        }
        syncStatistics[topic] = (syncStatistics[topic] || 0) - 1;
        dispatch({
          type: 'socket/updateFuturesStatistics',
          payload: { topic, count: -1 },
        });
      }
    };
  }, [topic, privateChannel, dispatch]);
}

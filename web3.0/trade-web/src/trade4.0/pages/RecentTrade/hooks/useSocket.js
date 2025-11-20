/*
 * owner: Clyne@kupotech.com
 */
import { useEffect } from 'react';
import workerSocket from 'common/utils/socketProcess';
import futuresWorkerSocket from 'common/utils/futuresSocketProcess';

import * as ws from '@kc/socket';
import {
  getCurrentSymbol,
  useGetCurrentSymbol,
} from '@/hooks/common/useSymbol';
import { forEach, get } from 'lodash';
import { getStore } from 'src/utils/createApp';
import { maxSize, namespace, name } from '../config';
import { RecentTradeTopic } from '@/meta/newTopic';
import voiceQueue from 'src/trade4.0/utils/voice';
import { useTradeType } from 'src/trade4.0/hooks/common/useTradeType';
import { FUTURES } from 'src/trade4.0/meta/const';

let isRecentBind = false;

const recentTradeHandle = ({ dispatch }) => {
  if (!isRecentBind) {
    workerSocket.dealOrdersMessage((arr) => {
      const store = getStore().getState().setting;
      const hasRecentTrade =
        get(store, `inLayoutIdMap.${name}`, undefined) !== undefined;
      if (hasRecentTrade) {
        voiceQueue.notify('recent_trade');
      }

      const currentSymbol = getCurrentSymbol();
      const originList = getStore().getState()[namespace].data[currentSymbol] || [];
      const originMaxSeq = originList[0]?.sequence || 0;
      const origin = [];
      // console.log('====socket', arr);
      // 剔除无用字段，
      // sequence对比

      forEach(arr, ({ data: itemData, topic }) => {
        // fix: 切换symbol的时候，取消订阅还没成功，这个时候还会收到socket来的之前的交易对数据，这里做个比较
        const symbol = topic.split(':')[1];
        if (currentSymbol === symbol) {
          forEach(itemData, (data) => {
            const { sequence, time, size, side, price } = data;
            if (Number(sequence) > Number(originMaxSeq)) {
              origin.push({ sequence, time, size, side, price });
            }
          });
        }
      });
      // 排序 大到小
      const ret = origin
        .sort((a, b) => {
          return Number(b.sequence) - Number(a.sequence);
        })
        .concat(originList);

      dispatch({
        type: `${namespace}/update`,
        payload: {
          data: { [currentSymbol]: ret.slice(0, maxSize) },
        },
      });
    });

    futuresWorkerSocket.topicRecentDeal((arr = []) => {
      const currentSymbol = getCurrentSymbol();
      const originList = getStore().getState()[namespace].data[currentSymbol] || [];
      const originMaxTs = originList[0]?.time || 0;
      const origin = [];
      // console.log('====socket', arr);
      // 剔除无用字段，
      // sequence对比
      forEach(arr, ({ data, topic }) => {
        // fix: 切换symbol的时候，取消订阅还没成功，这个时候还会收到socket来的之前的交易对数据，这里做个比较
        const symbol = topic.split(':')[1];
        if (currentSymbol === symbol) {
          const { sequence, ts: time, size, side, price } = data;
          if (Number(time) > Number(originMaxTs)) {
            origin.push({ sequence, time, size, side, price });
          }
        }
      });
      // 排序 大到小
      const ret = origin
        .sort((a, b) => {
          return Number(b.time) - Number(a.time);
        })
        .concat(originList);

      dispatch({
        type: `${namespace}/update`,
        payload: {
          data: {
            [currentSymbol]: ret.slice(0, maxSize),
          },
        },
      });

      // 增加合约最近成交声音
      const store = getStore().getState().setting;
      const hasRecentTrade =
        get(store, `inLayoutIdMap.${name}`, undefined) !== undefined;
      if (hasRecentTrade) {
        voiceQueue.notify('recent_trade');
      }
    });
    isRecentBind = true;
  }
};

export const useSocket = (dispatch) => {
  const currentSymbol = useGetCurrentSymbol();
  const tradeType = useTradeType();

  useEffect(() => {
    recentTradeHandle({ dispatch });
  }, [dispatch]);

  useEffect(() => {
    if (tradeType !== FUTURES && currentSymbol) {
      const recentTradeTopic = ws.Topic.get(RecentTradeTopic, {
        SYMBOLS: [currentSymbol],
      });

      // 订阅
      workerSocket.subscribe(recentTradeTopic, false);
      // 取消订阅;
      return () => {
        workerSocket.unsubscribe(recentTradeTopic, false);
      };
    } else if (tradeType === FUTURES && currentSymbol) {
      const futureTopic = `/contractMarket/execution:${currentSymbol}`;
      futuresWorkerSocket.subscribe(futureTopic, false);
      return () => {
        futuresWorkerSocket.unsubscribe(futureTopic, false);
      };
    }
  }, [currentSymbol, tradeType]);
};

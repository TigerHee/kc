/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-28 15:53:46
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-01-08 20:38:12
 * @FilePath: /trade-web/src/trade4.0/pages/Orders/Common/hooks/useThrottleVoice.js
 * @Description:播放声音节流
 */
import React, { memo, useEffect, useRef } from 'react';
import { _t, _tHTML } from 'src/utils/lang';
import useWorkerSubscribe, { getTopic } from '@/hooks/useWorkerSubscribe';
import socketStore from 'src/pages/Trade3.0/stores/store.socket';
import storage from 'utils/storage.js';
import { useDispatch, useSelector } from 'dva';
import workerSocket, { PushConf } from 'common/utils/socketProcess';
import { pullSummary } from '@/pages/Orders/OpenOrders/hooks/useSocketPull';
import voiceQueue from 'src/trade4.0/utils/voice';
import * as ws from '@kc/socket';

let isRecentBind = false;

const recentTradeHandle = ({ dispatch }) => {
  if (!isRecentBind) {
    workerSocket.symbolPriceUpDown((arr) => {
      if (arr.length > 0) {
        if (arr[0]?.data?.direction === 0) {
          // 0 为行情下跌
          voiceQueue.notify('market_down');
        } else if (arr[0]?.data?.direction === 1) {
          // 1 为行情上升
          voiceQueue.notify('market_up');
        }
      }
    });
  }
  isRecentBind = true;
};
/**
 * @description: 当前委托 websocket 监听，声音节流。需要在框架层监听
 * @return {*}
 */
export const useThrottleVoice = () => {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.user.isLogin);
  const currentSymbol = useSelector((state) => state.trade.currentSymbol);
  const soundReminderSettings = useSelector((state) => state.setting.soundReminderSettings);

  const currentOrders = socketStore.useSelector((state) => state.socket.currentOrders);
  const advancedOrders = socketStore.useSelector((state) => state.socket.advancedOrders);

  useWorkerSubscribe('/spotMarket/tradeOrdersBatchFrequency500', true);
  useWorkerSubscribe('/spotMarket/advancedOrdersFrequency500', true);

  // 声音模块，行情涨跌幅订阅
  useEffect(() => {
    const recentTradeTopic = ws.Topic.get(`/symbol/priceUpDown:${currentSymbol}`);
    if (soundReminderSettings?.marketDown || soundReminderSettings?.marketUp) {
      if (currentSymbol) {
        // 订阅
        workerSocket.subscribe(recentTradeTopic, false);
      }
    }
    // 取消订阅;
    return () => {
      workerSocket.unsubscribe(recentTradeTopic, false);
    };
  }, [currentSymbol, soundReminderSettings]);

  useEffect(() => {
    recentTradeHandle({ dispatch });
  }, [dispatch]);

  // 集合竞价订单信息订阅
  useWorkerSubscribe(PushConf.CallAuctionOrders.topic, true);
  const hasCurrentOrdersChange = useRef(false);
  const hasAdvancedOrdersChange = useRef(false);

  // 当前委托 消息订阅
  useEffect(() => {
    if (hasCurrentOrdersChange.current && isLogin) {
      if (currentOrders?.includes('match')) {
        voiceQueue.notify('orders_partially_completed');
      }
      if (currentOrders?.includes('done')) {
        voiceQueue.notify('orders_fully_completed');
      }
      pullSummary();
    } else {
      hasCurrentOrdersChange.current = true;
    }
  }, [isLogin, currentOrders]);

  // 高级委托 消息订阅
  useEffect(() => {
    if (hasAdvancedOrdersChange.current && isLogin) {
      if (advancedOrders?.includes('TRIGGERED')) {
        voiceQueue.notify('trigger_advanced_orders');
      }
      pullSummary();
    } else {
      hasAdvancedOrdersChange.current = true;
    }
  }, [isLogin, advancedOrders]);
};

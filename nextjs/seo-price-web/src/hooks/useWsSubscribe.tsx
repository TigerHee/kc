/**
 * Owner: willen@kupotech.com
 * client组件
 */
import { endsWith, each, replace, difference, uniq } from 'lodash-es';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import asyncSocket from '@/tools/asyncSocket';
import { useMount, usePrevious, useUnmount, useUpdateEffect } from 'ahooks';

type Vars = { SYMBOLS?: string[]; SYMBOL_TYPES?: string[] };

const topicCounter: Record<string, number> = {};

// Topic带该后缀，代表是私有频道
const privateSuffix = '@@@private';

const checkPrivate = (topic: string) => endsWith(topic, privateSuffix);

const getOriginTopic = (topic: string) => {
  const reg = new RegExp(privateSuffix, 'g');
  return replace(topic, reg, '');
};

export const getSymbolTypes = (props) => {
  const { symbol, resolution } = props;
  let type = '8hour';
  if (resolution === '1D' || resolution === 'D') {
    type = '1day';
  } else if (resolution === '1W' || resolution === 'W') {
    type = '1week';
  } else {
    const resolutionNum = parseFloat(resolution);
    if (resolutionNum < 60) {
      type = `${resolution}min`;
    } else if (resolutionNum >= 60 && resolutionNum < 1440) {
      type = `${resolutionNum / 60}hour`;
    }
  }
  return `${symbol}_${type}`;
};

export const getSymbolTypeFromTopic = (topic) => `${topic}`.split(':')[1];

export const onRealtimeCallKey = (i: number) => `k${i}`;

const createTopicMappingList = async (topicArr: [string, Vars][]): Promise<string[]> => {
  const res = await new Promise<string[]>((resolve) => {
    const topicArrs: string[] = [];
    each(topicArr, ([tpl, vars]) => {
      if (tpl) {
        asyncSocket((socket, ws) => {

          topicArrs.push(ws.Topic.get(tpl, vars || {}));
          
          if (topicArrs.length === topicArr.length) {
            resolve(topicArrs);
          }
        });
      }
    });
  });

  return res;
};

/**
 * 计数订阅
 * @param {*} topic
 * @param {*} onTopicSubscribe 每次回调
 * @param {*} onMessageReceived 真实订阅回调
 */
const subscribeTopic = (topic: string, onTopicSubscribe: ((topic: string) => void), onMessageReceived: ((message: any) => void), privateChannel?: boolean) => {
  if (topicCounter[topic]) {
    topicCounter[topic] += 1;
  } else {
    topicCounter[topic] = 1;
    asyncSocket((socket) => {
      socket.subscribe(topic, onMessageReceived, privateChannel);
    });
  }

  if (typeof onTopicSubscribe === 'function') {
    onTopicSubscribe(topic);
  }
};

const unsubscribeTopic = (topic, callback, realCallback, privateChannel) => {
  if (topicCounter[topic] > 1) {
    topicCounter[topic] -= 1;
  } else {
    delete topicCounter[topic];
    asyncSocket((socket) => {
      socket.unsubscribe(topic, realCallback, privateChannel);
    });
  }

  if (typeof callback === 'function') {
    callback(topic);
  }
};

type WsSubscribeOptions = {
  props: any;
  wsInstanceId: number;
  getTopics: (...args: any[]) => [string, Vars][], // 获取主题的异步函数，返回唯一主题数组
  didUpdateDeps: any[], // 判断是否需要更新主题的函数
  onUnSubscribe?: (topic: string, props?: any) => void, // 取消订阅时的回调函数（可选）
  onSubscribe?: (topic: string, props?: any) => void, // 订阅时的回调函数（可选）
  onRealUnSubscribe?: (topic: string, props?: any) => void, // 实际取消订阅时的回调函数（可选）
  onRealSubscribe?: (topic: string, props?: any) => void, // 实际订阅时的回调函数（可选）
}

const useWsSubscribe = ({
  props,
  wsInstanceId,
  getTopics,
  didUpdateDeps,
  onUnSubscribe,
  onSubscribe,
  onRealUnSubscribe,
  onRealSubscribe,
}: WsSubscribeOptions) => {

  const _getTopics = useCallback(async (...args: any[]) => {
    const topicArr = getTopics(...args);
    const arr = await createTopicMappingList(topicArr);
    return uniq(arr);
  }, [getTopics]);

  const doTopicSubscriptionManage = useCallback((arr: string[], isSubscribe: boolean, props: any) => {
    each(arr, (_topic) => {
      const isPrivate = checkPrivate(_topic);

      if (isPrivate) {
        _topic = getOriginTopic(_topic);
      }
      
      if (isSubscribe) {
        // 订阅topic
        let _onSubCallback;

        if (typeof onSubscribe === 'function') {
          _onSubCallback = (topic: string) => onSubscribe(topic, props);
        }

        let _onRealSubCallback;

        if (typeof onRealSubscribe === 'function') {
          _onRealSubCallback = (topic: string) => onRealSubscribe(topic, props);
        }

        subscribeTopic(_topic, _onSubCallback, _onRealSubCallback, isPrivate);
      } else {
        // 取消订阅topic
        let _onUnSubCallback;

        if (typeof onUnSubscribe === 'function') {
          _onUnSubCallback = (topic: string) => onUnSubscribe(topic, props);
        }

        let _onRealUnSubCallback;
        if (typeof onRealUnSubscribe === 'function') {
          _onRealUnSubCallback = (topic: string) => onRealUnSubscribe(topic, props);
        }
        unsubscribeTopic(_topic, _onUnSubCallback, _onRealUnSubCallback, isPrivate);
      }
    });
  }, [onRealSubscribe, onRealUnSubscribe, onSubscribe, onUnSubscribe]);


  const wrapProps = useCallback((props: any) => ({
    ...props,
    _wsInstanceId: wsInstanceId,
  }), [wsInstanceId]);

  const previewsProps = usePrevious(props);


  useUpdateEffect(() => {
    asyncSocket(async (socket, ws) => {
      const topicArrPrev = await _getTopics(ws.Topic, previewsProps);
      const topicArrCurrent = await _getTopics(ws.Topic, props);

      // unsubscribe old
      const diffToUnSub = difference(topicArrPrev, topicArrCurrent);
      doTopicSubscriptionManage(diffToUnSub, false, wrapProps(previewsProps));

      // subscribe new
      const diffToSub = difference(topicArrCurrent, topicArrPrev);
      doTopicSubscriptionManage(diffToSub, true, wrapProps(props));
    });
  }, didUpdateDeps);


  useMount(() => {
    if (typeof getTopics !== 'function') {
      throw new Error('getTopics & didUpdate should be function');
    }

    // subscribe
    asyncSocket(async (socket, ws) => {
      const topicArr = await _getTopics(ws.Topic, props);

      doTopicSubscriptionManage(topicArr, true, wrapProps(props));
    });
  });

  useUnmount(() => {
    // unsubscribe
    asyncSocket(async (socket, ws) => {
      const topicArr = await _getTopics(ws.Topic, props);
      doTopicSubscriptionManage(topicArr, false, wrapProps(props));
    });
  });
};

export { privateSuffix };

export default useWsSubscribe;

/**
 * Owner: roger.chen@kupotech.com
 */
/**
 * 处理websocket订阅
 */
import {useEffect, useCallback, useRef} from 'react';
import _ from 'lodash';
import * as ws from '@kc/socket/lib/rn';

const socket = ws.getInstance();
// Topic带该后缀，代表是私有频道
const privateSuffix = '@@@private';

const checkPrivate = topic => _.endsWith(topic, privateSuffix);
const getOriginTopic = topic => {
  const reg = new RegExp(privateSuffix, 'g');
  return _.replace(topic, reg, '');
};
const mapTopicArrs = topicArr => {
  const topicArrs = [];
  _.each(topicArr, ([tpl, vars]) => {
    if (tpl) {
      topicArrs.push(ws.Topic.get(tpl, vars || {}));
    }
  });
  return topicArrs;
};

/**
 * 订阅
 * @param {*} topic
 * @param {*} callback 每次回调
 * @param {*} realCallback 真实订阅回调
 */
const subscribeCounter = (topic, callback, realCallback, privateChannel) => {
  console.log('--准备监听--', topic, privateChannel);
  socket.subscribe(topic, realCallback, privateChannel);

  if (typeof callback === 'function') {
    callback(topic);
  }
};
const unsubscribeCounter = (topic, callback, realCallback, privateChannel) => {
  console.log('--取消监听--', topic, privateChannel);
  socket.unsubscribe(topic, realCallback, privateChannel);

  if (typeof callback === 'function') {
    callback(topic);
  }
};

export default props => {
  const {onSubscribe, onRealSubscribe, onUnSubscribe, onRealUnSubscribe} =
    props || {};
  const topicArrPrev = useRef([]);

  const _mapSubs = useCallback((arr, isSubscribe) => {
    if (!arr || !arr.length) {
      return;
    }
    _.each(arr, _topic => {
      const isPrivate = checkPrivate(_topic);
      if (isPrivate) {
        _topic = getOriginTopic(_topic);
      }
      if (isSubscribe) {
        let _onSubCallback;
        if (typeof onSubscribe === 'function') {
          _onSubCallback = topic => onSubscribe(topic, props);
        }

        let _onRealSubCallback;
        if (typeof onRealSubscribe === 'function') {
          _onRealSubCallback = topic => onRealSubscribe(topic, props);
        }

        subscribeCounter(_topic, _onSubCallback, _onRealSubCallback, isPrivate);
      } else {
        let _onUnSubCallback;
        if (typeof onUnSubscribe === 'function') {
          _onUnSubCallback = topic => onUnSubscribe(topic, props);
        }

        let _onRealUnSubCallback;
        if (typeof onRealUnSubscribe === 'function') {
          _onRealUnSubCallback = topic => onRealUnSubscribe(topic, props);
        }
        unsubscribeCounter(
          _topic,
          _onUnSubCallback,
          _onRealUnSubCallback,
          isPrivate,
        );
      }
    });
    // 初始化生成后，不允许参数变化
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTopics = useCallback(
    list => {
      // 设置topic，自动处理取消或者增加监听，由页面主动触发
      console.log('--开始处理监听--', list, topicArrPrev.current);
      const arr = mapTopicArrs(list || []);
      const topicArr = _.uniq(arr);
      // 取消旧的监听
      const diffToUnSub = _.difference(topicArrPrev.current, topicArr);
      _mapSubs(diffToUnSub, false);
      // 增加新的监听
      const diffToSub = _.difference(topicArr, topicArrPrev.current);
      _mapSubs(diffToSub, true);
      topicArrPrev.current = topicArr;
    },
    [_mapSubs],
  );

  const cleanTopics = useCallback(() => {
    // 清理所有的监听
    console.log('--清理监听--', topicArrPrev.current);
    _mapSubs(topicArrPrev.current, false);
    topicArrPrev.current = [];
  }, [_mapSubs]);

  useEffect(() => {
    // 页面注销时主动清理监听
    return () => {
      cleanTopics();
    };
  }, [cleanTopics]);

  return {
    socket,
    Topic: ws.Topic,
    setTopics,
    cleanTopics,
  };
};

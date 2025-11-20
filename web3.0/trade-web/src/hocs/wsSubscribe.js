/**
 * Owner: borden@kupotech.com
 */
/**
 * 管理订阅websocket数据通道的高阶组件
 */
import _ from 'lodash';
import React from 'react';
import * as ws from '@kc/socket';
import workerSocket from 'src/common/utils/socketProcess';

const topicCounter = {};
let _MAX_INSTANCE_ID = 0;
// Topic带该后缀，代表是私有频道
const privateSuffix = '@@@private';

/**
 * topic list 属性值，用于可能需要基于 topic 来做数据过滤
 */
export const TopicListKey = '__TopicListKey__';

const checkPrivate = (topic) => _.endsWith(topic, privateSuffix);
export const getOriginTopic = (topic) => {
  const reg = new RegExp(privateSuffix, 'g');
  return _.replace(topic, reg, '');
};

const mapTopicArrs = (topicArr) => {
  const topicArrs = [];
  _.each(topicArr, ([tpl, vars]) => {
    if (tpl) {
      topicArrs.push(ws.Topic.get(tpl, vars || {}));
    }
  });
  return topicArrs;
};

const WORKER_TOPICS = [
  ws.Topic.MARKET_MATCH,
  ws.Topic.MARKET_LEVEL2_WEB,
  // '/spotMarket/tradeOrders',
  '/spotMarket/tradeOrders-batch',
  '/spotMarket/advancedOrders',
  ws.Topic.ACCOUNT_BALANCE_SNAPSHOT,
  '/spotMarket/level2Depth50:{SYMBOL_LIST}', // level2-50 档推送
];

export const checkTopicInWorkerWay = (topic) => {
  for (let i = WORKER_TOPICS.length - 1; i >= 0; i--) {
    if (topic.indexOf(`${WORKER_TOPICS[i].split(':')[0]}`) === 0) {
      return true;
    }
  }
  return false;
};

/**
 * 计数订阅
 * @param {*} topic
 * @param {*} callback 每次回调
 * @param {*} realCallback 真实订阅回调
 */
export const subscribeCounter = (topic, callback, realCallback, privateChannel) => {
  if (topicCounter[topic]) {
    topicCounter[topic] += 1;
  } else {
    topicCounter[topic] = 1;

    if (1 || checkTopicInWorkerWay(topic)) {
      workerSocket.subscribe(topic, privateChannel);
    } else {
      // socket.subscribe(topic, realCallback, privateChannel);
    }
  }

  if (typeof callback === 'function') {
    callback(topic);
  }
};

export const unsubscribeCounter = (topic, callback, realCallback, privateChannel) => {
  if (topicCounter[topic] > 1) {
    topicCounter[topic] -= 1;
  } else {
    delete topicCounter[topic];

    if (1 || checkTopicInWorkerWay(topic)) {
      workerSocket.unsubscribe(topic, privateChannel);
    } else {
      // socket.unsubscribe(topic, realCallback, privateChannel);
    }
  }

  if (typeof callback === 'function') {
    callback(topic);
  }
};

/*
@wsSubscribe({
  getTopics: (Topic, props) => {
    // getTopics
    return [
      [Topic.TOPIC, vars],
    ];
  },
  didUpdate: (prevProps, currentProps) => {
    // didUpdate
    return true | false;
  },
  onSubscribe: (topic, props) => {
  },
  onUnSubscribe: (topic, props) => {
  },
  onRealSubscribe: (topic, props) => {
  },
  onRealUnSubscribe: (topic, props) => {
  },
})
class Component extends React.Component {
  ...
}
*/
const wsSubscribe = ({
  /** get topics function */
  getTopics,
  /** should update topic function */
  didUpdate,
  /** on unsubscribe callback function */
  onUnSubscribe,
  /** on subscribe callback function */
  onSubscribe,
  /** on real unsubscribe function */
  onRealUnSubscribe,
  /** on real subscribe function */
  onRealSubscribe,
}) => {
  if (typeof getTopics !== 'function' || typeof didUpdate !== 'function') {
    throw new Error('getTopics & didUpdate should be function');
  }
  const _getTopics = (...args) => {
    const topicArr = getTopics(...args);
    const arr = mapTopicArrs(topicArr);
    return _.uniq(arr);
  };

  const _mapSubs = (arr, isSubscribe, props) => {
    _.each(arr, (_topic) => {
      const isPrivate = checkPrivate(_topic);
      if (isPrivate) {
        _topic = getOriginTopic(_topic);
      }
      if (isSubscribe) {
        let _onSubCallback;
        if (typeof onSubscribe === 'function') {
          _onSubCallback = (topic) => onSubscribe(topic, props);
        }

        let _onRealSubCallback;
        if (typeof onRealSubscribe === 'function') {
          _onRealSubCallback = (topic) => onRealSubscribe(topic, props);
        }

        subscribeCounter(_topic, _onSubCallback, _onRealSubCallback, isPrivate);
      } else {
        let _onUnSubCallback;
        if (typeof onUnSubscribe === 'function') {
          _onUnSubCallback = (topic) => onUnSubscribe(topic, props);
        }

        let _onRealUnSubCallback;
        if (typeof onRealUnSubscribe === 'function') {
          _onRealUnSubCallback = (topic) => onRealUnSubscribe(topic, props);
        }
        unsubscribeCounter(
          _topic,
          _onUnSubCallback,
          _onRealUnSubCallback,
          isPrivate,
        );
      }
    });
  };

  return (WrappedComponent) =>
    class WsSubscribe extends React.Component {
      constructor(props) {
        super(props);

        _MAX_INSTANCE_ID += 1;
        if (_MAX_INSTANCE_ID > 1e6) {
          _MAX_INSTANCE_ID = 0;
        }
        this.instanceId = _MAX_INSTANCE_ID;
        this.topicList = _getTopics(ws.Topic, props);
      }

      componentDidMount() {
        // subscribe
        const topicArr = _getTopics(ws.Topic, this.props);
        _mapSubs(topicArr, true, this.wrapProps(this.props));
      }

      componentDidUpdate(prevProps) {
        const currentProps = this.props;

        if (!didUpdate(prevProps, currentProps)) {
          return;
        }

        const topicArrPrev = _getTopics(ws.Topic, prevProps);
        const topicArrCurrent = _getTopics(ws.Topic, currentProps);

        // unsubscribe old
        const diffToUnSub = _.difference(topicArrPrev, topicArrCurrent);
        _mapSubs(diffToUnSub, false, this.wrapProps(prevProps));

        // subscribe new
        const diffToSub = _.difference(topicArrCurrent, topicArrPrev);
        _mapSubs(diffToSub, true, this.wrapProps(currentProps));
      }

      componentWillUnmount() {
        // unsubscribe
        const topicArr = _getTopics(ws.Topic, this.props);
        _mapSubs(topicArr, false, this.wrapProps(this.props));
      }

      wrapProps = (props) => {
        const list = _getTopics(ws.Topic, props);
        if (!_.isEqual(this.topicList, list)) {
          this.topicList = list;
        }
        return {
          ...props,
          [TopicListKey]: this.topicList,
          _wsInstanceId: this.instanceId,
        };
      };

      render() {
        return <WrappedComponent data-testid="wrapped-component" {...this.wrapProps(this.props)} />;
      }
    };
};

export { privateSuffix };
export default wsSubscribe;

// Topic {
// static MARKET_SNAPSHOT = '/market/snapshot:{SYMBOL_LIST}';
// static MARKET_TICKER = '/market/ticker:{SYMBOL_LIST}';
// static MARKET_LEVEL2 = '/market/level2:{SYMBOL_LIST}';
// static MARKET_MATCH = '/market/match:{SYMBOL_LIST}';
// static MARKET_LEVEL3 = '/market/level3:{SYMBOL_LIST}'; vars: { SYMBOLS }
// static MARKET_CANDLES = '/market/candles:{SYMBOL_TYPE_LIST}'; vars: { SYMBOL_TYPES }
// static ACCOUNT_BALANCE = '/account/balance';
// }

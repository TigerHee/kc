/**
 * Owner: willen@kupotech.com
 */
/**
 * 管理订阅websocket数据通道的高阶组件
 */
import _ from 'lodash';
import React from 'react';
import asyncSocket from 'tools/asyncSocket';

const topicCounter = {};
let _MAX_INSTANCE_ID = 0;
// Topic带该后缀，代表是私有频道
const privateSuffix = '@@@private';

const checkPrivate = (topic) => _.endsWith(topic, privateSuffix);
const getOriginTopic = (topic) => {
  const reg = new RegExp(privateSuffix, 'g');
  return _.replace(topic, reg, '');
};

const mapTopicArrs = async (topicArr) => {
  const res = await new Promise((resolve) => {
    const topicArrs = [];
    _.each(topicArr, ([tpl, vars]) => {
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
 * @param {*} callback 每次回调
 * @param {*} realCallback 真实订阅回调
 */
const subscribeCounter = (topic, callback, realCallback, privateChannel) => {
  if (topicCounter[topic]) {
    topicCounter[topic] += 1;
  } else {
    topicCounter[topic] = 1;
    asyncSocket((socket) => {
      socket.subscribe(topic, realCallback, privateChannel);
    });
  }

  if (typeof callback === 'function') {
    callback(topic);
  }
};

const unsubscribeCounter = (topic, callback, realCallback, privateChannel) => {
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

  const _getTopics = async (...args) => {
    const topicArr = getTopics(...args);
    const arr = await mapTopicArrs(topicArr);
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
        unsubscribeCounter(_topic, _onUnSubCallback, _onRealUnSubCallback, isPrivate);
      }
    });
  };

  return (WrappedComponent) =>
    class WsSubscribe extends React.Component {
      constructor(props) {
        super(props);

        _MAX_INSTANCE_ID += 1;
        this.instanceId = _MAX_INSTANCE_ID;
      }

      componentDidMount() {
        // subscribe
        asyncSocket(async (socket, ws) => {
          const topicArr = await _getTopics(ws.Topic, this.props);
          _mapSubs(topicArr, true, this.wrapProps(this.props));
        });
      }

      componentDidUpdate(prevProps) {
        const currentProps = this.props;

        if (!didUpdate(prevProps, currentProps)) {
          return;
        }
        asyncSocket(async (socket, ws) => {
          const topicArrPrev = await _getTopics(ws.Topic, prevProps);
          const topicArrCurrent = await _getTopics(ws.Topic, currentProps);

          // unsubscribe old
          const diffToUnSub = _.difference(topicArrPrev, topicArrCurrent);
          _mapSubs(diffToUnSub, false, this.wrapProps(prevProps));

          // subscribe new
          const diffToSub = _.difference(topicArrCurrent, topicArrPrev);
          _mapSubs(diffToSub, true, this.wrapProps(currentProps));
        });
      }

      componentWillUnmount() {
        // unsubscribe
        asyncSocket(async (socket, ws) => {
          const topicArr = await _getTopics(ws.Topic, this.props);
          _mapSubs(topicArr, false, this.wrapProps(this.props));
        });
      }

      wrapProps = (props) => ({
        ...props,
        _wsInstanceId: this.instanceId,
      });

      render() {
        return <WrappedComponent {...this.wrapProps(this.props)} />;
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

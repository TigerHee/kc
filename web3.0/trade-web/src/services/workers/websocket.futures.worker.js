/**
 * Owner: garuda@kupotech.com
 */
import KMSocket, { EVENT, TOPIC_STATE, SOCKET_STATE } from '@kc/socket';
import { MESSAGE, STATIC, TOPIC_PARAM_MAX_NUM } from './websocket.const';
import { forEach } from './a.tiny.lodash';
import makeDataFunc from './websocket.makeData';

const Socket = new KMSocket({ type: 'kumex' });

// init socket
const isChrome = /chrome/i.test(navigator.userAgent || '');
const useSlowFlush = /safari/i.test(navigator.userAgent || '') && !isChrome;

if (useSlowFlush) {
  console.log('use slow ws flush --->');
}

const socketData = {};

const getTopicParams = (topic) => {
  if (!topic) return;
  try {
    const [topicName, topicParam] = topic.split(':');
    if (!topicParam) return [topic];
    const paramArr = topicParam.split(',');
    if (paramArr.length < TOPIC_PARAM_MAX_NUM) {
      return [topic];
    } else {
      const result = [];
      for (let i = 0; i < paramArr.length; i += TOPIC_PARAM_MAX_NUM) {
        const params = paramArr.slice(i, i + TOPIC_PARAM_MAX_NUM);
        if (params && params.length) {
          result.push(`${topicName}:${params.toString()}`);
        }
      }
      return result;
    }
  } catch (e) {
    console.log(e, '获取topic参数异常');
  }
};

const subscribe = (topic, isPrivate) => {
  // 分批订阅
  const currentTopics = getTopicParams(topic);
  forEach(currentTopics, (currentTopic) => {
    Socket.subscribe(currentTopic, null, isPrivate);
  });
};

const unsubscribe = (topic, isPrivate) => {
  // 分批取消订阅
  const currentTopics = getTopicParams(topic);
  forEach(currentTopics, (currentTopic) => {
    Socket.unsubscribe(currentTopic, null, isPrivate);
  });
};

const connect = (opt) => {
  Socket.connect(opt);
};

const connected = () => {
  return Socket.getSocketState() === SOCKET_STATE.CONNECTED;
};

const flush = () => {
  // socket.flush();
};

const setCsrf = (csrf) => {
  // ws.setCsrf(csrf);
  return true;
};

let _socketId = -1;

const getId = () => Math.floor(Math.random() * 1000000000);

const socketId = () => {
  return _socketId;
  // return socket.socket ? socket.socket.id : -1;
};

/**
 * 重连陈工
 */
Socket.on(EVENT.CONNECTED, () => {
  _socketId = getId();
});
/**
 * 重连成功
 */
Socket.on(EVENT.RECONNECT, () => {
  _socketId = getId();
});

const topicState = () => {
  return {
    topicStateConst: TOPIC_STATE,
    topicState: Socket.getTopicState(),
  };
};

const makeSocketData = (params) => {
  if (!params) return;
  const { type, store } = params;
  const typeData = [...socketData[type]];
  socketData[type] = [];
  if (typeData && typeData.length) {
    return makeDataFunc[type](typeData, sendMessage, store);
  }
};

const sendMessage = (msg) => {
  self.postMessage(JSON.stringify(msg));
};

const DATA_METHOD = [
  STATIC.SUBSCRIBE,
  STATIC.UNSUBSCRIBE,
  STATIC.CONNECT,
  STATIC.CONNECTED,
  STATIC.SOCKETID,
  STATIC.TOPICSTATE,
  STATIC.SETCSRF,
  STATIC.FLUSH,
];

self.onmessage = (e) => {
  const data = JSON.parse(e.data);
  if (typeof data === 'string' && data === MESSAGE.PING) {
    // 回应开启
    // console.log('worker recive ping, post pong --->');
    sendMessage(MESSAGE.PONG);
  } else if (typeof data === 'object' && DATA_METHOD.includes(data.method)) {
    let res;
    switch (data.method) {
      case STATIC.SUBSCRIBE:
        // 订阅
        subscribe(...data.args);
        break;
      case STATIC.UNSUBSCRIBE:
        // 取消订阅
        unsubscribe(...data.args);
        break;
      case STATIC.CONNECT:
        // 连接
        // console.log('set ws host --->', data.host);
        // ws.setHost(data.host);
        connect(...data.args);
        break;
      case STATIC.CONNECTED:
        // 连接状态
        res = connected(...data.args);
        break;
      case STATIC.SOCKETID:
        // socketId
        res = socketId(...data.args);
        break;
      case STATIC.TOPICSTATE:
        // topicState
        res = topicState(...data.args);
        break;
      case STATIC.SETCSRF:
        // setCsrf
        res = setCsrf(...data.args);
        break;
      case STATIC.FLUSH:
        // 刷新缓冲区
        flush();
        break;
      default:
        break;
    }
    sendMessage({ data: res, workerSuccess: true, method: data.method, id: data.__msgId });
  } else if (typeof data === 'object' && data.method === STATIC.MAKE_DATA) {
    makeSocketData(data.args);
  }
};

// 订阅 socket 连接的状态
Socket.on(EVENT.CONNECTED, () => {
  sendMessage({ status: 'connect', method: STATIC.CONNECT_SUB });
});
Socket.on(EVENT.DISCONNECT, () => {
  sendMessage({ status: 'disconnect', method: STATIC.CONNECT_SUB });
});
/**
 * 重连失败
 */
Socket.on(EVENT.RECONNECT_FAIL, () => {
  sendMessage({
    type: STATIC.RECONNECTERROR,
  });
});

const genArrMessageTransfers = (configs, _socket) => {
  forEach(configs, ([_args, _type, _getStateKey, _notMakeData, opts]) => {
    _socket.topicMessage(..._args)((data) => {
      // 是否要makeData的流程
      if (!_notMakeData) {
        if (!socketData[_type]) {
          socketData[_type] = [];
        }
        socketData[_type].push(...data);
        // 是否要获取redux 中的 state 做处理
        if (_getStateKey && _getStateKey.length) {
          sendMessage({
            method: STATIC.GET_STORE,
            type: _type,
            keys: _getStateKey,
          });
        } else {
          makeSocketData({ type: _type });
        }
      } else {
        sendMessage({
          method: STATIC.TOPIC_MESSAGE,
          type: _type,
          data,
        });
      }
    }, opts);
  });
};

/**
 * 统一处理socket topicMessage 消息
 * [
 *  [topic, subject, isPrivate],
 *  type, // 消息处理类型，发送-接收消息以此来区分
 *  [keys] // 获取 store 的key
 *  notMakeData // 是否需要makeData的流程 true为不需要 false为需要
 *  {
 *   maxSize, // 节流长度
 *   frequency, // 节流时长
 *  },
 * ]
 */
genArrMessageTransfers(
  [
    [
      // 体验金仓位数据
      ['/trialContract/positionAll', 'position.change', true],
      STATIC.FUTURES_POSITION,
      [],
      true,
      { maxSize: 500, frequency: 1000 },
    ],
    [
      // 仓位数据
      ['/contract/positionAll', 'position.change', true],
      STATIC.FUTURES_POSITION,
      [],
      true,
      { maxSize: 500, frequency: 1000 },
    ],
    [
      // 活动委托
      ['/contractMarket/userActiveOrder', '', true],
      STATIC.FUTURES_ACTIVE_ORDER,
      ['futures_orders.activeOrders', 'futures_orders.symbolFilter'],
      false,
      { maxSize: 500, frequency: 800 },
    ],
    [
      // 体验金活动委托
      ['/trialContractMarket/userActiveOrder', '', true],
      STATIC.FUTURES_ACTIVE_ORDER,
      ['futures_orders.activeOrders', 'futures_orders.symbolFilter'],
      false,
      { maxSize: 500, frequency: 800 },
    ],
    [
      // 体验金条简单
      ['/trialContractMarket/stopOrder', '', true],
      STATIC.FUTURES_STOP_ORDER,
      ['futures_orders.stopOrders'],
      false,
      { maxSize: 500, frequency: 800 },
    ],
    [
      // 条件委托/止盈止损
      ['/contractMarket/stopOrder', '', true],
      STATIC.FUTURES_STOP_ORDER,
      ['futures_orders.stopOrders'],
      false,
      { maxSize: 500, frequency: 800 },
    ],
    [
      // 资产变动
      ['/contractAccount/wallet', '', true],
      STATIC.FUTURES_WALLET,
      ['futuresAssets.walletList'],
      false,
      { maxSize: 500, frequency: 1000 },
    ],
    [
      // 资金费率
      ['/contract/instrument', 'funding.rate', false],
      STATIC.FUTURES_FUNDING_RATE,
      [],
      true,
      {
        frequency: 1000,
        debounce: true,
        combine: false,
      },
    ],
    [
      // K线
      ['/contractMarket/limitCandle', 'candle.stick', false],
      STATIC.FUTURES_CANDLE_STICK,
      [],
      true,
      { frequency: 500 },
    ],
    [
      // 24小时行情快照
      ['/contractMarket/snapshot', 'snapshot.24h', false],
      STATIC.FUTURES_SNAPSHOT_VOLUME,
      [],
      true,
      { maxSize: 1000, frequency: 1000 },
    ],
    [
      // 最近成交价
      ['/contractMarket/ticker', 'ticker', false],
      STATIC.FUTURES_TICKER_PRICE,
      [],
      true,
      { maxSize: 1000, frequency: 1000 },
    ],
    [
      // 合约状态变化
      ['/contract/normal', 'contractStatusChange', false],
      STATIC.FUTURES_CONTRACT,
      [],
      true,
      { frequency: 500 },
    ],
    [
      // 合约上新
      ['/contract/updated', '', false],
      STATIC.FUTURES_CONTRACT_UPDATED,
      [],
      true,
      { frequency: 500 },
    ],
    [
      // 全仓杠杆变动
      ['/contract/crossLeverage', '', true],
      STATIC.FUTURES_CROSS_LEVERAGE,
      [],
      true,
      { frequency: 500 },
    ],
    [
      // 全仓保证金模式
      ['/contract/marginMode', '', true],
      STATIC.FUTURES_MARGIN_MODE,
      [],
      true,
      { frequency: 500 },
    ],
    // ===================== 体验金2.0 start =================
    [
      // 资产变动 -- 体验金
      ['/trialContract/accountWallet', '', true],
      STATIC.FUTURES_TRIAL,
      ['futuresAssets.walletList'],
      false,
      { maxSize: 500, frequency: 500 },
    ],
    // ===================== 体验金2.0 end =================
  ],
  Socket,
);

// level2
Socket.topicMessage(
  '/contractMarket/level2Depth50',
  'level2',
  false,
)(
  (data) => {
    sendMessage({
      method: STATIC.TOPIC_MESSAGE,
      type: STATIC.FUTURES_LEVEL2,
      data,
    });
  },
  {
    frequency: 1000,
    debounce: true,
    combine: false,
  },
);

// match
Socket.topicMessage(
  '/contractMarket/execution',
  'match',
  false,
)(
  (data) => {
    sendMessage({
      method: STATIC.TOPIC_MESSAGE,
      type: STATIC.FUTURES_RECENT_DEAL,
      data,
    });
  },
  {
    frequency: 1000,
    maxSize: 1000,
  },
);

// 风险限额变更成功通知(底层socket包forEach订阅相同的topic有bug, 单独订阅一次)
Socket.topicMessage(
  '/contract/positionAll',
  'position.adjustRiskLimit',
  true,
)(
  (data) => {
    sendMessage({
      method: STATIC.TOPIC_MESSAGE,
      type: STATIC.FUTURES_RISK_LIMIT_CHANGE,
      data,
    });
  },
  {
    frequency: 400,
  },
);

// 标记价格(底层socket包forEach订阅相同的topic有bug, 单独订阅一次)
Socket.topicMessage(
  '/contract/instrument',
  'mark.index.price',
  false,
)(
  (data) => {
    sendMessage({
      method: STATIC.TOPIC_MESSAGE,
      type: STATIC.FUTURES_MARK_INDEX_PRICE,
      data,
    });
  },
  {
    frequency: 1000,
    maxSize: 1000,
  },
);

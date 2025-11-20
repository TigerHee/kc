/**
 * Owner: borden@kupotech.com
 */
import Socket, { TOPIC_STATE, SOCKET_STATE, EVENT, Topic } from '@kc/socket';
import {
  // find,
  // arrayMap,
  forEach,
  // reduce,
} from './a.tiny.lodash';
import { MESSAGE, STATIC, pushArrMessageTransfers } from './websocket.const';
import { RecentTradeTopic } from '@/meta/newTopic';
// import SUBJECT_CONFIG from './notice.subjects.conf';

// init socket
const isChrome = /chrome/i.test(navigator.userAgent || '');
const useSlowFlush = /safari/i.test(navigator.userAgent || '') && !isChrome;
if (useSlowFlush) {
  console.log('use slow ws flush');
}

if (_XVERSION_) {
  // ws.setXVersion(_XVERSION_);
}

export const getAggregateId = () => {
  return Math.floor(Math.random() * 10000000);
};

const socket = new Socket();

// TODO
const RESUBSCRIBE_WHITELIST = ['/market/snapshot'];
const checkAndResubscribeTopics = (topic, isPrivate) => {
  // 获取取消订阅topic的原始topic及订阅参数(SYMBOL_LIST)
  const [baseTopic, varsStr] = topic.split(':');
  if (!RESUBSCRIBE_WHITELIST.includes(baseTopic) || !varsStr) return;
  // 订阅参数数组
  const vars = varsStr.split(',');
  const topicAllMap = socket.getTopicState();
  // 遍历所有当前已经订阅且同类型(私有、公共)的topic(非自身)
  for (const _topic in topicAllMap) {
    if (topic !== _topic) {
      const [_baseTopic, _varsStr] = _topic.split(':');
      const topicState = topicAllMap[_topic];
      if (
        _varsStr &&
        baseTopic === _baseTopic &&
        topicState.isPrivite === Boolean(isPrivate) &&
        topicState.status === TOPIC_STATE.SUBSCRIBED
      ) {
        const _vars = _varsStr.split(',');
        // 参数与当前取消订阅topic的订阅参数存在交集的，重新发起订阅
        if (vars.some((v) => _vars.includes(v))) {
          subscribe(_topic, isPrivate);
        }
      }
    }
  }
};

const subscribe = (topic, isPrivate) => {
  socket.subscribe(topic, undefined, isPrivate);
};

const unsubscribe = (topic, isPrivate) => {
  socket.unsubscribe(
    topic,
    () => {
      checkAndResubscribeTopics(topic, isPrivate);
    },
    isPrivate,
  );
};

const connect = (opt) => {
  socket.connect(opt);
};

const connected = () => {
  return socket.getSocketState() === SOCKET_STATE.CONNECTED;
};

const flush = () => {
  // socket.flush();
};

let _socketId = -1;

const getId = () => Math.floor(Math.random() * 1000000000);

const socketId = () => {
  return _socketId;
  // return socket.socket ? socket.socket.id : -1;
};

/**
 * socket事件
 */
/**
 * 重连失败
 */
socket.on(EVENT.RECONNECT_FAIL, () => {
  sendMessage({
    type: STATIC.RECONNECTERROR,
  });
});
/**
 * 重连陈工
 */
socket.on(EVENT.CONNECTED, () => {
  _socketId = getId();
});
/**
 * 重连成功
 */
socket.on(EVENT.RECONNECT, () => {
  _socketId = getId();
});

const topicState = () => {
  return {
    topicStateConst: TOPIC_STATE,
    topicState: socket.getTopicState(),
  };
};

const setCsrf = (csrf) => {
  // ws.setCsrf(csrf);
  return true;
};

const sendMessage = (msg) => {
  self.postMessage(JSON.stringify(msg));
};

self.onmessage = (e) => {
  const data = JSON.parse(e.data);

  if (typeof data === 'string' && data === MESSAGE.PING) {
    // 回应开启
    console.log('worker recive ping, post pong');
    sendMessage(MESSAGE.PONG);
  } else if (
    typeof data === 'object' &&
    (data.method === STATIC.SUBSCRIBE ||
      data.method === STATIC.UNSUBSCRIBE ||
      data.method === STATIC.CONNECT ||
      data.method === STATIC.CONNECTED ||
      data.method === STATIC.SOCKETID ||
      data.method === STATIC.TOPICSTATE ||
      data.method === STATIC.SETCSRF ||
      data.method === STATIC.FLUSH)
  ) {
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
    sendMessage({
      data: res,
      workerSuccess: true,
      method: data.method,
      id: data.__msgId,
    });
  } else if (
    typeof data === 'object' &&
    (data.method === STATIC.GETSOCKETSTORAGE ||
      data.method === STATIC.SETSOCKETSTORAGE ||
      data.method === STATIC.DELSOCKETSTORAGE)
  ) {
    socket.workerCallback(data);
  }
};

// 订阅websocket trade.l3match
socket.topicMessage(Topic.MARKET_MATCH, 'trade.l3match')(
  (arr) => {
    sendMessage({
      type: STATIC.DEALORDERS,
      arr: arr.slice(-80),
    });
  },
  { frequency: useSlowFlush ? 200 : 100, aggregateId: getAggregateId() },
);

// ==================== 4.0 推送限频 ====================
// 订阅websocket 4.0 的行情涨跌幅提示
socket.topicMessage('/symbol/priceUpDown', '')(
  (arr) => {
    sendMessage({
      type: STATIC.SYMBOLPRICEUPDOWN,
      arr,
    });
  },
  { frequency: 500, aggregateId: getAggregateId() },
);

// 订阅websocket trade.l3match 4.0推送限频
socket.topicMessage(RecentTradeTopic, 'trade.l3match')(
  (arr) => {
    sendMessage({
      type: STATIC.DEALORDERS,
      arr: arr.slice(-80),
    });
  },
  { frequency: 300, aggregateId: getAggregateId() },
);

// 订阅私有订单消息
socket.topicMessage(
  '/spotMarket/tradeOrders-batch',
  '',
  true,
)(
  (arrOrigin) => {
    let voice = null;
    if (Array.isArray(arrOrigin)) {
      for (let start = 0; start < arrOrigin.length; start++) {
        const arr = arrOrigin[start] && arrOrigin[start].data;
        if (Array.isArray(arr)) {
          for (let i = arr.length - 1; i >= 0; i--) {
            const data = arr[i];
            if (data.status === 'done') {
              voice = 'done';
              break;
            } else if (data.status === 'match') {
              voice = 'match';
            }
          }
        }
        if (voice === 'done') break;
      }
    }
    sendMessage({
      // type: STATIC.TRADEORDERS,
      type: STATIC.TRADEORDERSBATCH,
      arr: [voice],
    });
  },
  { frequency: 300, aggregateId: getAggregateId() },
);

// 订阅私有订单消息 4.0专用
socket.topicMessage(
  '/spotMarket/tradeOrdersBatchFrequency500',
  '',
  true,
)(
  (arrOrigin) => {
    const voice = [];
    if (Array.isArray(arrOrigin)) {
      for (let start = 0; start < arrOrigin.length; start++) {
        const arr = arrOrigin[start] && arrOrigin[start].data;
        if (Array.isArray(arr)) {
          for (let i = arr.length - 1; i >= 0; i--) {
            const data = arr[i];
            // 在data.status为done时，通过reason是否为canceled来区分是撤销订单还是全部成交(只能覆盖90%的撤销场景)
            if (data.status === 'done' && data.reason !== 'canceled') {
              if (voice.indexOf('done') === -1) {
                voice.push('done');
                break;
              }
            } else if (data.status === 'open' && data.dealSize > 0) {
              if (voice.indexOf('match') === -1) {
                voice.push('match');
              }
            }
          }
        }

        if (voice.length === 2) break;
      }
    }
    sendMessage({
      // type: STATIC.TRADEORDERS,
      type: STATIC.TRADEORDERSBATCHFREQUENCY500,
      arr: voice,
    });
  },
  { frequency: 500, aggregateId: getAggregateId() },
);

// 订阅私有止盈止损订单消息
socket.topicMessage(
  '/spotMarket/advancedOrders',
  'stopOrder',
  true,
)(
  (arr) => {
    sendMessage({
      type: STATIC.ADVANCEDORDERS,
      arr: [],
    });
  },
  { frequency: 300 },
);

// 订阅私有止盈止损订单消息  4.0专用
socket.topicMessage(
  '/spotMarket/advancedOrdersFrequency500',
  'stopOrder',
  true,
)(
  (arrOrigin) => {
    const voice = [];
    if (Array.isArray(arrOrigin)) {
      for (let start = 0; start < arrOrigin.length; start++) {
        const arr = arrOrigin[start] && arrOrigin[start].data;
        if (Array.isArray(arr)) {
          for (let i = arr.length - 1; i >= 0; i--) {
            const data = arr[i];
            if (data.type === 'TRIGGERED') {
              if (voice.indexOf('TRIGGERED') === -1) {
                voice.push('TRIGGERED');
                break;
              }
            }
          }
          if (voice.length === 1) break;
        }
      }
    }
    sendMessage({
      type: STATIC.ADVANCEDORDERSFREQUENCY500,
      arr: voice,
    });
  },
  { frequency: 500, aggregateId: getAggregateId() },
);

const balanceDataHandle = (arr) => {
  const banchMapMain = {};
  const banchMapTrade = {};
  const banchMapHighFrequency = {};
  // 是否存在非划转引起的🈷余额变更
  let isAllTransferEvents = false;

  forEach(arr, ({ data }) => {
    const { relationEvent, currency, total, hold, available, time } = data;
    if (!isAllTransferEvents && relationEvent.indexOf('transfer') >= 0) {
      isAllTransferEvents = true;
    }
    if (relationEvent.indexOf('main.') === 0) {
      banchMapMain[currency] = {
        time,
        totalBalance: total,
        availableBalance: available,
        holdBalance: hold,
      };
    } else if (relationEvent.indexOf('trade.') === 0) {
      banchMapTrade[currency] = {
        time,
        totalBalance: total,
        availableBalance: available,
        holdBalance: hold,
      };
    } else if (relationEvent.indexOf('trade_hf') === 0) {
      // 高频账户
      banchMapHighFrequency[currency] = {
        time,
        totalBalance: total,
        availableBalance: available,
        holdBalance: hold,
      };
    }
  });
  sendMessage({
    type: STATIC.BALANCE,
    data: {
      isAllTransferEvents,
      banchMapMain,
      banchMapTrade,
      banchMapHighFrequency,
    },
  });
};
// 订阅私有资产快照
socket.topicMessage(
  Topic.ACCOUNT_BALANCE_SNAPSHOT,
  'account.snapshotBalance',
  true,
)(balanceDataHandle, { frequency: 300, aggregateId: getAggregateId() });

// 订阅站内信
socket.topicNotice(
  Topic.NOTICE_CENTER,
  '',
  true,
)(
  (arr) => {
    sendMessage({
      type: STATIC.NOTICECENTER,
      arr,
    });
  },
  {
    aggregateId: getAggregateId(),
  },
);

// 新增一个合约的站内信
// 通知消息
socket.topicNotice(
  '/notice-center/notices',
  '',
  true,
)(
  (arr) => {
    sendMessage({
      type: STATIC.NOTICE_CENTER,
      arr,
    });
  },
  {
    aggregateId: getAggregateId(),
    frequency: useSlowFlush ? 800 : 400,
  },
);

// 订阅私有资产快照 (4.0限频)
socket.topicMessage(
  '/account/snapshotBalanceFrequency500',
  'account.snapshotBalance',
  true,
)(balanceDataHandle, { frequency: 300, aggregateId: getAggregateId() });

// 订阅全仓仓位基础信息变更 (后端限频策略： 按userId+币种，1s节流)
socket.topicMessage(
  '/margin/account',
  'balance.change',
  true,
)(
  (arr) => {
    const banchMap = {};
    forEach(arr, ({ data }) => {
      const { currency, available, total, hold, timestamp } = data;
      banchMap[currency] = {
        time: timestamp,
        holdBalance: hold,
        totalBalance: total,
        availableBalance: available,
      };
    });
    sendMessage({
      type: STATIC.CROSSBALANCECHANGE,
      data: banchMap,
    });
  },
  {
    frequency: 300,
    aggregateId: getAggregateId(),
  },
);

// 处理一些新增的推送
const pushGenArrList = pushArrMessageTransfers.map((item) => {
  const reqHandle = item[2];
  if (typeof reqHandle === 'function') {
    const val = reqHandle(useSlowFlush);
    const newItem = [...item];
    newItem[2] = [{ frequency: val }];
    return newItem;
  }
  return item;
});

// common gen
const genArrMessageTransfers = (configs, _socket) => {
  forEach(configs, ([_args, _type, _flushArgs = [], conf]) => {
    _socket.topicMessage(..._args)((arr) => {
      sendMessage({
        type: _type,
        arr,
      });
    }, _flushArgs[0]);
  });
};
genArrMessageTransfers(
  [
    [
      // 订阅websocket level2 update
      [Topic.MARKET_LEVEL2_WEB, 'trade.l2update'],
      STATIC.OPENPRDERSL2,
      [{ frequency: useSlowFlush ? 1000 : 100 }],
    ],
    [
      // 订阅websocket level2 update
      ['/spotMarket/level2Depth50:{SYMBOL_LIST}', 'level2'],
      STATIC.OPENPRDERSL2Limit50,
      [{ frequency: useSlowFlush ? 200 : 100 }],
    ],
    [
      // K线变更数据
      [Topic.MARKET_CANDLES, 'trade.candles.update'],
      STATIC.CANDLEUPDATE,

      [{ frequency: useSlowFlush ? 200 : 100 }],
    ],
    [
      // K线新增数据
      [Topic.MARKET_CANDLES, 'trade.candles.add'],
      STATIC.CANDLEADD,

      [{ frequency: useSlowFlush ? 200 : 100 }],
    ],
    [
      // K线新增数据
      ['/market/candlesFrequency1000:{SYMBOL_LIST}', 'trade.candles.refresh'],
      STATIC.CANDLEREFRESH,

      [{ frequency: useSlowFlush ? 200 : 100 }],
    ],
    [
      // 行情快照
      [Topic.MARKET_SNAPSHOT, 'trade.snapshot'],
      STATIC.MARKETSNAPSHOT,

      [{ frequency: useSlowFlush ? 200 : 100 }],
    ],
    // 通知中心
    // ...(arrayMap(Object.keys(SUBJECT_CONFIG), (subject) => {
    //   return [
    //     [Topic.NOTICE_CENTER, subject, true],
    //     `${STATIC.NOTICECENTER}@${subject}`,
    //     [],
    //   ];
    // })),
    [
      ['/margin/position', 'debt.ratio', true],
      STATIC.DEBTRATIO,
      [{ frequency: useSlowFlush ? 200 : 100 }],
    ],
    [['/margin/position', 'position.status', true], STATIC.POSITIONSTATUS, []],
    [['/indicator/markPrice:{SYMBOL_LIST}', 'tick'], STATIC.MARKPRICETICK, []],
    [['/margin-fund/nav:{SYMBOL_LIST}', 'margin-fund.nav'], STATIC.MARGINFUNDNAV, []],
    [
      ['/margin/isolatedPosition:{SYMBOL_LIST}', 'positionChange', true],
      STATIC.POSITIONCHANGE,

      [{ frequency: useSlowFlush ? 200 : 100 }],
    ],
    ...pushGenArrList,
  ],
  socket,
);

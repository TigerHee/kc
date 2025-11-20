/**
 * Owner: borden@kupotech.com
 */

// ---------------> CONST same as socketProcess.js
export const MESSAGE = {
  PING: 'ping',
  PONG: 'pong',
};

// #region 处理新增推送相关的行为
/**
 * 新增推送相关的配置
 * reqHandle: 空或数组或返回函数，处理(throttleHookMs = 100, notUseRaf = false)这两个参数
 * 如：reqHandle: (useSlowFlush) => [useSlowFlush ? 200 : 100, true],
 */
export const PushConf = {
  /**
   * 交易对信息变更
   */
  SYMBOLSCHANGENOTICE: {
    eventName: 'symbolsChangeNotice', // 必须
    topic: '/symbol/changeNotice:all', // 必须
  },
  /**
   * 集合竞价买卖盘
   */
  OPENPRDERSAuctionLimit50: {
    eventName: 'openOrdersAuctionLimit50', // 必须
    topic: '/spotCallAuction/level2:{SYMBOL_LIST}', // 必须
    subject: 'spotCallAuction.level2',
    reqHandle: (useSlowFlush) => [useSlowFlush ? 200 : 100, true],
  },
  /**
   * 集合竞价信息推送
   */
  CallAuctionInfo: {
    eventName: 'CallAuctionInfo',
    topic: '/spotCallAuction/estimateOpeningPrice:{SYMBOL_LIST}',
    subject: 'spotCallAuction.estimateOpeningPrice',
  },
  /**
   * 集合竞价订单变动
   */
  CallAuctionOrders: {
    eventName: 'callAuctionOrders', // 必须
    topic: '/spotCallAuction/orderChanges', // 必须
    reqHandle: [{ frequency: 300 }],
    private: true, // 私有订阅
  },
};

/**
 * 私有订阅
 * @type {string[]}
 */
export const PrivateTopics = [];

/**
 * websocket.worker.js 中用于生成
 * @type {[
 *    [string, string, undefined | boolean],
 *    string,
 *    string[] | (useSlowFlush) => void | string[]
 *  ][]
 * }
 * 如 [[
 *  [ws.Topic.MARKET_LEVEL2_WEB, 'trade.l2update'],
 *  STATIC.OPENPRDERSL2,
 *  [useSlowFlush ? 1000 : 100, true],
 * ]]
 */
export const pushArrMessageTransfers = [];

const pushTypes = Object.entries(PushConf).reduce((res, [key, config]) => {
  const { eventName, topic, subject = '', private: privateMode, reqHandle = [] } = config;

  res[key] = eventName;

  // websocket.worker.js 中需要处理的信息
  pushArrMessageTransfers.push([[topic, subject, privateMode], eventName, reqHandle]);

  if (privateMode) {
    PrivateTopics.push(topic);
  }

  return res;
}, {});

/**
 * 业务上需要使用的类型
 */
// FIXME: 直接 export 操作会运行时报错，暂时这样修复
export const PushTypes = pushTypes;
// #endregion

export const STATIC = {
  RESULT: 'result',
  TIMEOUT: 'timeout',
  MESSAGE: 'message',
  SUBSCRIBE: 'subscribe',
  UNSUBSCRIBE: 'unsubscribe',
  CONNECT: 'connect',
  CONNECTED: 'connected',
  RECONNECTERROR: 'reconnectError',
  FLUSH: 'flush',
  SOCKETID: 'socketId',
  SETCSRF: 'setCsrf',
  TOPICSTATE: 'topicState',
  DEALORDERS: 'dealOrders',
  SYMBOLPRICEUPDOWN: 'symbolPriceUpDown',
  OPENPRDERSL2: 'openOrdersL2',
  OPENPRDERSL2Limit50: 'openOrdersL2Limit50',
  // TRADEORDERS: 'tradeOrders',
  TRADEORDERSBATCH: 'tradeOrdersBatch',
  TRADEORDERSBATCHFREQUENCY500: 'tradeOrdersBatchFrequency500',
  ADVANCEDORDERSFREQUENCY500: 'advancedOrdersFrequency500',
  ADVANCEDORDERS: 'advancedOrders',
  BALANCE: 'balance',
  CROSSBALANCECHANGE: 'crossBalanceChange',
  CANDLEUPDATE: 'candleUpdate',
  CANDLEADD: 'candleAdd',
  CANDLEREFRESH: 'candleRefresh',
  MARKETSNAPSHOT: 'marketSnapshot',
  NOTICECENTER: 'noticeCenter',
  DEBTRATIO: 'debtRatio',
  POSITIONSTATUS: 'positionStatus',
  MARKPRICETICK: 'markPriceTick',
  GETSOCKETSTORAGE: 'getSocketStorage',
  SETSOCKETSTORAGE: 'setSocketStorage',
  DELSOCKETSTORAGE: 'delSocketStorage',
  MARGINFUNDNAV: 'marginFundNav',
  POSITIONCHANGE: 'positionChange',
  ...pushTypes,
  // 合约新增
  NOTICE_CENTER: 'futures_noticeCenter',
  TOPIC_MESSAGE: 'topicMessage',
  CONNECT_SUB: 'connectSub',
  GET_STORE: 'getStore',
  MAKE_DATA: 'makeData',
  FUTURES_POSITION: 'futures_position',
  FUTURES_ACTIVE_ORDER: 'futures_activeOrders',
  FUTURES_WALLET: 'futures_wallet',
  FUTURES_MARK_INDEX_PRICE: 'futures_markIndexPrice',
  FUTURES_FUNDING_RATE: 'futures_fundingRate',
  FUTURES_CANDLE_STICK: 'futures_candleStick',
  FUTURES_SNAPSHOT_VOLUME: 'futures_snapshotVolume',
  FUTURES_TICKER_PRICE: 'futures_tickerPrice',
  FUTURES_RECENT_DEAL: 'futures_recentDeal',
  FUTURES_STOP_ORDER: 'futures_stopOrder',
  FUTURES_NOTICE_CENTER: 'futures_noticeCenter',
  FUTURES_LEVEL2: 'futures_level2',
  FUTURES_CONTRACT: 'futures_contract',
  FUTURES_RISK_LIMIT_CHANGE: 'futures_riskLimitChange',
  FUTURES_CONTRACT_UPDATED: 'futures_contract_updated',
  FUTURES_CROSS_LEVERAGE: 'futuresCrossLeverage',
  FUTURES_MARGIN_MODE: 'futuresMarginMode',
  // 体验金 2.0
  FUTURES_TRIAL: 'wallet_trial',
};
// <---------------

export const TOPIC_PARAM_MAX_NUM = 80; // socket 分批订阅参数数量最大值

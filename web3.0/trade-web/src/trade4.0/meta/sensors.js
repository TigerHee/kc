/**
 * Owner: borden@kupotech.com
 * 埋点文档: https://k-devdoc.atlassian.net/wiki/spaces/ggsyz/pages/21011190
 *          https://k-devdoc.atlassian.net/wiki/spaces/ggsyz/pages/21013125/--+web
 */
import { get, merge } from 'lodash';
import { trackClick, saTrackForBiz } from 'utils/ga';
import { blockid as orderBookBlockId } from '../pages/Orderbook/config';
import { blockid as recentTradeBlockId } from '../pages/RecentTrade/config';
import { blockId as newMarketsBlockId } from '../pages/NewMarkets/config';

/**
 * 各交易类型通用埋点
 * 注意: commonSensors是跨交易类型(tradeType)通用的，如果要加曝光(expose)，
 * 执行的时机要确保能取到不同的pageid(比如：在useEffect effect func里执行, deps加上tradeType),
 * 或者，将曝光事件单独定义到自己业务的sensors配置中(如下面的spotSensors(现货)、crossSensors(全仓杠杆))。
 * 否则，埋点只在用户初次render的时候上报一次，可能click和expose的spmId是不一致的。
 * 如果这是符合预期的，请忽略这条notice
 */
const commonSensors = {
  // infoBar模块
  tradeZoneFunctionArea: {
    triggerVersion: {
      click: () => trackClick(['tradeZoneFunctionArea', '1']),
    },
    news: {
      click: () => trackClick(['tradeZoneFunctionArea', '2']),
    },
    RATE: {
      click: () => trackClick(['tradeZoneFunctionArea', '3']),
    },
    PRICE: {
      click: () => trackClick(['tradeZoneFunctionArea', '4']),
    },
    LIMIT: {
      click: () => trackClick(['tradeZoneFunctionArea', '6']),
    },
    help: {
      click: () => trackClick(['tradeZoneFunctionArea', '7']),
    },
    layoutSetting: {
      click: () => trackClick(['tradeZoneFunctionArea', '8']),
    },
    setting: {
      click: () => trackClick(['tradeZoneFunctionArea', '9']),
    },
  },
  // assetDisplayArea: {
  //   deposit: {
  //     click: () => trackClick(['assetDisplayArea', '5']),
  //   },
  // },
  // 币种推荐栏
  tradeZoneFunctionBar: {
    1: {
      click: () => trackClick(['tradeZoneFunctionBar', '1']),
    },
    2: {
      click: () => trackClick(['tradeZoneFunctionBar', '2']),
    },
  },
  // 市场选币
  markets: {
    // 一级交易区
    1: {
      click: (blockname) => trackClick(['pairBlock', '1'], { blockname }),
    },
    // 二级子交易区
    2: {
      click: (subblockname) => trackClick(['pairBlock', '2'], { subblockname }),
    },
    // 币对名称排序按钮
    3: {
      click: () => trackClick(['pairBlock', '3']),
    },
    // 最新价排序按钮
    4: {
      click: () => trackClick(['pairBlock', '4']),
    },
    // 涨跌幅排序按钮
    5: {
      click: () => trackClick(['pairBlock', '5']),
    },
    // 收藏按钮
    6: {
      click: (symbol) => trackClick(['pairBlock', '6'], { symbol }),
    },
  },
  // 新版行情
  newMarkets: {
    // 币种切换
    coinSwitch: {
      click: (type) => trackClick([newMarketsBlockId, '1'], { type }),
    },
    // 业务类型的切换
    businessSwitch: {
      click: (type) => trackClick([newMarketsBlockId, '2'], { type }),
    },
    // 曝光
    marketExpose: {
      click: () => trackClick([newMarketsBlockId, '3']),
    },
    // search
    searchActive: {
      click: () => trackClick([newMarketsBlockId, '4']),
    },
  },
  // 买卖盘
  orderBook: {
    // 订单簿按钮
    orderBookBtn: {
      click: () => trackClick([orderBookBlockId, '1']),
    },
    // 仅卖盘
    orderBookSellOnly: {
      click: () => trackClick([orderBookBlockId, '3']),
    },
    // 仅买盘
    orderBookBuyOnly: {
      click: () => trackClick([orderBookBlockId, '4']),
    },
    // 精度切换
    orderBookDepthChange: {
      click: () => trackClick([orderBookBlockId, '5']),
    },
    // 数量类型切换
    orderBooksAmountChange: {
      click: (type) => trackClick([orderBookBlockId, '6'], { type }),
    },
  },
  // 最近成交
  recentTrade: {
    // 最近成交按钮
    recentTradeBtn: {
      click: () => trackClick([recentTradeBlockId, '1']),
    },
  },
  // 当前委托区域
  openOrders: {
    1: {
      click: () => trackClick(['openOrders', '1']),
    },
    2: {
      click: () => trackClick(['openOrders', '2']),
    },
    3: {
      click: () => trackClick(['openOrders', '3']),
    },
    4: {
      click: () => trackClick(['openOrders', '4']),
    },
    5: {
      click: () => trackClick(['openOrders', '5']),
    },
    6: {
      click: () => trackClick(['openOrders', '6']),
    },
    7: {
      click: () => trackClick(['openOrders', '7']),
    },
    8: {
      click: () => trackClick(['openOrders', '8']),
    },
    9: {
      click: () => trackClick(['openOrders', '9']),
    },
    10: {
      click: (symbol) => trackClick(['openOrders', '10'], { symbol }),
    },
    11: {
      click: (symbol) => trackClick(['openOrders', '11'], { symbol }),
    },
  },
  // 委托历史区域
  orderHistory: {
    1: {
      click: () => trackClick(['orderHistory', '1']),
    },
    2: {
      click: () => trackClick(['orderHistory', '2']),
    },
    3: {
      click: () => trackClick(['orderHistory', '3']),
    },
    4: {
      click: () => trackClick(['orderHistory', '4']),
    },
    5: {
      click: () => trackClick(['orderHistory', '5']),
    },
    6: {
      click: () => trackClick(['orderHistory', '6']),
    },
    7: {
      click: (symbol) => trackClick(['orderHistory', '7'], { symbol }),
    },
    8: {
      click: () => trackClick(['orderHistory', '8']),
    },
  },
  // 成交历史区域
  tradeHistory: {
    1: {
      click: () => trackClick(['tradeHistory', '1']),
    },
    2: {
      click: () => trackClick(['tradeHistory', '2']),
    },
    3: {
      click: () => trackClick(['tradeHistory', '3']),
    },
    4: {
      click: () => trackClick(['tradeHistory', '4']),
    },
    5: {
      click: () => trackClick(['tradeHistory', '5']),
    },
    6: {
      click: (symbol) => trackClick(['tradeHistory', '6'], { symbol }),
    },
    7: {
      click: () => trackClick(['tradeHistory', '7']),
    },
  },
  // 资产列表
  assetTab: {
    1: {
      click: () => trackClick(['assetTab', '1']),
    },
    2: {
      click: () => trackClick(['assetTab', '2']),
    },
    3: {
      click: () => trackClick(['assetTab', '3']),
    },
    4: {
      click: () => trackClick(['assetTab', '4']),
    },
    5: {
      click: () => trackClick(['assetTab', '5']),
    },
    6: {
      click: () => trackClick(['assetTab', '6']),
    },
    7: {
      click: (symbol) => trackClick(['assetTab', '7'], { symbol }),
    },
    8: {
      click: (currency) => trackClick(['assetTab', '8'], { currency }),
    },
    9: {
      click: (currency) => trackClick(['assetTab', '9'], { currency }),
    },
    10: {
      click: (currency) => trackClick(['assetTab', '10'], { currency }),
    },
  },
  //  快捷下单埋点
  quickOrder: {
    spotFastOrderMarketBuy: {
      click: () => trackClick(['SpotFastOrderMarketBuy', '1']),
    },
    spotFastOrderMarketSell: {
      click: () => trackClick(['SpotFastOrderMarketSell', '1']),
    },
  },
  kyc: {
    modalClose: {
      click: (params) => trackClick({}, ['tradingKycWindow', '1'], params),
      expose: (params) => saTrackForBiz({}, ['tradingKycWindow', '1'], params),
    },
    modalConfirm: {
      click: (params) => trackClick(['tradingKycWindow', '2'], params),
    },
    modalCancel: {
      click: (params) => trackClick(['tradingKycWindow', '3'], params),
    },
  },

  /** 用户满意度/体验 调查 */
  satisfactionSurvey: {
    /**
     * @param {Object} payload
     * @param {Array} payload.optionIndexes
     * @param {string} payload.otherContent
     * @param {number} payload.score
     * @returns {void}
     */
    click: (payload) => {
      const { optionIndexes, otherContent, score } = payload;
      Promise.all(
        [
          trackClick(['satisfactionSurveyScore', '1'], { messageNumber: score }),
          trackClick(['satisfactionSurveyOptionIndexes', '1'], { message: optionIndexes }),
          otherContent &&
            trackClick(['satisfactionSurveyOtherContent', '1'], { message: otherContent }),
        ].filter((i) => i),
      );
    },
    expose: (params) => saTrackForBiz({}, ['satisfactionSurvey', '1'], params),
    /** 直接关闭弹窗 未完成调研表单 */
    directlyCloseClick: (closeTimes) =>
      trackClick(['satisfactionSurveyDirectlyClose', '1'], { messageNumber: closeTimes }),
  },
};

const spotSensors = {
  // 币种信息区
  tokenInformation: {
    symbolSwitch: {
      click: (symbol) => trackClick(['spotTokenInformation', '1'], { symbol }),
    },
    tokenInfo: {
      click: () => trackClick(['spotTokenInformation', '2']),
    },
  },
  // 资产区
  assetDisplayArea: {
    hidden: () => trackClick(['assetZone', '1']),
    deposit: () => trackClick(['assetZone', '2']),
    transfer: () => trackClick(['assetZone', '3']),
  },
  // 现货下单交易区
  spotTrading: {
    transferDeposit: () => trackClick(['placeOrderZone', '11']),
    advancedSetting: () => trackClick(['placeOrderZone', '12']),
    advancedPostOnly: () => trackClick(['placeOrderZone', '13']),
    advancedHidden: () => trackClick(['placeOrderZone', '14']),
    advancedTimeStrategy: (excuteType) => trackClick(['placeOrderZone', '15'], { excuteType }),
    // TODO 未找到
    // 下单浮窗按钮placeOrderZone 16
    // 价格波动提示按钮placeOrderZone 17
  },
  // 现货杠杆公共部分
  trading: {
    tab: (tabname) => trackClick(['placeOrderZone', '1'], { tabname }),
    buy: {
      expose: ({ symbol, orderType }) =>
        saTrackForBiz({}, ['placeOrderZone', '2'], { symbol, orderType }),
      click: ({ symbol, orderType }) =>
      trackClick(['placeOrderZone', '2'], { symbol, orderType }),
    },
    sell: {
      expose: ({ symbol, orderType }) =>
        saTrackForBiz({}, ['placeOrderZone', '3'], { symbol, orderType }),
      click: ({ symbol, orderType }) =>
      trackClick(['placeOrderZone', '3'], { symbol, orderType }),
    },
    customPriseBtn: () => trackClick(['placeOrderZone', '4']),
    marketPriseBtn: () => trackClick(['placeOrderZone', '5']),
    triggerPriseBtn: (orderType) => trackClick(['placeOrderZone', '6'], { orderType }),
    0.25: () => trackClick(['placeOrderZone', '7']),
    0.5: () => trackClick(['placeOrderZone', '8']),
    0.75: () => trackClick(['placeOrderZone', '9']),
    1: () => trackClick(['placeOrderZone', '10']),
  },
};

// 杠杆交易通用埋点
const commonMarginSensors = {
  tokenInformation: {
    symbolSwitch: {
      click: (symbol) => trackClick(['tradeZoneTokenInformationg', '1'], { symbol }),
    },
    tokenInfo: {
      click: () => trackClick(['tradeZoneTokenInformationg', '2']),
    },
  },
  // 杠杆交易步骤
  marginStepTutorial: {
    transfer: {
      go: () => trackClick(['marginStepTutorial', '2']),
    },
    borrow: {
      go: () => trackClick(['marginStepTutorial', '3']),
      auto: () => trackClick(['marginStepTutorial', '4']),
    },
    repay: {
      go: () => trackClick(['marginStepTutorial', '5']),
      auto: () => trackClick(['marginStepTutorial', '6']),
    },
  },
  // 资产展示区
  assetDisplayArea: {
    transfer: () => trackClick(['assetDisplayArea', '1']),
    autoRepay: () => trackClick(['assetDisplayArea', '2']),
    borrow: () => trackClick(['assetDisplayArea', '3']),
    repay: () => trackClick(['assetDisplayArea', '4']),
    deposit: () => trackClick(['assetDisplayArea', '5']),
    closePosition: () => trackClick(['assetDisplayArea', '6']), // 一键平仓
    canelClosePosition: () => trackClick(['assetDisplayArea', '7']), // 取消一键平仓
    canelClosePositionEnsure: () => trackClick(['assetDisplayArea', '8']),
  },
  // 划转弹窗
  transferWindow: {
    confirmBtn: {
      expose: () => saTrackForBiz({}, ['transferConfirm', '1']),
    },
    confirmSuccess: () => trackClick(['transferSuccess', '1']),
  },
  // 杠杆倍数修改弹窗
  leverageWindow: {
    confirmBtn: {
      expose: () => saTrackForBiz({}, ['multiConfirm', '1']),
    },
    confirmSuccess: () => trackClick(['multiSuccess', '1']),
  },
  // 借币还币弹窗
  borrowRepayWindow: {
    borrowConfirm: {
      click: () => trackClick(['borrowRepayWindow', '1']),
      expose: () => saTrackForBiz({}, ['borrowRepayWindow', '1']),
    },
    borrowSuccess: () => trackClick(['borrowSuccess', '1']),
    repayConfirm: {
      click: () => trackClick(['borrowRepayWindow', '2']),
      expose: () => saTrackForBiz({}, ['borrowRepayWindow', '2']),
    },
    repaySuccess: () => trackClick(['repaySuccess', '1']),
    RECENTLY_EXPIRE_FIRST: () => trackClick(['borrowRepayWindow', '3']),
    HIGHEST_RATE_FIRST: () => trackClick(['borrowRepayWindow', '4']),
    all: () => trackClick(['borrowRepayWindow', '5']),
    0.25: () => trackClick(['borrowRepayWindow', '6']),
    0.5: () => trackClick(['borrowRepayWindow', '7']),
    0.75: () => trackClick(['borrowRepayWindow', '8']),
    1: () => trackClick(['borrowRepayWindow', '9']),
  },
  // 开通杠杆交易
  openMarginAgreement: {
    open: () => trackClick(['openMarginAgreement', '1']),
    openConfirm: {
      click: () => trackClick(['openMarginAgreement', '2']),
      expose: () => saTrackForBiz({}, ['openMarginAgreement', '2']),
    },
    openMarginSuccess: () => trackClick(['openMarginSuccess', '1']),
  },
  // 杠杆免息券
  InterestFreeCoupon: {
    go: () => trackClick(['InterestFreeCoupon', '1']),
    close: () => trackClick(['InterestFreeCoupon', '2']),
  },
  // 杠杆体验金
  marginBonus: {
    go: () => trackClick(['marginBonus', '1']),
    close: () => trackClick(['marginBonus', '2']),
  },
  tradingArea: {
    normalTab: {
      click: () => trackClick(['marginOrderMode', '1']),
    },
    autoBorrowTab: {
      click: () => trackClick(['marginOrderMode', '2']),
    },
    autoRepayTab: {
      click: () => trackClick(['marginOrderMode', '3']),
    },
    autoBorrowAndRepayTab: {
      click: () => trackClick(['marginOrderMode', '4']),
    },
  },
};

// 全仓杠杆埋点
const crossSensors = merge(
  {
    // 杠杆交易步骤
    marginStepTutorial: {
      guide: {
        expose: () => saTrackForBiz({}, ['marginStepTutorial', '1']),
        click: () => trackClick(['marginStepTutorial', '1']),
      },
    },
    // 全仓杠杆下单交易区
    marginTrading: {
      changeMulti: () => trackClick(['crossMarginTrading', '3']),
      setMulti: () => trackClick(['crossMarginTrading', '4']),
      transfer: () => trackClick(['crossMarginTrading', '5']),
      kcsPayFees: () => trackClick(['crossMarginTrading', '8']),
      autoBorrow: () => trackClick(['crossMarginTrading', '9']),
    },
    // 现货杠杆公共部分
    trading: {
      tab: (tabname) => trackClick(['crossMarginTrading', '1'], { tabname }),
      buy: {
        expose: (symbol) => saTrackForBiz({}, ['crossMarginTrading', '6'], { symbol }),
        click: (symbol) => trackClick(['crossMarginTrading', '6'], { symbol }),
      },
      sell: {
        expose: (symbol) => saTrackForBiz({}, ['crossMarginTrading', '7'], { symbol }),
        click: (symbol) => trackClick(['crossMarginTrading', '7'], { symbol }),
      },
      0.25: () => trackClick(['crossMarginTrading', '10']),
      0.5: () => trackClick(['crossMarginTrading', '11']),
      0.75: () => trackClick(['crossMarginTrading', '12']),
      1: () => trackClick(['crossMarginTrading', '13']),
    },
  },
  commonMarginSensors,
);

// 逐仓杠杆埋点
const isolatedSensors = merge(
  {
    // 杠杆交易步骤
    marginStepTutorial: {
      guide: {
        expose: () => saTrackForBiz({}, ['marginStepTutorial', '1']),
        click: () => trackClick(['marginStepTutorial', '1']),
      },
    },
    // 逐仓杠杆下单交易区
    marginTrading: {
      changeMulti: () => trackClick(['isolatedMarginTrading', '3']),
      setMulti: () => trackClick(['isolatedMarginTrading', '4']),
      transfer: () => trackClick(['isolatedMarginTrading', '5']),
      kcsPayFees: () => trackClick(['isolatedMarginTrading', '8']),
      autoBorrow: () => trackClick(['isolatedMarginTrading', '9']),
    },
    // 现货杠杆公共部分
    trading: {
      tab: (tabname) => trackClick(['isolatedMarginTrading', '1'], { tabname }),
      buy: {
        expose: (symbol) => saTrackForBiz({}, ['isolatedMarginTrading', '6'], { symbol }),
        click: (symbol) => trackClick(['isolatedMarginTrading', '6'], { symbol }),
      },
      sell: {
        expose: (symbol) => saTrackForBiz({}, ['isolatedMarginTrading', '7'], { symbol }),
        click: (symbol) => trackClick(['isolatedMarginTrading', '7'], { symbol }),
      },
      0.25: () => trackClick(['isolatedMarginTrading', '10']),
      0.5: () => trackClick(['isolatedMarginTrading', '11']),
      0.75: () => trackClick(['isolatedMarginTrading', '12']),
      1: () => trackClick(['isolatedMarginTrading', '13']),
    },
  },
  commonMarginSensors,
);

// 合约埋点
const futuresSensors = {
  // 合约 ab 打开
  futuresNew: () => trackClick(['futuresNew', '1']),
  // 开通合约
  openFutures: () => trackClick(['futuresOpen', '1']),
  // 下单以及切换
  trading: {
    tab: (tabname) => trackClick(['futuresTrading', '1'], { tabname }),
    buy: () => trackClick(['futuresTrading', '2']),
    sell: () => trackClick(['futuresTrading', '3']),
    result: (params) => trackClick(['futuresTrading', '4'], params),
    openFutures: () => trackClick(['futuresTrading', '5']),
  },
  // 活动委托
  activeOrder: {
    // 合约撤单
    cancel: {
      click: () => trackClick(['futuresActiveOrder', '1']),
    },
    // 合约撤单
    cancelSuccess: {
      click: () => trackClick(['futuresActiveOrder', '2']),
    },
    // 合约活动expose
    expose: {
      click: (screen) => trackClick(['futuresActiveOrder', '3'], { screen }),
    },
    // 合约撤单all
    cancelAll: {
      click: () => trackClick(['futuresActiveOrder', '4']),
    },
    // 合约撤单all success
    cancelAllSuccess: {
      click: () => trackClick(['futuresActiveOrder', '5']),
    },
  },

  // 条件委托
  stopOrder: {
    // 撤单
    cancel: {
      click: () => trackClick(['futuresStopOrder', '1']),
    },
    // 撤单success
    cancelSuccess: {
      click: () => trackClick(['futuresStopOrder', '2']),
    },
    // expose
    expose: {
      click: (screen) => trackClick(['futuresStopOrder', '3'], { screen }),
    },
    // 合约撤单all
    cancelAll: {
      click: () => trackClick(['futuresStopOrder', '4']),
    },
    // 合约撤单all success
    cancelAllSuccess: {
      click: () => trackClick(['futuresStopOrder', '5']),
    },
  },
  // 仓位
  position: {
    // expose
    expose: {
      click: (screen) => trackClick(['position', '1'], { screen }),
    },

    // 平仓expose
    closeOrderExpose: {
      click: (type) => trackClick(['position', '2'], { type }),
    },
    // 平仓
    closeOrderCreateClick: {
      click: (type) => trackClick(['position', '3'], { type }),
    },
    // 平仓
    closeOrderCreateSuccess: {
      click: (type) => trackClick(['position', '4'], { type }),
    },

    // 止盈止损expose
    stopLPExpose: {
      click: (type) => trackClick(['position', '5'], { type }),
    },
    // 止盈止损下单
    stopLPCreate: {
      click: (type) => trackClick(['position', '6'], { type }),
    },
    // 止盈止损下单成功
    stopLPCreateSuccess: {
      click: (type) => trackClick(['position', '7'], { type }),
    },
    // 止盈止损撤单
    stopLPCancel: {
      click: () => trackClick(['position', '8']),
    },
    // 止盈止损撤单成功
    stopLPCancelSuccess: {
      click: () => trackClick(['position', '9']),
    },

    // 追加保证金expose
    addMarginExpose: {
      click: () => trackClick(['position', '10']),
    },
    // 追加保证金expose
    addMarginCommit: {
      click: () => trackClick(['position', '11']),
    },
    // 追加保证金expose
    addMarginSuccess: {
      click: () => trackClick(['position', '12']),
    },

    // 自动追加保证金commit
    autoAddMarginCommit: {
      click: () => trackClick(['position', '13']),
    },
    // 追加保证金success
    autoAddMarginSuccess: {
      click: () => trackClick(['position', '14']),
    },
  },

  pnlAlert: {
    // 引导曝光
    guideExpose: (params) => saTrackForBiz({}, ['NewFeatureBubble', '1']),
    // 偏好设置点击
    preferenceClick: () => trackClick(['NewFeatureBubble', '1']),
    // 关闭引导
    guideClose: () => trackClick(['NewFeatureBubble', '2']),
    // pnl set
    pnlAction: (step = '1', params = {}) => trackClick(['PnlNotice', step], params),
    // 盈亏提醒曝光
    listExpose: (params) => saTrackForBiz({}, ['PnlNotice', '1'], params),
  },
};

export const genSensorsFunc =
  (sensorsConfig) =>
  (path = [], data) => {
    const func = get(sensorsConfig, path);
    if (func) func(data);
  };

export const commonSensorsFunc = genSensorsFunc(commonSensors);

export { spotSensors, crossSensors, isolatedSensors, futuresSensors, commonSensors };

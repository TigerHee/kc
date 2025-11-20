/**
 * 所有模块
 */
export const MODULES = [
  {
    code: 'infoBar',
    name: '信息栏',
  },
  {
    code: 'newMarkets',
    name: '行情',
  },
  {
    code: 'chart',
    name: 'K线',
    // children: [
    //   {
    //     selector: '[data-inspector="trade-chart-header"]',
    //     name: 'header',
    //   },
    //   {
    //     selector: '[data-inspector="trade-chart-content"]',
    //     name: 'content',
    //   },
    // ],
  },
  {
    code: 'depth',
    name: '深度图',
  },
  {
    code: 'orderBook',
    name: '买卖盘',
    children: [
      {
        selector: '[data-inspector="trade-orderbook-header"]',
        name: 'header',
      },
      {
        selector: '[data-inspector="trade-orderbook-depth"]',
        name: 'depth',
      },
      {
        selector: '[data-inspector="trade-orderbook-list"]',
        name: 'list',
      },
    ],
  },
  {
    code: 'recentTrade',
    name: '最新成交',
    children: [
      {
        selector: '[data-inspector="trade-recentTrade-header"]',
        name: 'header',
      },
      {
        selector: '[data-inspector="trade-recentTrade-content"]',
        name: 'content',
      },
    ],
  },
  {
    code: 'orderForm',
    name: '提交委托',
    children: [
      {
        selector: '[data-inspector="trade-orderForm-tradeTypeTabs"]',
        name: '交易类型Tab',
      },
      {
        selector: '[data-inspector="trade-orderForm-orderTypeTabs"]',
        name: '订单类型Tab',
      },
      {
        selector: '[data-inspector="trade-orderForm-form"]',
        name: '表单',
      },
    ],
  },
  {
    code: 'openOrders',
    name: '当前委托',
    children: [
      {
        selector: '[data-inspector="trade-openOrders-header"]',
        name: 'header',
      },
    ],
  },
  {
    code: 'historyOrders',
    name: '历史委托',
    children: [
      {
        selector: '[data-inspector="trade-orderHistory-header"]',
        name: 'header',
      },
    ],
  },
  {
    code: 'tradeOrders',
    name: '成交明细',
    children: [
      {
        selector: '[data-inspector="trade-tradeHistory-header"]',
        name: 'header',
      },
    ],
  },
  {
    code: 'fund',
    name: '仓位',
  },
  {
    code: 'assets',
    name: '资产概览',
  },
  {
    code: 'botOrderAndProfit',
    name: '策略',
  },
  {
    code: 'realizedPNL',
    name: '平仓盈亏',
  },
];

// 土耳其站 不显示机器人和合约
export const TR_MODULES = [
  {
    code: 'infoBar',
    name: '信息栏',
  },
  {
    code: 'markets', // 这里和主战的不一样
    name: '行情',
  },
  {
    code: 'chart',
    name: 'K线',
  },
  {
    code: 'depth',
    name: '深度图',
  },
  {
    code: 'orderBook',
    name: '买卖盘',
    children: [
      {
        selector: '[data-inspector="trade-orderbook-header"]',
        name: 'header',
      },
      {
        selector: '[data-inspector="trade-orderbook-depth"]',
        name: 'depth',
      },
      {
        selector: '[data-inspector="trade-orderbook-list"]',
        name: 'list',
      },
    ],
  },
  {
    code: 'recentTrade',
    name: '最新成交',
    children: [
      {
        selector: '[data-inspector="trade-recentTrade-header"]',
        name: 'header',
      },
      {
        selector: '[data-inspector="trade-recentTrade-content"]',
        name: 'content',
      },
    ],
  },
  {
    code: 'orderForm',
    name: '提交委托',
    children: [
      {
        selector: '[data-inspector="trade-orderForm-tradeTypeTabs"]',
        name: '交易类型Tab',
      },
      {
        selector: '[data-inspector="trade-orderForm-orderTypeTabs"]',
        name: '订单类型Tab',
      },
      {
        selector: '[data-inspector="trade-orderForm-form"]',
        name: '表单',
      },
    ],
  },
  {
    code: 'openOrders',
    name: '当前委托',
    children: [
      {
        selector: '[data-inspector="trade-openOrders-header"]',
        name: 'header',
      },
    ],
  },
  {
    code: 'historyOrders',
    name: '历史委托',
    children: [
      {
        selector: '[data-inspector="trade-orderHistory-header"]',
        name: 'header',
      },
    ],
  },
  {
    code: 'tradeOrders',
    name: '成交明细',
    children: [
      {
        selector: '[data-inspector="trade-tradeHistory-header"]',
        name: 'header',
      },
    ],
  },
  {
    code: 'fund',
    name: '仓位',
  },
  {
    code: 'assets',
    name: '资产概览',
  },
];

/**
 * 页面完全加载的最大时间 (10s)
 */
export const MAX_RENDER_TIME = 60 * 1000;

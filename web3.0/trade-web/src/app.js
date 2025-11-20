/**
 * Owner: garuda@kupotech.com
 */
import './initial';
import flatten from 'lodash/flatten';
import tdk from '@kc/tdk';
import { getDvaApp } from '@kucoin-base/dva';
import { ExtensionDetector } from '@kucoin-biz/extensionDetector';
import sensors from '@kucoin-base/sensors';

import createLoading from 'dva-loading';
import showError from 'src/dvaHooks/showError';

import { siteId, pageIdMap } from 'utils/kcsensorsConf';

import futuresWorkerSocket from 'common/utils/futuresSocketProcess';

import routes from './routes.config';
import { sentryInit } from './utils/sentry';

import './style';
import { abTestManager } from './utils/abTestManager';
import { isFuturesCrossNew } from './trade4.0/meta/const';
import JsBridge from '@kucoin-base/bridge';
import { xgrayCheck } from './utils/xgray';

export function Root(props) {
  return props.children;
}

/**
 * flatten routes
 *
 * @param   {[type]}  _routes  [_routes description]
 *
 * @return  {[type]}           [return description]
 */
function resolveRoutes(_routes) {
  return _routes.map((v) => {
    if (v.routes) {
      return [...resolveRoutes(v.routes)];
    }
    return v;
  });
}

// trade4.0 init
const newInit = (app) => {
  sensors.registerProject(
    { siteId, pageIdMap },
    {
      app_name: _APP_NAME_,
      isABNew: true, // 如果是新交易大厅，全局自定参数增加 isABNew:true
    },
  );

  // sentry init
  sentryInit('trade-web4.0');

  // FIXME: 后续干掉ab, 初始化合约socket这个不要随便删 联系 Garuda or Clyne
  futuresWorkerSocket.initFuturesWorker();

  // hooks
  app.use(showError());
  // ====================

  // Model
  app.model(require('models/app').default);
  app.model(require('models/categories').default);
  app.model(require('models/coins').default);
  app.model(require('models/notice_event').default);
  app.model(require('models/overview').default);
  app.model(require('models/bonus').default);
  app.model(require('models/dialog').default);
  // app.model(require('models/theme').default);
  app.model(require('models/components').default);
  app.model(require('models/notice').default);
  app.model(require('models/homepage').default);
  app.model(require('models/currency').default);
  app.model(require('models/coupon').default);
  app.model(require('models/server_time').default);
  app.model(require('models/ping').default);
  app.model(require('models/trade').default);
  app.model(require('models/markets').default);
  app.model(require('models/tradeNews').default);
  // app.model(require('models/marketSnapshot').default);
  app.model(require('models/dealOrders').default);
  app.model(require('models/openOrders').default);
  app.model(require('models/priceWarn').default);
  app.model(require('models/orders/current').default);
  app.model(require('models/orders/stop').default);
  app.model(require('models/orders/history').default);
  app.model(require('models/orders/dealDetail').default);
  app.model(require('models/orders/twap').default);
  app.model(require('models/orders/orderTwapHistory').default);
  app.model(require('models/transfer').default);
  app.model(require('models/tradeForm').default);
  app.model(require('models/tradeFormUtil').default);
  app.model(require('models/security').default);
  app.model(require('models/portal').default);

  // margin
  app.model(require('models/margin/borrow').default);
  // leveragedTokens
  app.model(require('models/leveragedTokens').default);
  // init values record
  app.model(require('models/utils/initValues').default);
  // 交易对
  app.model(require('@/models/symbols').default);
  // 4.0 k线图表
  app.model(require('@/pages/Chart/models').default);
  // 4.0买卖盘
  app.model(require('@/pages/Orderbook/models').default);
  // 4.0实时交易
  app.model(require('@/pages/RecentTrade/models').default);

  app.model(require('@/models/setting').default);
  // 4.0实时交易对信息
  app.model(require('@/models/marketSnapshot').default);
  // SensorApmStore 神策监控APMStore 存储apm实例 add by owen.guo
  app.model(require('models/utils/sensorStore').default);
  // 现货，集合竞价
  app.model(require('@/models/callAuction').default);
  // 资产列表
  app.model(require('@/pages/Fund/model').default);
  // 账户
  app.model(require('@/models/userAssets').default);
  // 用户
  app.model(require('@/models/user').default);
  // socket
  app.model(require('@/models/socket').default);
  // 全仓杠杆
  app.model(require('@/models/margin').default);
  // 逐仓杠杆
  app.model(require('@/models/isolated').default);
  // 合约 common
  app.model(require('@/models/futures/futuresCommon').default);
  // 合约仓位列表
  app.model(require('@/pages/Orders/FuturesOrders/models').default);
  // 合约仓位列表
  app.model(require('@/pages/OpenFutures/models').default);
  // 合约 资产
  app.model(require('@/models/futures/futuresAssets').default);
  // 合约市场价格
  app.model(require('@/models/futures/futuresMarket').default);
  // 合约偏好设置
  app.model(require('@/models/futures/futuresSetting').default);
  // 合约下单
  app.model(require('@/pages/OrderForm/FuturesFormNew/models').default);
  // 新行情
  app.model(require('@/pages/NewMarkets/models').default);
  // 合约体验金
  app.model(require('@/models/futures/futuresTrialFund').default);
  // 合约计算
  app.model(require('@/models/futures/futuresCalcData').default);
  // 合约盈亏提醒
  app.model(require('@/pages/InfoBar/SettingsToolbar/TradeSetting/FuturesPNLAlert/model').default);
  // 合约提取保证金
  app.model(require('@/models/futures/futuresOperatorMargin').default);
  // 合约保证金模式
  app.model(require('@/models/futures/futuresMarginMode').default);
  // 灰度注册
  app.model(require('@/models/futures/grayScale').default);
  // 合约税费
  app.model(require('@/models/futures/futuresTax').default);
};

export async function bootstrap() {
  console.log('app bootstrap --->');
  // bootstrap tdk
  tdk.init({
    host: _API_HOST_,
    brandName: window._BRAND_NAME_,
  });

  window.Systemjs = window.System;
  const _routes = resolveRoutes(routes[0].routes);
  window.__KC_CRTS__ = flatten(_routes);
  window.getDvaApp = getDvaApp;

  if (!window.extensionDetector) {
    if (ExtensionDetector) {
      window.extensionDetector = new ExtensionDetector();
      window.extensionDetector.init({
        whitList: [],
      });
    }
  }

  const app = getDvaApp();

  app.use(
    createLoading({
      effects: true,
    }),
  );

  await abTestManager.initABtest();
  newInit(app);
  const isInApp = JsBridge.isApp();
  if (!isInApp) {
    xgrayCheck();
  }
}

export { default as routes } from './routes.config';

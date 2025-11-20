/*
 * owner: Borden@kupotech.com
 */
import React from 'react';
import loadableComponent from '@loadable/component';
import { _t } from 'src/utils/lang';
import AbsoluteLoading from '@/components/AbsoluteLoading';
import OrdersSummaryInit from '@/pages/Orders/OpenOrders/OrdersSummaryInit';
import { isFuturesNew } from '@/meta/const';
import { isDisplayBotStrategy } from '@/meta/multiTenantSetting';
import { useIsTradingBot } from '@/hooks/common/useTradeMode';
import { TRADEMODE_META } from '@/meta/tradeTypes';

const isFuturesAB = isFuturesNew();

const loadable = (loadFunc) =>
  loadableComponent(loadFunc, {
    fallback: <AbsoluteLoading size="small" spinning />,
  });

const Orderbook = loadable(() =>
  import(/* webpackChunkName: 'tradev4-orderbook' */ '@/pages/Orderbook'),
);

const RecentTrade = loadable(() =>
  import(/* webpackChunkName: 'tradev4-recentTrade' */ '@/pages/RecentTrade'),
);

const Depth = loadable(() => import(/* webpackChunkName: 'tradev4-depth' */ '@/pages/Depth'));

const Chart = loadable(() => import(/* webpackChunkName: 'tradev4-chart' */ '@/pages/Chart'));

const Markets = loadable(() => import(/* webpackChunkName: 'tradev4-market' */ '@/pages/Markets'));
const NewMarkets = loadable(() =>
  import(/* webpackChunkName: 'tradev4-market' */ '@/pages/NewMarkets'),
);

const OrderForm = loadable(() =>
  import(/* webpackChunkName: 'tradev4-orderForm' */ '@/pages/OrderForm'),
);

const Assets = loadable(() => import(/* webpackChunkName: 'tradev4-assets' */ '@/pages/Assets'));

const Fund = loadable(() => import(/* webpackChunkName: 'tradev4-fund' */ '@/pages/Fund'));
const OpenOrders = loadable(() =>
  import(/* webpackChunkName: 'tradev4-openOrders' */ '@/pages/Orders/OpenOrders'),
);

const HistoryOrders = loadable(() =>
  import(/* webpackChunkName: 'tradev4-historyOrders' */ '@/pages/Orders/HistoryOrders'),
);

const TradeHistory = loadable(() =>
  import(/* webpackChunkName: 'tradev4-tradeOrders' */ '@/pages/Orders/TradeOrders'),
);

const FuturesPNL = loadable(() =>
  import(/* webpackChunkName: 'tradev4-futuresPnl' */ '@/pages/Orders/FuturesOrders/RealizedPNL'),
);

const BotCreate = loadable(() =>
  import(/* webpackChunkName: 'tradev4-botCreate' */ 'Bot/Module/BotCreate'),
);

const BotOrder = loadable(() =>
  import(/* webpackChunkName: 'tradev4-botOrder' */ 'Bot/Module/BotOrderAndProfit'),
);

const OrderFormPart = {
  Name: () => {
    const tabName = useIsTradingBot() ? 'iN5fZvFDfnejp2B8bESUko' : 'kFFx5HbwU7nfCBHfuhnbQu';
    return _t(tabName);
  },
  Component: (props) => {
    const Component = useIsTradingBot() ? BotCreate : OrderForm;
    return <Component {...props} />;
  },
};
/**
 * 注意 renderName , getComponent 都是render函数
 *
 */
/**
 * @param minWidth 目前主要用于浮动模块改变大小时可改的最小宽度
 * @param minHeight 目前主要用于浮动模块改变大小时可改的最小高度
 * @param iconId 工具栏显示的模块图标，放到@/assets/icons中
 * @param layoutsHaveThisAtInit 布局初始化就激活该模块的布局名
 */
export const MODULES = [
  {
    id: 'markets',
    iconId: 'markets',
    minWidth: 280,
    actions: ['float'],
    renderName: () => _t('market'),
    getComponent: (props) => (isFuturesAB ? <NewMarkets {...props} /> : <Markets {...props} />),
  },
  {
    id: 'chart',
    iconId: 'chart',
    minWidth: 280,
    minHeight: 240,
    layoutsHaveThisAtInit: ['lg', 'sm', 'xs'],
    actions: ['popout', 'float', 'maximize'],
    renderName: () => _t('hGZpZFsDxamTeWa6bzF7gp'),
    getComponent: (props) => <Chart {...props} />,
  },
  {
    id: 'depth',
    iconId: 'depth',
    minWidth: 280,
    minHeight: 240,
    renderName: () => _t('realtime.span'),
    getComponent: (props) => <Depth {...props} />,
  },
  {
    id: 'orderBook',
    iconId: 'orderBook',
    minWidth: 280,
    minHeight: 240,
    layoutsHaveThisAtInit: ['lg'],
    renderName: () => _t('l2.title'),
    getComponent: (props) => <Orderbook {...props} />,
  },
  {
    id: 'recentTrade',
    iconId: 'recentTrade',
    minWidth: 280,
    minHeight: 240,
    layoutsHaveThisAtInit: ['lg'],
    renderName: () => _t('realtime.deal'),
    getComponent: (props) => <RecentTrade {...props} />,
  },
  {
    id: 'orderForm',
    iconId: 'orderForm',
    minWidth: 280,
    minHeight: 480,
    actions: ['float'],
    layoutsHaveThisAtInit: ['lg'],
    renderName: (props) => (
      <div data-inspector="modules-orderForm">
        <OrderFormPart.Name {...props} />
      </div>
    ),
    getComponent: (props) => <OrderFormPart.Component {...props} />,
  },
  {
    id: 'openOrders',
    iconId: 'openOrders',
    minWidth: 375,
    minHeight: 240,
    layoutsHaveThisAtInit: ['lg', 'sm', 'xs'],
    renderName: (props) => (
      <div data-inspector="modules-openOrders">
        <OrdersSummaryInit {...props} />
      </div>
    ),
    getComponent: (props) => <OpenOrders {...props} />,
  },
  {
    id: 'orderHistory',
    iconId: 'orderHistory',
    minWidth: 375,
    minHeight: 240,
    renderName: () => (
      <div data-inspector="modules-orderHistory">{_t('orders.c.order.history')}</div>
    ),
    getComponent: (props) => <HistoryOrders {...props} />,
  },
  {
    id: 'tradeHistory',
    iconId: 'tradeHistory',
    minWidth: 375,
    minHeight: 240,
    renderName: () => (
      <div data-inspector="modules-tradeHistory">{_t('orders.c.order.detail')}</div>
    ),
    getComponent: (props) => <TradeHistory {...props} />,
  },
  {
    id: 'fund',
    iconId: 'fund',
    minWidth: 375,
    minHeight: 240,
    renderName: () => _t('dAS86Y9YkZeYWpoNs7EWcA'),
    getComponent: () => <Fund />,
  },
  {
    id: 'assets',
    iconId: 'assets',
    minWidth: 280,
    minHeight: 240,
    actions: ['float'],
    layoutsHaveThisAtInit: ['lg', 'xs'],
    renderName: () => _t('navmenu.assets.overview'),
    getComponent: (props) => <Assets {...props} />,
  },
];
const NEW_MODULES = [];
/**
 *
 * @param {*} conf 模块自身的配置，参考上面其他模块的配置方法
 * @param {object} actionConfig 添加动作的配置
 *   @property {array} priorityPosition 优先往这些模块上靠，为空则会按默认添加逻辑注入模块
 *   @property {func} checkCreateCondition 新模块注入时机，不填默认页面加载进来就会添加。如果需要其他条件，可以在checkCondition的执行处注入
 *   @property {array} selectExcludeModule 高亮需要排除的模块，不配置默认不高亮；配置为空数组则强制高亮；配置了模块id数组，会排出配置了的模块，然后高亮
 *   @property {func} checkSelectCondition 高亮的时机，如果需要高亮但此项未配置，将在注入模块的时候默认高亮
 */
const registerNewModule = (conf, actionConfig = {}) => {
  MODULES.push(conf);
  NEW_MODULES.push({ id: conf.id, config: actionConfig });
};

if (isFuturesNew()) {
  registerNewModule({
    id: 'realisedPNL',
    iconId: 'fund',
    minWidth: 375,
    minHeight: 240,
    renderName: () => _t('realised.detial.title'),
    getComponent: () => <FuturesPNL />,
  });
}

// 多租户开关
if (isDisplayBotStrategy()) {
  registerNewModule(
    {
      id: 'BotOrder',
      iconId: 'bot-order',
      minWidth: 375,
      minHeight: 240,
      renderName: () => _t('strategy'),
      getComponent: () => <BotOrder />,
    },
    {
      selectExcludeModule: [],
      priorityPosition: ['openOrders', 'orderHistory', 'tradeHistory', 'fund'],
      checkSelectCondition: ({ tradeMode, currentLayout }) => {
        if (tradeMode === TRADEMODE_META.keys.BOTTRADE) {
          return currentLayout !== 'classic';
        }
        return false;
      },
    },
  );
}

export const getModuleConfig = (moduleId, type = 'tab') => {
  return {
    type,
    id: moduleId,
    name: moduleId,
    config: MODULES_MAP[moduleId]?.config || {},
    component: MODULES_MAP[moduleId] ? moduleId : 'undefined',
  };
};

export const renderModule = (moduleId, otherProps = {}) => {
  if (!MODULES_MAP[moduleId]) return null;
  const { getComponent, ...other } = MODULES_MAP[moduleId];
  return getComponent({ ...other, ...otherProps });
};

const MODULES_MAP = {};
MODULES.forEach((v) => (MODULES_MAP[v.id] = v));

export { MODULES_MAP, NEW_MODULES };

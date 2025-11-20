/**
 * Owner: mike@kupotech.com
 */
import classicgridLight from '../../../../static/bot/classicgrid-light.svg';
import classicgridDark from '../../../../static/bot/classicgrid-dark.svg';
import futuregridLight from '../../../../static/bot/futuregrid-light.svg';
import futuregridDark from '../../../../static/bot/futuregrid-dark.svg';
import matingaleLight from '../../../../static/bot/matingale-light.svg';
import matingaleDark from '../../../../static/bot/matingale-dark.svg';
import smarttradeLight from '../../../../static/bot/smarttrade-light.svg';
import smarttradeDark from '../../../../static/bot/smarttrade-dark.svg';
import infinitygridLight from '../../../../static/bot/infinitygrid-light.svg';
import infinitygridDark from '../../../../static/bot/infinitygrid-dark.svg';
import automaticinverstLight from '../../../../static/bot/automaticinverst-light.svg';
import automaticinverstDark from '../../../../static/bot/automaticinverst-dark.svg';
import aifuturebilaterDark from '../../../../static/bot/aifuturebilater-dark.svg';
import aifuturebilaterLight from '../../../../static/bot/aifuturebilater-light.svg';
import futuremartingaleDark from '../../../../static/bot/futuremartingale-dark.svg';
import futuremartingaleLight from '../../../../static/bot/futuremartingale-light.svg';
import superaiDark from '../../../../static/bot/superai-dark.svg';
import superaiLight from '../../../../static/bot/superai-light.svg';
import morestrategyDark from '../../../../static/bot/morestrategy-dark.svg';
import morestrategyLight from '../../../../static/bot/morestrategy-light.svg';

import { tenantConfig } from '../../../tenantConfig';

// 策略类型配置
const strategyLists = [
  {
    key: 'GRID', // 后端代码使用的名字
    cname: '现货网格', // 中文名字
    name: 'bot.classicgrid', // 名字 lang
    id: 1,
    href: '/trading-bot/spot/grid/BTC-USDT',
    indexTag: ['volatile', 'Hot'], //  标签
    note: 'bot.clsgrid.note', // 描述
    iconLight: classicgridLight,
    iconDark: classicgridDark,
  },
  {
    key: 'CONTRACT_GRID',
    cname: '合约网格',
    name: 'bot.futuregrid',
    id: 3,
    href: '/trading-bot/futures/grid/XBTUSDTM',
    indexTag: ['bullmarket'],
    note: 'bot.futrgrid.note',
    iconLight: futuregridLight,
    iconDark: futuregridDark,
  },
  {
    key: 'MARTIN_GALE',
    cname: '马丁格尔',
    name: 'bot.matingale',
    id: 7,
    href: '/trading-bot/martingale/BTC-USDT',
    indexTag: ['bullmarket'],
    note: 'bot.batchbuysell',
    iconLight: matingaleLight,
    iconDark: matingaleDark,
  },
  {
    key: 'POSITION',
    cname: '智能持仓',
    name: 'bot.smarttrade',
    id: 4,
    href: '/trading-bot/rebalance',
    indexTag: ['bullmarket'],
    note: 'bot.smart.note',
    iconLight: smarttradeLight,
    iconDark: smarttradeDark,
  },
  {
    key: 'INFINITY_GRID',
    cname: '无限网格',
    name: 'bot.infinitygrid',
    id: 5,
    href: '/trading-bot/infinity/grid/BTC-USDT',
    indexTag: ['volatile'],
    note: 'bot.infnty.note',
    iconLight: infinitygridLight,
    iconDark: infinitygridDark,
  },
  {
    key: 'AIP',
    cname: '极速定投',
    name: 'bot.automaticinverst',
    id: 2,
    href: '/trading-bot/dca/BTC-USDT',
    indexTag: ['bullmarket'],
    note: 'bot.auto.note',
    iconLight: automaticinverstLight,
    iconDark: automaticinverstDark,
  },
];
const MORE = 'MORE';
const DFT_SPOT_SYMBOL = `BTC-${window._BASE_CURRENCY_}`;
// 多站点展示
const strategyListsShareSite = [
  {
    key: 'SPOT_AI_GRID',
    cname: 'AI动态网格',
    name: 'dynamicgrid',
    id: 8,
    href: `/trade/strategy/supergrid/${DFT_SPOT_SYMBOL}`,
    note: 'dynamicgrid.note',
    iconLight: superaiLight,
    iconDark: superaiDark,
  },
  {
    key: 'WIN_TWO_WAY',
    cname: 'AI双向赢',
    name: 'aiFutureBilater',
    isFuture: true,
    id: 9,
    href: '/trade/strategy/dualfuturesai/XBTUSDTM',
    note: 'aiFutureBilaterFeatures',
    iconLight: aifuturebilaterLight,
    iconDark: aifuturebilaterDark,
  },
  {
    key: 'GRID', // 后端枚举key
    cname: '现货网格',
    name: 'bot.classicgrid',
    id: 1, // 后端id
    href: `/trade/strategy/spotgrid/${DFT_SPOT_SYMBOL}`,
    note: 'bot.clsgrid.note',
    iconLight: classicgridLight,
    iconDark: classicgridDark,
  },
  {
    key: 'CONTRACT_GRID',
    cname: '合约网格',
    name: 'bot.futuregrid',
    isFuture: true,
    id: 3,
    href: '/trade/strategy/futuresgrid/XBTUSDTM',
    note: 'bot.futrgrid.note',
    iconLight: futuregridLight,
    iconDark: futuregridDark,
  },
  {
    key: 'MARTIN_GALE',
    cname: '马丁格尔',
    name: 'bot.matingale',
    id: 7,
    href: `/trade/strategy/martingale/${DFT_SPOT_SYMBOL}`,
    note: 'bot.batchbuysell',
    iconLight: matingaleLight,
    iconDark: matingaleDark,
  },
  {
    key: 'FUTURES_MARTIN_GALE',
    cname: '合约马丁',
    name: 'futurematingale',
    id: 12,
    href: '/trade/strategy/martingale/XBTUSDTM',
    note: 'futurematingale.note',
    isFuture: true,
    iconLight: futuremartingaleLight,
    iconDark: futuremartingaleDark,
  },
  {
    key: MORE,
    cname: '更多',
    name: '7dfcc40477b34000ab28',
    id: MORE,
    href: '/trade/strategy',
    note: '3f6398a3c3334000aaac',
    iconLight: morestrategyLight,
    iconDark: morestrategyDark,
  },
];

export const getBotList = (machineMap = {}) => {
  const lists = tenantConfig.botGlobalListShow() ? strategyLists : strategyListsShareSite;

  return lists.filter((bot) => {
    if (bot.id === MORE) return true;
    return !!machineMap[bot.id];
  });
};

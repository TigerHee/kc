/*
 * owner: Borden@kupotech.com
 */
import { ceil, chunk, map } from 'lodash';
import { _t } from 'src/utils/lang';
import { MODULES, getModuleConfig } from '../moduleConfig';
import { LAYOUT_GLOBAL, LAYOUT_BORDERS } from './constants';
import { isDisplayBotStrategy, isDisplayFutures } from '@/meta/multiTenantSetting';

// 专业版默认
export const advanced = {
  global: LAYOUT_GLOBAL,
  borders: LAYOUT_BORDERS,
  layout: {
    type: 'row',
    children: [
      {
        type: 'row',
        weight: 5,
        children: [
          {
            type: 'row',
            weight: 2,
            children: [
              {
                type: 'tabset',
                weight: 4,
                children: [getModuleConfig('chart'), getModuleConfig('depth')],
              },
              {
                type: 'tabset',
                weight: 1,
                children: [getModuleConfig('orderBook'), getModuleConfig('recentTrade')],
              },
            ],
          },
          {
            type: 'tabset',
            weight: 1,
            children: [
              getModuleConfig('openOrders'),
              getModuleConfig('orderHistory'),
              getModuleConfig('tradeHistory'),
              getModuleConfig('fund'),
              ...(isDisplayBotStrategy() ? [getModuleConfig('BotOrder')] : []),
              ...(isDisplayFutures() ? [getModuleConfig('realisedPNL')] : []),
            ],
          },
        ],
      },
      {
        type: 'row',
        weight: 1,
        children: [
          {
            type: 'tabset',
            weight: 2,
            children: [getModuleConfig('orderForm')],
          },
          {
            type: 'tabset',
            weight: 1,
            children: [getModuleConfig('assets')],
          },
        ],
      },
    ],
  },
};
// 全屏版默认
export const fullscreen = {
  global: LAYOUT_GLOBAL,
  borders: LAYOUT_BORDERS,
  layout: {
    type: 'row',
    children: [
      {
        type: 'row',
        weight: 2,
        children: [
          {
            type: 'tabset',
            children: [getModuleConfig('chart'), getModuleConfig('depth')],
          },
          {
            type: 'tabset',
            height: 300,
            children: [
              getModuleConfig('openOrders'),
              getModuleConfig('orderHistory'),
              getModuleConfig('tradeHistory'),
              getModuleConfig('fund'),
              ...(isDisplayBotStrategy() ? [getModuleConfig('BotOrder')] : []),
              ...(isDisplayFutures() ? [getModuleConfig('realisedPNL')] : []),
            ],
          },
        ],
      },
      {
        type: 'row',
        weight: 1,
        children: [
          {
            type: 'row',
            children: [
              {
                type: 'tabset',
                weight: 50,
                children: [getModuleConfig('orderBook')],
              },
              {
                type: 'tabset',
                weight: 50,
                children: [getModuleConfig('recentTrade')],
              },
            ],
          },
          {
            type: 'tabset',
            children: [getModuleConfig('orderForm')],
          },
        ],
      },
    ],
  },
};

// 标准版默认
export const classic = {
  global: LAYOUT_GLOBAL,
  borders: LAYOUT_BORDERS,
  layout: {
    type: 'row',
    children: [
      {
        type: 'row',
        weight: 1,
        children: [
          {
            type: 'tabset',
            children: [getModuleConfig('markets')],
          },
          {
            type: 'tabset',
            height: 280,
            children: [getModuleConfig('assets')],
          },
        ],
      },
      {
        type: 'row',
        weight: 3,
        children: [
          {
            type: 'tabset',
            weight: 50,
            children: [getModuleConfig('chart'), getModuleConfig('depth')],
          },
          {
            type: 'tabset',
            weight: 50,
            children: [
              getModuleConfig('orderForm'),
              getModuleConfig('openOrders'),
              getModuleConfig('orderHistory'),
              getModuleConfig('tradeHistory'),
              getModuleConfig('fund'),
              ...(isDisplayBotStrategy() ? [getModuleConfig('BotOrder')] : []),
              ...(isDisplayFutures() ? [getModuleConfig('realisedPNL')] : []),
            ],
          },
        ],
      },
      {
        type: 'tabset',
        weight: 1,
        children: [getModuleConfig('orderBook'), getModuleConfig('recentTrade')],
      },
    ],
  },
};

export const DEFAULT_LAYOUTS = [
  {
    code: 'classic',
    name: () => _t('uuEXn5d6WHFtyLwQY3LFGa'),
    defaultLayout: classic,
  },
  {
    code: 'advanced',
    name: () => _t('66HNdYmjJ4JWRZmptad35A'),
    defaultLayout: advanced,
  },
  {
    code: 'fullscreen',
    name: () => _t('4vrM5S22xkDE6e3hYkDHwC'),
    defaultLayout: fullscreen,
  },
];

const DEFAULT_LAYOUTS_MAP = {};
DEFAULT_LAYOUTS.forEach((v) => (DEFAULT_LAYOUTS_MAP[v.code] = v));
export { DEFAULT_LAYOUTS_MAP };

export const DEFAULT_LAYOUT = 'advanced';
// 巡检专用布局， 会把所有模块展开成两行
export const LAYOUT_FOR_INSPECT = {
  global: LAYOUT_GLOBAL,
  layout: {
    type: 'row',
    children: [
      {
        type: 'row',
        children: map(chunk(MODULES, ceil(MODULES.length / 2)), (row) => {
          return {
            weight: 1,
            type: 'row',
            children: map(row, ({ id }) => {
              return {
                weight: 1,
                type: 'tabset',
                children: [getModuleConfig(id)],
              };
            }),
          };
        }),
      },
    ],
  },
};

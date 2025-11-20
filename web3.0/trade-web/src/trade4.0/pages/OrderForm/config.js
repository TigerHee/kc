/*
 * @owner: borden@kupotech.com
 */
import { createContext } from 'react';
import { _t } from 'src/utils/lang';
import { divide } from 'helper';
import { list2map } from './utils';
import axisYScreen from '@/components/ComponentWrapper/axisYScreen';

// 组件名称
export const name = 'orderForm';
// wrapper context
export const WrapperContext = createContext('');
// side context
export const SideContext = createContext(null);

// 杠杆下单模式 枚举
export const MARGIN_ORDER_MODE_ENUM = {
  NORMAL: 'NORMAL', // 普通
  AUTO_BORROW: 'AUTO_BORROW', // 自动借币
  AUTO_REPAY: 'AUTO_REPAY', // 自动还币
  AUTO_BORROW_AND_REPAY: 'AUTO_BORROW_AND_REPAY', // 自动借还
};

// y轴响应式套件
export const { useYScreen, withYScreen, YScreenWrapper, YScreenContext } = axisYScreen.getScreen(
  name,
  [440, 480],
);
/**
 * 下单方向，买卖
 */
export const TRADE_SIDE = [
  {
    value: 'buy',
    color: 'primary',
    buttonType: 'brandGreen',
    label: () => _t('orders.desc.buy'),
    orderCurrencyIndexInPair: 1,
    noAuthButtonPropsName: 'loginProps',
  },
  {
    value: 'sell',
    color: 'secondary',
    buttonType: 'secondary',
    label: () => _t('orders.desc.sell'),
    orderCurrencyIndexInPair: 0,
    noAuthButtonPropsName: 'registerProps',
  },
];
export const TRADE_SIDE_MAP = list2map(TRADE_SIDE);

/**
 * 委托类型
 */
export const ORDER_TYPES = [
  // 限价单
  {
    value: 'customPrise',
    sensorKey: 'limit',
    showAdvanced: ({ showAuction }) => {
      return !showAuction;
    },
    label: () => _t('trd.type.limit.o'),
  },
  // 市价单
  {
    value: 'marketPrise',
    sensorKey: 'market',
    label: () => _t('trd.type.market.o'),
    priceValidatePassNames: ['triggerPrice', 'price'],
    needCheckBPP: true,
  },
  // 高级市价单
  {
    value: 'advancedLimit',
    sensorKey: 'advancedLimit',
    label: () => _t('gSwMLa4CkKnfuxZeVSwZCt'),
    // 是否展示
    show: ({ isSupportAdvancedLimit }) => {
      return !!isSupportAdvancedLimit;
    },
  },
  // 限价止损
  {
    value: 'triggerPrise',
    sensorKey: 'limitStop',
    showAdvanced: true,
    label: () => _t('trd.type.stop.limit.s'),
  },
  // 市价止损
  {
    value: 'marketTriggerPrice',
    sensorKey: 'limitMarket',
    label: () => _t('trd.type.stop.market.s'),
    priceValidatePassNames: ['price'],
  },
  // oco
  {
    value: 'ocoPrise',
    sensorKey: 'limitOCO',
    label: () => _t('trd.type.oco.limit.s'),
    showPercent: false,
    // 限价配置
    limitPriceConf: {
      itemConf: (params) => {
        const { lastPriceVal, isBuy } = params;
        return {
          extraRules: [
            {
              validator(_, value) {
                const _val = +value;
                if (value) {
                  if (isBuy && _val >= lastPriceVal) {
                    return Promise.reject(_t('trd.form.oco.price.error.more'));
                  }
                  if (!isBuy && _val <= lastPriceVal) {
                    return Promise.reject(_t('trd.form.oco.price.error.less'));
                  }
                }
                return Promise.resolve();
              },
            },
          ],
        };
      },
    },
    // 触发价配置
    triggerConf: {
      itemConf: (params) => {
        const { lastPriceVal, isBuy } = params;
        return {
          extraRules: [
            {
              validator(_, value) {
                const _val = +value;
                if (value) {
                  if (isBuy && _val <= lastPriceVal) {
                    return Promise.reject(_t('trd.form.oco.stop.error.less'));
                  }
                  if (!isBuy && _val >= lastPriceVal) {
                    return Promise.reject(_t('trd.form.oco.stop.error.more'));
                  }
                }
                return Promise.resolve();
              },
            },
          ],
        };
      },
    },
    // 价格配置
    priceConf: {
      inputProps: () => ({
        placeholder: _t('trd.form.limit'),
      }),
    },
    showVolume: false,
    submitFormat: (data) => {
      const { limitPrice, price, ...others } = data?.values || {};
      return {
        ...data,
        values: {
          ...others,
          price: limitPrice,
          limitPrice: price,
        },
      };
    },
    // 是否展示
    show: ({ ocoEnable }) => {
      return !!ocoEnable;
    },
  },
  // tso
  {
    value: 'tsoPrise',
    sensorKey: 'limitTSO',
    label: () => _t('trd.form.tso.title'),
    // 展示成交额
    showVolume: false,
    // 触发价（激活价）配置
    triggerConf: {
      inputProps: () => ({
        placeholder: _t('trd.form.tso.trigger.price'),
      }),
      itemConf: {
        required: false,
      },
    },
    // 比率（回调幅度）配置
    rangeConf: {},
    /**
     * 数据处理
     * @param {{
     *  values: Record<string, any>,
     *  side: string,
     * }} data
     * @param {{
     *  lastPriceVal: number,
     * }} conf
     */
    submitFormat: (data, conf = {}) => {
      const { lastPriceVal } = conf;
      const { values } = data;
      const res = {
        ...data,
        values: {
          ...values,
          triggerPrice: values.triggerPrice || lastPriceVal,
          params: {
            pop: divide(values.pop, 100).toFixed(),
            stop: 'tso',
          },
        },
      };
      return res;
    },
    // 是否展示
    show: ({ tsoEnable }) => {
      return !!tsoEnable;
    },
  }, // 时间加权委托，timeWeightedOrder
  {
    value: 'timeWeightedOrder',
    sensorKey: 'timeWeightedOrder',
    label: () => _t('dosDaxryqMM1SAhnST2yrs'),
    showPercent: false,
    showVolume: false,
    // 是否展示
    show: ({ isSupportTimeWeightedOrder, isEtfCoin }) => {
      return !!isSupportTimeWeightedOrder && !isEtfCoin;
    },
  },
];
export const ORDER_TYPES_MAP = list2map(ORDER_TYPES);

/**
 * 时间策略
 */
export const TIME_STRATEGY = [
  {
    value: 'GTC',
    label: () => _t('9bb91a40621f4000a054'),
  },
  {
    value: 'GTT',
    label: () => _t('1f83748d68624000aee3'),
    displayUsefulLife: true,
  },
  {
    value: 'IOC',
    label: () => _t('7e44c7d2aa494000a62a'),
  },
  {
    value: 'FOK',
    label: () => _t('3fc6031a1d5b4000ae3b'),
  },
];
export const TIME_STRATEGY_MAP = list2map(TIME_STRATEGY);

/**
 * 高级模式
 */
export const ADVANCED_MODEL = [
  {
    value: 'PostOnly',
    label: 'Post Only',
    tooltipTitle: () => _t('trd.help.postonly'),
    timeStrategyOptions: [TIME_STRATEGY_MAP.GTC, TIME_STRATEGY_MAP.GTT],
  },
  {
    value: 'Hidden',
    label: 'Hidden',
    displayShowAmount: true,
    tooltipTitle: () => _t('trade.help.hidden.order'),
    timeStrategyOptions: TIME_STRATEGY,
  },
];
export const ADVANCED_MODEL_MAP = list2map(ADVANCED_MODEL);

// 新的 tab 下单类型，高级限价模式
export const ADVANCED_LIMIT_MODEL = [
  {
    value: 'GTC',
    label: () => _t('fvjea5ZHHAM5xQBfJx8rGf'),
  },
  {
    value: 'FOK',
    label: () => _t('xp6Y3CKdm29G4xBkpvKfq1'),
  },
  {
    value: 'IOC',
    label: () => _t('aRtmExjzQz6apcXiE2WBe5'),
  },
];

export const ADVANCED_LIMIT_MODEL_MAP = list2map(ADVANCED_LIMIT_MODEL);

// 借贷类型
export const BORROW_TYPE = {
  auto: 'auto',
  manual: 'manual',
};

/*
 * @owner: borden@kupotech.com
 */
import { each } from 'lodash';
import { _t } from 'src/utils/lang';
import { ACCOUNT_CODE } from './const';
import { TRADE_TYPES_CONFIG } from './tradeTypes';

/**
 * 自动出借状态
 */
export const AUTO_LEND_STATUS = {
  ENABLE: 'ENABLE', // 开启
  DISABLE: 'DISABLE', // 关闭
};
// 杠杆账户状态
export const STATUS = {
  [ACCOUNT_CODE.MARGIN]: {
    // 生效
    EFFECTIVE: {
      code: 'EFFECTIVE',
    },
    // 自动续借冻结
    FROZEN_RENEW: {
      code: 'FROZEN_RENEW',
      isFrozenTrade: true,
      label: () => _t('margin.renewing'),
      tipInOrderList: () => _t('margin.system.renewing'),
    },
    // 强平冻结
    FROZEN_FL: {
      code: 'FROZEN_FL',
      isFrozenTrade: true,
      label: () => _t('margin.liquidating'),
      tipInOrderList: () => _t('margin.system.operating'),
      desc: () => _t('liquidated.warning'),
    },
    // 穿仓
    LIABILITY: {
      code: 'LIABILITY',
      isFrozenTrade: true,
      label: () => _t('status.negativeBalance'),
      desc: () => _t('negativeBalance.warning'),
    },
  },
  [ACCOUNT_CODE.ISOLATED]: {
    // 有负债
    DEBT: {
      code: 'DEBT',
      isSupportClosePosition: true, // 是否支持一键平仓
    },
    // 无负债
    CLEAR: {
      code: 'CLEAR',
      isHideEarningRate: true,
      isHideLiquidationPrice: true,
    },
    // 破产(发生穿仓后，进入破产状态)
    // BANKRUPTCY和LIABILITY都是同一状态，BANKRUPTCY是后端返的， LIABILITY是前端为了保持和全仓一致用的
    // 如果两个其中一个修改，记得同步修改另一项
    LIABILITY: {
      code: 'BANKRUPTCY',
      isFrozenTrade: true,
      isHideEarningRate: true,
      isHideLiabilityRate: true,
      isHideLiquidationPrice: true,
      label: () => _t('status.negativeBalance'),
      desc: () => _t('negativeBalance.warning'),
    },
    BANKRUPTCY: {
      code: 'BANKRUPTCY',
      isFrozenTrade: true,
      isHideEarningRate: true,
      isHideLiabilityRate: true,
      isHideLiquidationPrice: true,
      label: () => _t('status.negativeBalance'),
      desc: () => _t('negativeBalance.warning'),
    },
    // 借入中
    IN_BORROW: {
      code: 'IN_BORROW',
      // isFrozenTrade: true,
      label: () => _t('status.borrowing'),
    },
    // 还款中
    IN_REPAY: {
      code: 'IN_REPAY',
      // isFrozenTrade: true,
      label: () => _t('status.repaying'),
    },
    // 平仓中
    IN_LIQUIDATION: {
      code: 'IN_LIQUIDATION',
      isFrozenTrade: true,
      isHideEarningRate: true,
      isHideLiabilityRate: true,
      isHideLiquidationPrice: true,
      isSupportCancelClosePosition: true, // 是否支持取消一键平仓
      label: () => _t('margin.liquidating'),
      desc: () => _t('liquidated.warning'),
      tipInOrderList: () => _t('margin.system.operating'),
    },
    // 自动续借中
    IN_AUTO_RENEW: {
      code: 'IN_AUTO_RENEW',
      isFrozenTrade: true,
      isHideLiabilityRate: true,
      label: () => _t('margin.renewing'),
      tipInOrderList: () => _t('margin.system.renewing'),
    },
  },
};

const ISOLATED_STATUS = STATUS[ACCOUNT_CODE.ISOLATED];
const MARGIN_STATUS = STATUS[ACCOUNT_CODE.MARGIN];
// 仓位状态的map positionStatusMap
export const POSITION_STATUS_CONFIG = {
  // 已穿仓
  BANKRUPTCY: {
    ...ISOLATED_STATUS.LIABILITY,
  },
  LIABILITY: {
    ...MARGIN_STATUS.LIABILITY,
  },
  // 强平中
  IN_LIQUIDATION: {
    ...ISOLATED_STATUS.IN_LIQUIDATION,
  },
  FROZEN_FL: {
    ...MARGIN_STATUS.FROZEN_FL,
  },
  // 续借中
  IN_AUTO_RENEW: {
    ...ISOLATED_STATUS.IN_AUTO_RENEW,
  },
  FROZEN_RENEW: {
    ...MARGIN_STATUS.FROZEN_RENEW,
  },
  // 低风险
  LOW: {
    code: 'LOW',
    label: () => _t('low.risk'),
  },
  // 中风险
  MEDIUM: {
    code: 'MEDIUM',
    label: () => _t('medium.risk'),
  },
  // 高风险
  HIGH: {
    code: 'HIGH',
    label: () => _t('high.risk'),
  },
};

// 杠杆(切换全仓/逐仓)
export const MARGIN_TABS = [
  {
    value: 'ALL',
    label: () => _t('all'),
    getMaxLeverage: ({ marginMaxLeverage, isolatedMaxLeverage }) =>
      Math.max(marginMaxLeverage || 0, isolatedMaxLeverage || 0),
  },
  {
    value: TRADE_TYPES_CONFIG.MARGIN_TRADE.key,
    label: TRADE_TYPES_CONFIG.MARGIN_TRADE.label1,
    getMaxLeverage: ({ marginMaxLeverage }) => marginMaxLeverage,
  },
  {
    value: TRADE_TYPES_CONFIG.MARGIN_ISOLATED_TRADE.key,
    label: TRADE_TYPES_CONFIG.MARGIN_ISOLATED_TRADE.label1,
    getMaxLeverage: ({ isolatedMaxLeverage }) => isolatedMaxLeverage,
  },
];

const MARGIN_TABS_MAP = {};
each(MARGIN_TABS, (item) => {
  MARGIN_TABS_MAP[item.value] = item;
});

export { MARGIN_TABS_MAP };

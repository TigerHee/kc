/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import { _t } from 'utils/lang';
import { each } from 'lodash';

const accountIconCommonStyle = {
  display: 'inline-block',
  width: 18,
  height: 18,
  lineHeight: '18px',
  textAlign: 'center',
  borderRadius: 3,
  fontSize: 12,
  color: '#fff',
};

const AccountNameWithIcon = ({ label, iconText, bc }) => (
  <div style={{ display: 'inline-block' }}>
    <div style={{ ...accountIconCommonStyle, backgroundColor: bc }} className="mr-8">{iconText}</div>
    {label}
  </div>
);

export const ACCOUNT_CODE = {
  MAIN: 'MAIN', // 储蓄账户
  TRADE: 'TRADE', // 币币账户
  TRADE_HF: 'TRADE_HF', // 高频账户
  MARGIN: 'MARGIN', // 杠杆账户
  ISOLATED: 'ISOLATED', // 逐仓杠杆账户
  CONTRACT: 'CONTRACT', // 合约账户
  POOL: 'POOL', // 矿池账户
};
// 账户之间
export const ACCOUNT = [
  {
    key: ACCOUNT_CODE.MAIN,
    color: '#58CCB6',
    label: () => _t('trans.account.main'),
    labelComp: lang => (
      <AccountNameWithIcon
        bc="#1ABB97"
        label={_t('trans.account.main')}
        iconText={lang === 'zh_CN' ? '储' : 'Ma'}
      />
    ),
    supportDirection: ['from', 'to'], // 支持的方向
    // 支持划入该账户的账户
    supportFromAccounts: [
      ACCOUNT_CODE.TRADE,
      ACCOUNT_CODE.MARGIN,
      ACCOUNT_CODE.CONTRACT,
      ACCOUNT_CODE.ISOLATED,
      ACCOUNT_CODE.TRADE_HF,
      // ACCOUNT_CODE.POOL,
    ],
    // 支持划出至的账户
    supportToAccounts: [
      ACCOUNT_CODE.TRADE,
      ACCOUNT_CODE.MARGIN,
      ACCOUNT_CODE.CONTRACT,
      ACCOUNT_CODE.ISOLATED,
      ACCOUNT_CODE.TRADE_HF,
      // ACCOUNT_CODE.POOL,
    ],
    checkCurrencyIsSupport: null, // 用来判断币种是否支持该账户
  },
  {
    key: ACCOUNT_CODE.TRADE,
    color: '#5EAEFF',
    label: () => _t('trade.account'),
    labelComp: lang => (
      <AccountNameWithIcon
        bc="#5A96E8"
        label={_t('trade.account')}
        iconText={lang === 'zh_CN' ? '币' : 'Tr'}
      />
    ),
    supportDirection: ['from', 'to'],
    supportFromAccounts: [
      ACCOUNT_CODE.MAIN,
      ACCOUNT_CODE.MARGIN,
      ACCOUNT_CODE.CONTRACT,
      ACCOUNT_CODE.ISOLATED,
      ACCOUNT_CODE.TRADE_HF,
      // ACCOUNT_CODE.POOL,
    ],
    supportToAccounts: [
      ACCOUNT_CODE.MAIN,
      ACCOUNT_CODE.MARGIN,
      ACCOUNT_CODE.CONTRACT,
      ACCOUNT_CODE.ISOLATED,
      ACCOUNT_CODE.TRADE_HF,
      // ACCOUNT_CODE.POOL,
    ],
    checkCurrencyIsSupport: null,
  },
  {
    key: ACCOUNT_CODE.TRADE_HF,
    color: '#58CCB6',
    label: () => _t('highFrequency.account'),
    labelComp: lang => (
      <AccountNameWithIcon
        bc="#1ABB97"
        label={_t('highFrequency.account')}
        iconText={lang === 'zh_CN' ? '高' : 'HF'}
      />
    ),
    supportDirection: ['from', 'to'], // 支持的方向
    // 支持划入该账户的账户
    supportFromAccounts: [
      ACCOUNT_CODE.MAIN,
      ACCOUNT_CODE.TRADE,
      ACCOUNT_CODE.MARGIN,
      ACCOUNT_CODE.ISOLATED,
      ACCOUNT_CODE.CONTRACT,
    ],
    // 支持划出至的账户
    supportToAccounts: [
      ACCOUNT_CODE.MAIN,
      ACCOUNT_CODE.TRADE,
      ACCOUNT_CODE.MARGIN,
      ACCOUNT_CODE.CONTRACT,
      ACCOUNT_CODE.ISOLATED,
    ],
    checkCurrencyIsSupport: null, // 用来判断币种是否支持该账户
  },
  {
    key: ACCOUNT_CODE.MARGIN,
    color: '#7B78E3',
    label: () => _t('crossMargin.account'),
    labelComp: lang => (
      <AccountNameWithIcon
        bc="#7B78E3"
        label={_t('crossMargin.account')}
        iconText={lang === 'zh_CN' ? '杠' : 'Mg'}
      />
    ),
    autoRepayEnabledTip: () => _t('transfer.cross.autoRepay.enabled'),
    negativeBalanceTip: () => _t('transfer.negativeBalance.cross'),
    supportDirection: ['from', 'to'],
    supportFromAccounts: [
      ACCOUNT_CODE.MAIN,
      ACCOUNT_CODE.TRADE,
      ACCOUNT_CODE.CONTRACT,
      ACCOUNT_CODE.ISOLATED,
      ACCOUNT_CODE.TRADE_HF,
      // ACCOUNT_CODE.POOL,
    ],
    supportToAccounts: [
      ACCOUNT_CODE.MAIN,
      ACCOUNT_CODE.TRADE,
      ACCOUNT_CODE.CONTRACT,
      ACCOUNT_CODE.ISOLATED,
      ACCOUNT_CODE.TRADE_HF,
      // ACCOUNT_CODE.POOL,
    ],
    checkCurrencyIsSupport: ({ crossCurrenciesMap, currency }) => {
      if (crossCurrenciesMap && JSON.stringify(crossCurrenciesMap) !== '{}') {
        return !!crossCurrenciesMap[currency];
      }
      return true;
    },
  },
  {
    key: ACCOUNT_CODE.ISOLATED,
    color: '#7B78E3',
    label: symbol => `${_t('isolatedMargin')} ${symbol}`,
    labelComp: lang => (
      <AccountNameWithIcon
        bc="#7B78E3"
        label={_t('isolatedMargin.account')}
        iconText={lang === 'zh_CN' ? '逐' : 'Is'}
      />
    ),
    autoRepayEnabledTip: (params = {}) => _t('transfer.isolated.autoRepay.enabled', params),
    negativeBalanceTip: (params = {}) => _t('transfer.negativeBalance.isolated', params),
    supportDirection: ['from', 'to'],
    supportFromAccounts: [
      ACCOUNT_CODE.MAIN,
      ACCOUNT_CODE.TRADE,
      ACCOUNT_CODE.CONTRACT,
      // ACCOUNT_CODE.POOL,
      ACCOUNT_CODE.MARGIN,
      ACCOUNT_CODE.ISOLATED,
      ACCOUNT_CODE.TRADE_HF,
    ],
    supportToAccounts: [
      ACCOUNT_CODE.MAIN,
      ACCOUNT_CODE.TRADE,
      ACCOUNT_CODE.CONTRACT,
      // ACCOUNT_CODE.POOL,
      ACCOUNT_CODE.MARGIN,
      ACCOUNT_CODE.ISOLATED,
      ACCOUNT_CODE.TRADE_HF,
    ],
    checkCurrencyIsSupport: null,
  },
  {
    key: ACCOUNT_CODE.CONTRACT,
    color: '#ADDCD7',
    label: () => _t('margin.account'),
    labelComp: lang => (
      <AccountNameWithIcon
        bc="#72948B"
        label={_t('margin.account')}
        iconText={lang === 'zh_CN' ? '合' : 'Fu'}
      />
    ),
    supportDirection: ['from', 'to'],
    supportFromAccounts: [
      ACCOUNT_CODE.MAIN,
      ACCOUNT_CODE.TRADE,
      ACCOUNT_CODE.MARGIN,
      // ACCOUNT_CODE.POOL,
      ACCOUNT_CODE.ISOLATED,
      ACCOUNT_CODE.TRADE_HF,
    ],
    supportToAccounts: [
      ACCOUNT_CODE.MAIN,
      ACCOUNT_CODE.TRADE,
      ACCOUNT_CODE.MARGIN,
      ACCOUNT_CODE.TRADE_HF,
      // ACCOUNT_CODE.POOL,
      ACCOUNT_CODE.ISOLATED,
    ],
    checkCurrencyIsSupport: ({ categories, currency }) => {
      if (categories && categories[currency]) {
        return categories[currency].isContractEnabled;
      }
      return true;
    },
  },
  // {
  //   key: ACCOUNT_CODE.POOL,
  //   color: '#B0CDF0',
  //   label: () => _t('n.trade.asset.trans.poolx'),
  //   labelComp: () => (
  //     <AccountNameWithIcon
  //       bc="#8CB2C0"
  //       iconText="Px"
  //       label={_t('n.trade.asset.trans.poolx')}
  //     />
  //   ),
  //   supportDirection: ['from', 'to'],
  //   supportFromAccounts: [
  //     ACCOUNT_CODE.MAIN,
  //     ACCOUNT_CODE.TRADE,
  //     ACCOUNT_CODE.MARGIN,
  //     ACCOUNT_CODE.CONTRACT,
  //     // ACCOUNT_CODE.ISOLATED,
  //   ],
  //   supportToAccounts: [
  //     ACCOUNT_CODE.MAIN,
  //     ACCOUNT_CODE.TRADE,
  //     ACCOUNT_CODE.MARGIN,
  //     ACCOUNT_CODE.CONTRACT,
  //     // ACCOUNT_CODE.ISOLATED,
  //   ],
  //   checkCurrencyIsSupport: ({ categories, currency }) => {
  //     if (categories && categories[currency]) {
  //       return categories[currency].isPoolEnabled;
  //     }
  //     return true;
  //   },
  // },
];
const ACCOUNT_MAP = {};
each(ACCOUNT, (item) => {
  ACCOUNT_MAP[item.key] = item;
});
export { ACCOUNT_MAP };

// 自动出借状态
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
// 判断是否全仓或逐仓账户
export const checkIsMarginAccount =
  account => [ACCOUNT_CODE.MARGIN, ACCOUNT_CODE.ISOLATED].includes(account);

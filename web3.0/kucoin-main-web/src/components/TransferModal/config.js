/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { _t } from 'tools/i18n';
import { each } from 'lodash';
import { OptionLable, AccountBox, SymbolLabel } from './styles/index/style.js';
import useCountedFundingAccount from 'src/hooks/useCountedFundingAccount';
import { ReactComponent as ICTradeHF } from 'static/assets/trade_HF.svg';
import {
  ICFundAccountOutlined,
  ICTradingOutlined,
  ICTradeOutlined,
  ICMarginOutlined,
  ICFuturesOutlined,
} from '@kux/icons';

// const accountIconCommonStyle = {
//   display: 'inline-block',
//   width: 18,
//   height: 18,
//   lineHeight: '18px',
//   textAlign: 'center',
//   borderRadius: 3,
//   fontSize: 12,
//   color: '#fff',
//   marginRight: 8,
// };

// NOTE hf置灰
const AccountNameWithIcon = ({ label, iconText, bc, icon }) => (
  <OptionLable>
    {icon ? (
      <span className="accountIcon">{icon}</span>
    ) : (
      <div style={{ backgroundColor: bc }} className="accountNameWithIcon">
        {iconText}
      </div>
    )}

    {typeof label === 'function' ? label() : label}
  </OptionLable>
);

const MainAccountNameWithIcon = ({ lang }) => {
  const fundingAccountName = useCountedFundingAccount('main.account');
  return (
    <AccountNameWithIcon
      bc="#1ABB97"
      label={fundingAccountName}
      iconText={lang === 'zh_CN' ? '储' : 'Ma'}
      icon={<ICFundAccountOutlined size={18} />}
    />
  );
};

const SubAccountNameLabel = (accountType, account) => (
  <AccountBox>
    <div className="accountType">{accountType}</div>
    <div className="accountName">{account}</div>
  </AccountBox>
);

export const symbolLabelWrap = (symbol) => {
  const { base, quote } = symbol;
  return (
    <SymbolLabel>
      <div className="currency">
        <span>{base.currency}</span>
        <span>/{quote.currency}</span>
      </div>
      <div className="balance">
        <span>{base.availableBalance}</span>
        <span>/{quote.availableBalance}</span>
      </div>
    </SymbolLabel>
  );
};

export const ACCOUNT_CODE = {
  MAIN: 'MAIN', // 储蓄账户
  TRADE: 'TRADE', // 币币账户
  TRADE_HF: 'TRADE_HF', // 高频账户
  MARGIN: 'MARGIN', // 杠杆账户
  // MARGIN_V2: 'MARGIN_V2', // 杠杆高频账户
  ISOLATED: 'ISOLATED', // 逐仓杠杆账户
  // ISOLATED_V2: 'ISOLATED_V2', // 逐仓高频杠杆账户
  CONTRACT: 'CONTRACT', // 合约账户
  OPTION: 'OPTION', // 期权账户
  // POOL: 'POOL', // 矿池账户
};
// 账户之间
export const ACCOUNT = [
  {
    key: ACCOUNT_CODE.MAIN,
    color: '#58CCB6',
    label: () => _t('main.account'),
    labelComp: (lang) => <MainAccountNameWithIcon lang={lang} />,
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
    labelComp: (lang) => (
      <AccountNameWithIcon
        bc="#5A96E8"
        label={_t('trade.account')}
        iconText={lang === 'zh_CN' ? '币' : 'Tr'}
        icon={<ICTradingOutlined size={18} />}
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
    labelComp: (lang) => (
      <AccountNameWithIcon
        bc="#1ABB97"
        label={_t('highFrequency.account')}
        iconText={lang === 'zh_CN' ? '高' : 'HF'}
        icon={<ICTradeHF width={18} height={18} />}
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
    labelComp: (lang) => (
      <AccountNameWithIcon
        bc="#7B78E3"
        label={_t('crossMargin.account')}
        iconText={lang === 'zh_CN' ? '杠' : 'Mg'}
        icon={<ICMarginOutlined size={18} />}
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
    label: (symbol) =>
      symbol ? _t('transfer.dict.isolated', { symbol }) : _t('isolatedMargin.account'),
    labelComp: (lang) => (
      <AccountNameWithIcon
        bc="#7B78E3"
        label={_t('isolatedMargin.account')}
        iconText={lang === 'zh_CN' ? '逐' : 'Is'}
        icon={<ICMarginOutlined size={18} />}
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
    labelComp: (lang) => (
      <AccountNameWithIcon
        bc="#72948B"
        label={_t('margin.account')}
        iconText={lang === 'zh_CN' ? '合' : 'Fu'}
        icon={<ICFuturesOutlined size={18} />}
      />
    ),
    supportDirection: ['from', 'to'],
    supportFromAccounts: [
      ACCOUNT_CODE.MAIN,
      ACCOUNT_CODE.TRADE,
      ACCOUNT_CODE.MARGIN,
      ACCOUNT_CODE.ISOLATED,
      // ACCOUNT_CODE.POOL,
      ACCOUNT_CODE.TRADE_HF,
    ],
    supportToAccounts: [
      ACCOUNT_CODE.MAIN,
      ACCOUNT_CODE.TRADE,
      ACCOUNT_CODE.MARGIN,
      ACCOUNT_CODE.TRADE_HF,
      ACCOUNT_CODE.ISOLATED,
      // ACCOUNT_CODE.POOL,
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
  //   label: () => _t('pool.account'),
  //   labelComp: () => <AccountNameWithIcon bc="#8CB2C0" iconText="Px" label={_t('pool.account')} />,
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

// 增加 全仓高频 和 逐仓高频，用作划转记录表格的映射
const ACCOUNT_MAP_WITH_HF = {
  ...ACCOUNT_MAP,
  MARGIN_V2: {
    key: 'MARGIN_V2',
    label: () => _t('52e49971383e4000a6b2'),
  },
  ISOLATED_V2: {
    key: 'ISOLATED_V2',
    label: () => _t('a34084aa796d4000af37'),
  },
};
export { ACCOUNT_MAP, ACCOUNT_MAP_WITH_HF };
// 划转方向
export const SUB_ACCOUNT_DIRECTION = {
  toSub: 'OUT', // 母向子
  subTo: 'IN', // 子向母
};
// 母子账号之间, 子账号相关的key需严格以“SUB_”开头//_t('subaccount.subaccount')
// 子母账户之间
export const SUB_ACCOUNT = [
  {
    key: ACCOUNT_CODE.MAIN,
    color: '#58CCB6',
    label: (lang) => (
      <AccountNameWithIcon
        bc="#1ABB97"
        label={() => SubAccountNameLabel(_t('master.account'), _t('main.account'))}
        iconText={lang === 'zh_CN' ? '储' : 'Ma'}
        icon={<ICFundAccountOutlined size={18} />}
      />
    ),
    direct: SUB_ACCOUNT_DIRECTION.toSub,
    supportDirection: ['from', 'to'], // 支持的方向
    // 支持划入该账户的账户
    supportFromAccounts: [
      `SUB_${ACCOUNT_CODE.MAIN}`,
      `SUB_${ACCOUNT_CODE.TRADE}`,
      `SUB_${ACCOUNT_CODE.MARGIN}`,
      `SUB_${ACCOUNT_CODE.CONTRACT}`,
      `SUB_${ACCOUNT_CODE.ISOLATED}`,
      `SUB_${ACCOUNT_CODE.TRADE_HF}`,
    ],
    // 支持划出至的账户
    supportToAccounts: [
      `SUB_${ACCOUNT_CODE.MAIN}`,
      `SUB_${ACCOUNT_CODE.TRADE}`,
      `SUB_${ACCOUNT_CODE.MARGIN}`,
      `SUB_${ACCOUNT_CODE.CONTRACT}`,
      `SUB_${ACCOUNT_CODE.ISOLATED}`,
      `SUB_${ACCOUNT_CODE.TRADE_HF}`,
    ],
    checkCurrencyIsSupport: null,
  },
  {
    key: ACCOUNT_CODE.TRADE,
    color: '#5EAEFF',
    label: (lang) => (
      <AccountNameWithIcon
        bc="#5A96E8"
        label={() => SubAccountNameLabel(_t('master.account'), _t('trade.account'))}
        iconText={lang === 'zh_CN' ? '币' : 'Tr'}
        icon={<ICTradingOutlined size={18} />}
      />
    ),
    direct: SUB_ACCOUNT_DIRECTION.toSub,
    supportDirection: ['from', 'to'],
    supportFromAccounts: [
      `SUB_${ACCOUNT_CODE.MAIN}`,
      `SUB_${ACCOUNT_CODE.TRADE}`,
      `SUB_${ACCOUNT_CODE.MARGIN}`,
      `SUB_${ACCOUNT_CODE.CONTRACT}`,
      `SUB_${ACCOUNT_CODE.ISOLATED}`,
      `SUB_${ACCOUNT_CODE.TRADE_HF}`,
    ],
    supportToAccounts: [
      `SUB_${ACCOUNT_CODE.MAIN}`,
      `SUB_${ACCOUNT_CODE.TRADE}`,
      `SUB_${ACCOUNT_CODE.MARGIN}`,
      `SUB_${ACCOUNT_CODE.CONTRACT}`,
      `SUB_${ACCOUNT_CODE.ISOLATED}`,
      `SUB_${ACCOUNT_CODE.TRADE_HF}`,
    ],
    checkCurrencyIsSupport: null,
  },
  {
    key: ACCOUNT_CODE.TRADE_HF,
    color: '#58CCB6',
    label: (lang) => (
      <AccountNameWithIcon
        bc="#1ABB97"
        label={() => SubAccountNameLabel(_t('master.account'), _t('highFrequency.account'))}
        iconText={lang === 'zh_CN' ? '高' : 'HF'}
        icon={<ICTradeHF size={18} />}
      />
    ),
    direct: SUB_ACCOUNT_DIRECTION.toSub,
    supportDirection: ['from', 'to'], // 支持的方向
    // 支持划入该账户的账户
    supportFromAccounts: [
      `SUB_${ACCOUNT_CODE.MAIN}`,
      `SUB_${ACCOUNT_CODE.TRADE}`,
      `SUB_${ACCOUNT_CODE.MARGIN}`,
      `SUB_${ACCOUNT_CODE.ISOLATED}`,
      `SUB_${ACCOUNT_CODE.TRADE_HF}`,
      `SUB_${ACCOUNT_CODE.CONTRACT}`,
    ],
    // 支持划出至的账户
    supportToAccounts: [
      `SUB_${ACCOUNT_CODE.MAIN}`,
      `SUB_${ACCOUNT_CODE.TRADE}`,
      `SUB_${ACCOUNT_CODE.MARGIN}`,
      `SUB_${ACCOUNT_CODE.CONTRACT}`,
      `SUB_${ACCOUNT_CODE.ISOLATED}`,
      `SUB_${ACCOUNT_CODE.TRADE_HF}`,
    ],
    checkCurrencyIsSupport: null,
  },
  {
    key: ACCOUNT_CODE.MARGIN,
    color: '#7B78E3',
    label: (lang) => (
      <AccountNameWithIcon
        bc="#7B78E3"
        label={() => SubAccountNameLabel(_t('master.account'), _t('crossMargin.account'))}
        iconText={lang === 'zh_CN' ? '杠' : 'Mg'}
        icon={<ICMarginOutlined size={18} />}
      />
    ),
    autoRepayEnabledTip: () => _t('transfer.cross.autoRepay.enabled'),
    negativeBalanceTip: () => _t('transfer.negativeBalance.cross'),
    direct: SUB_ACCOUNT_DIRECTION.toSub,
    supportDirection: ['from', 'to'],
    supportFromAccounts: [
      `SUB_${ACCOUNT_CODE.MAIN}`,
      `SUB_${ACCOUNT_CODE.TRADE}`,
      `SUB_${ACCOUNT_CODE.MARGIN}`,
      `SUB_${ACCOUNT_CODE.CONTRACT}`,
      `SUB_${ACCOUNT_CODE.ISOLATED}`,
      `SUB_${ACCOUNT_CODE.TRADE_HF}`,
    ],
    supportToAccounts: [
      `SUB_${ACCOUNT_CODE.MAIN}`,
      `SUB_${ACCOUNT_CODE.TRADE}`,
      `SUB_${ACCOUNT_CODE.MARGIN}`,
      `SUB_${ACCOUNT_CODE.CONTRACT}`,
      `SUB_${ACCOUNT_CODE.ISOLATED}`,
      `SUB_${ACCOUNT_CODE.TRADE_HF}`,
    ],
    checkCurrencyIsSupport: ({ crossCurrenciesMap = {}, currency }) => {
      if (crossCurrenciesMap && JSON.stringify(crossCurrenciesMap) !== '{}') {
        return !!crossCurrenciesMap[currency];
      }
      return true;
    },
  },
  {
    key: ACCOUNT_CODE.ISOLATED,
    color: '#7B78E3',
    label: (lang) => (
      <AccountNameWithIcon
        bc="#7B78E3"
        label={() => SubAccountNameLabel(_t('master.account'), _t('isolatedMargin.account'))}
        iconText={lang === 'zh_CN' ? '逐' : 'Is'}
        icon={<ICMarginOutlined size={18} />}
      />
    ),
    direct: SUB_ACCOUNT_DIRECTION.toSub,
    supportDirection: ['from', 'to'],
    supportFromAccounts: [
      `SUB_${ACCOUNT_CODE.MAIN}`,
      `SUB_${ACCOUNT_CODE.TRADE}`,
      `SUB_${ACCOUNT_CODE.CONTRACT}`,
      `SUB_${ACCOUNT_CODE.MARGIN}`,
      `SUB_${ACCOUNT_CODE.ISOLATED}`,
      `SUB_${ACCOUNT_CODE.TRADE_HF}`,
    ],
    supportToAccounts: [
      `SUB_${ACCOUNT_CODE.MAIN}`,
      `SUB_${ACCOUNT_CODE.TRADE}`,
      `SUB_${ACCOUNT_CODE.CONTRACT}`,
      `SUB_${ACCOUNT_CODE.MARGIN}`,
      `SUB_${ACCOUNT_CODE.ISOLATED}`,
      `SUB_${ACCOUNT_CODE.TRADE_HF}`,
    ],
    checkCurrencyIsSupport: null,
  },
  {
    key: ACCOUNT_CODE.CONTRACT,
    color: '#ADDCD7',
    label: (lang) => (
      <AccountNameWithIcon
        bc="#72948B"
        label={() => SubAccountNameLabel(_t('master.account'), _t('margin.account'))}
        iconText={lang === 'zh_CN' ? '合' : 'Fu'}
        icon={<ICFuturesOutlined size={18} />}
      />
    ),
    direct: SUB_ACCOUNT_DIRECTION.toSub,
    supportDirection: ['from', 'to'],
    supportFromAccounts: [
      `SUB_${ACCOUNT_CODE.MAIN}`,
      `SUB_${ACCOUNT_CODE.TRADE}`,
      `SUB_${ACCOUNT_CODE.MARGIN}`,
      `SUB_${ACCOUNT_CODE.CONTRACT}`,
      `SUB_${ACCOUNT_CODE.ISOLATED}`,
      `SUB_${ACCOUNT_CODE.TRADE_HF}`,
    ],
    supportToAccounts: [
      `SUB_${ACCOUNT_CODE.MAIN}`,
      `SUB_${ACCOUNT_CODE.TRADE}`,
      `SUB_${ACCOUNT_CODE.MARGIN}`,
      `SUB_${ACCOUNT_CODE.CONTRACT}`,
      `SUB_${ACCOUNT_CODE.TRADE_HF}`,
      `SUB_${ACCOUNT_CODE.ISOLATED}`,
    ],
    checkCurrencyIsSupport: ({ categories, currency }) => {
      if (categories && categories[currency]) {
        return categories[currency].isContractEnabled;
      }
      return true;
    },
  },
  {
    key: `SUB_${ACCOUNT_CODE.MAIN}`,
    color: '#58CCB6',
    label: (lang) => (
      <AccountNameWithIcon
        bc="#1ABB97"
        label={() => SubAccountNameLabel(_t('subaccount.subaccount'), _t('main.account'))}
        iconText={lang === 'zh_CN' ? '储' : 'Ma'}
        icon={<ICFundAccountOutlined size={18} />}
      />
    ),
    direct: SUB_ACCOUNT_DIRECTION.subTo,
    supportDirection: ['from', 'to'], // 支持的方向
    // 支持划入该账户的账户
    supportFromAccounts: [
      ACCOUNT_CODE.MAIN,
      ACCOUNT_CODE.TRADE,
      ACCOUNT_CODE.MARGIN,
      ACCOUNT_CODE.CONTRACT,
      ACCOUNT_CODE.ISOLATED,
      ACCOUNT_CODE.TRADE_HF,
    ],
    // 支持划出至的账户
    supportToAccounts: [
      ACCOUNT_CODE.MAIN,
      ACCOUNT_CODE.TRADE,
      ACCOUNT_CODE.MARGIN,
      ACCOUNT_CODE.CONTRACT,
      ACCOUNT_CODE.ISOLATED,
      ACCOUNT_CODE.TRADE_HF,
    ],
    checkCurrencyIsSupport: null,
  },
  {
    key: `SUB_${ACCOUNT_CODE.TRADE}`,
    color: '#5EAEFF',
    label: (lang) => (
      <AccountNameWithIcon
        bc="#5A96E8"
        label={() => SubAccountNameLabel(_t('subaccount.subaccount'), _t('trade.account'))}
        iconText={lang === 'zh_CN' ? '币' : 'Tr'}
        icon={<ICTradingOutlined size={18} />}
      />
    ),
    direct: SUB_ACCOUNT_DIRECTION.subTo,
    supportDirection: ['from', 'to'],
    supportFromAccounts: [
      ACCOUNT_CODE.MAIN,
      ACCOUNT_CODE.TRADE,
      ACCOUNT_CODE.MARGIN,
      ACCOUNT_CODE.CONTRACT,
      ACCOUNT_CODE.ISOLATED,
      ACCOUNT_CODE.TRADE_HF,
    ],
    supportToAccounts: [
      ACCOUNT_CODE.MAIN,
      ACCOUNT_CODE.TRADE,
      ACCOUNT_CODE.MARGIN,
      ACCOUNT_CODE.CONTRACT,
      ACCOUNT_CODE.ISOLATED,
      ACCOUNT_CODE.TRADE_HF,
    ],
    checkCurrencyIsSupport: null,
  },
  {
    key: `SUB_${ACCOUNT_CODE.TRADE_HF}`,
    color: '#58CCB6',
    label: (lang) => (
      <AccountNameWithIcon
        bc="#1ABB97"
        label={() => SubAccountNameLabel(_t('subaccount.subaccount'), _t('highFrequency.account'))}
        iconText={lang === 'zh_CN' ? '高' : 'HF'}
        icon={<ICTradeHF size={18} />}
      />
    ),
    direct: SUB_ACCOUNT_DIRECTION.subTo,
    supportDirection: ['from', 'to'], // 支持的方向
    // 支持划入该账户的账户
    supportFromAccounts: [
      ACCOUNT_CODE.MAIN,
      ACCOUNT_CODE.TRADE,
      ACCOUNT_CODE.MARGIN,
      ACCOUNT_CODE.ISOLATED,
      ACCOUNT_CODE.TRADE_HF,
      ACCOUNT_CODE.CONTRACT,
    ],
    // 支持划出至的账户
    supportToAccounts: [
      ACCOUNT_CODE.MAIN,
      ACCOUNT_CODE.TRADE,
      ACCOUNT_CODE.MARGIN,
      ACCOUNT_CODE.CONTRACT,
      ACCOUNT_CODE.ISOLATED,
      ACCOUNT_CODE.TRADE_HF,
    ],
    checkCurrencyIsSupport: null,
  },
  {
    key: `SUB_${ACCOUNT_CODE.MARGIN}`,
    color: '#7B78E3',
    label: (lang) => (
      <AccountNameWithIcon
        bc="#7B78E3"
        label={() => SubAccountNameLabel(_t('subaccount.subaccount'), _t('crossMargin.account'))}
        iconText={lang === 'zh_CN' ? '杠' : 'Mg'}
        icon={<ICMarginOutlined size={18} />}
      />
    ),
    direct: SUB_ACCOUNT_DIRECTION.subTo,
    supportDirection: ['from', 'to'],
    supportFromAccounts: [
      ACCOUNT_CODE.MAIN,
      ACCOUNT_CODE.TRADE,
      ACCOUNT_CODE.MARGIN,
      ACCOUNT_CODE.CONTRACT,
      ACCOUNT_CODE.ISOLATED,
      ACCOUNT_CODE.TRADE_HF,
    ],
    supportToAccounts: [
      ACCOUNT_CODE.MAIN,
      ACCOUNT_CODE.TRADE,
      ACCOUNT_CODE.MARGIN,
      ACCOUNT_CODE.CONTRACT,
      ACCOUNT_CODE.ISOLATED,
      ACCOUNT_CODE.TRADE_HF,
    ],
    checkCurrencyIsSupport: ({ crossCurrenciesMap = {}, currency }) => {
      if (crossCurrenciesMap && JSON.stringify(crossCurrenciesMap) !== '{}') {
        return !!crossCurrenciesMap[currency];
      }
      return true;
    },
  },
  {
    key: `SUB_${ACCOUNT_CODE.ISOLATED}`,
    color: '#7B78E3',
    label: (lang) => (
      <AccountNameWithIcon
        bc="#7B78E3"
        label={() => SubAccountNameLabel(_t('subaccount.subaccount'), _t('isolatedMargin.account'))}
        iconText={lang === 'zh_CN' ? '逐' : 'Is'}
        icon={<ICMarginOutlined size={18} />}
      />
    ),
    autoRepayEnabledTip: (params = {}) => _t('transfer.isolated.autoRepay.enabled', params),
    negativeBalanceTip: (params = {}) => _t('transfer.negativeBalance.isolated', params),
    direct: SUB_ACCOUNT_DIRECTION.subTo,
    supportDirection: ['from', 'to'],
    supportFromAccounts: [
      ACCOUNT_CODE.MAIN,
      ACCOUNT_CODE.TRADE,
      ACCOUNT_CODE.MARGIN,
      ACCOUNT_CODE.CONTRACT,
      ACCOUNT_CODE.ISOLATED,
      ACCOUNT_CODE.TRADE_HF,
    ],
    supportToAccounts: [
      ACCOUNT_CODE.MAIN,
      ACCOUNT_CODE.TRADE,
      ACCOUNT_CODE.CONTRACT,
      ACCOUNT_CODE.MARGIN,
      ACCOUNT_CODE.ISOLATED,
      ACCOUNT_CODE.TRADE_HF,
    ],
    checkCurrencyIsSupport: null,
  },
  {
    key: `SUB_${ACCOUNT_CODE.CONTRACT}`,
    color: '#ADDCD7',
    label: (lang) => (
      <AccountNameWithIcon
        bc="#72948B"
        label={() => SubAccountNameLabel(_t('subaccount.subaccount'), _t('margin.account'))}
        iconText={lang === 'zh_CN' ? '合' : 'Fu'}
        icon={<ICFuturesOutlined size={18} />}
      />
    ),
    direct: SUB_ACCOUNT_DIRECTION.subTo,
    supportDirection: ['from', 'to'],
    supportFromAccounts: [
      ACCOUNT_CODE.MAIN,
      ACCOUNT_CODE.TRADE,
      ACCOUNT_CODE.MARGIN,
      ACCOUNT_CODE.CONTRACT,
      ACCOUNT_CODE.ISOLATED,
      ACCOUNT_CODE.TRADE_HF,
    ],
    supportToAccounts: [
      ACCOUNT_CODE.MAIN,
      ACCOUNT_CODE.TRADE,
      ACCOUNT_CODE.MARGIN,
      ACCOUNT_CODE.CONTRACT,
      ACCOUNT_CODE.TRADE_HF,
      ACCOUNT_CODE.ISOLATED,
    ],
    checkCurrencyIsSupport: ({ categories, currency }) => {
      if (categories && categories[currency]) {
        return categories[currency].isContractEnabled;
      }
      return true;
    },
  },
];
const SUB_ACCOUNT_MAP = {};
each(SUB_ACCOUNT, (item) => {
  SUB_ACCOUNT_MAP[item.key] = item;
});
export { SUB_ACCOUNT_MAP };
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
    },
    // 穿仓 todo: borden
    LIABILITY: {
      code: 'LIABILITY',
      isFrozenTrade: true,
      label: () => _t('status.negativeBalance'),
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
      operating: () => _t('marginGuide.transfer.go'),
    },
    BANKRUPTCY: {
      code: 'BANKRUPTCY',
      isFrozenTrade: true,
      isHideEarningRate: true,
      isHideLiabilityRate: true,
      isHideLiquidationPrice: true,
      label: () => _t('status.negativeBalance'),
      operating: () => _t('marginGuide.transfer.go'),
    },
    // 借入中
    IN_BORROW: {
      code: 'IN_BORROW',
      // isFrozenTrade: true,
    },
    // 还款中
    IN_REPAY: {
      code: 'IN_REPAY',
      // isFrozenTrade: true,
    },
    // 平仓中
    IN_LIQUIDATION: {
      code: 'IN_LIQUIDATION',
      isFrozenTrade: true,
      isHideEarningRate: true,
      isHideLiabilityRate: true,
      isHideLiquidationPrice: true,
      label: () => _t('margin.liquidating'),
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
export const checkIsMarginAccount = (account) =>
  [ACCOUNT_CODE.MARGIN, ACCOUNT_CODE.ISOLATED].includes(account);

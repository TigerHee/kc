/**
 * Owner: willen@kupotech.com
 */
import { _t } from 'tools/i18n';

export const SUB_ACCOUNT_MAP = {
  spot: 'Spot',
  margin: 'Margin',
  futures: 'Futures',
  option: 'Option',
};

export const nameMap = {
  [SUB_ACCOUNT_MAP.spot]: _t('nTx9HsL3ZWXZudv6E23QcK'),
  [SUB_ACCOUNT_MAP.margin]: _t('udP6AeMzbwGgMxwKHwWiuN'),
  [SUB_ACCOUNT_MAP.futures]: _t('39RMYLaRtYHsAF6MPqNcuq'),
  [SUB_ACCOUNT_MAP.option]: _t('6e9844564e1f4000afd0'),
};

export const displayName = (tradeTypes) => {
  try {
    // tradeTypes = ['Spot', 'Margin', 'Futures'];
    if (!tradeTypes || tradeTypes.length === 0) return '-';
    let arr = [],
      tmp = tradeTypes.sort().reverse();
    for (let i in tmp) {
      arr.push(nameMap[tmp[i]]);
    }
    return arr.join(', ');
  } catch (error) {
    return '-';
  }
};

// 账户类型相关
export const ACCOUNT_PERSONAL = 'PERSONAL'; // 我的账户
export const ACCOUNT_CUSTOMER = 'CUSTOMER'; // 客户账户
export const ACCOUNT_TYPE_LIST = [
  {
    label: _t('hbcJxbyF9zDzohwr7uUFhx'), // 我的账户
    value: ACCOUNT_PERSONAL,
  },
  {
    label: _t('jxRTRvgG25Ho4p2p7hJTDK'), // 客户账户
    value: ACCOUNT_CUSTOMER,
  },
];
// 普通子账号
export const SUB_ACCOUNT_TYPE_NORMAL = 0;
// 托管子账号
export const SUB_ACCOUNT_TYPE_HOSTED = 5;
// 第三方资金托管子账号
export const SUB_ACCOUNT_TYPE_OES = 9;

// 子账号类型 value 值映射
export const SUB_ACCOUNT_TYPE_VALUE_MAP = {
  [SUB_ACCOUNT_TYPE_NORMAL]: 'NORMAL',
  [SUB_ACCOUNT_TYPE_HOSTED]: 'HOSTED',
  [SUB_ACCOUNT_TYPE_OES]: 'OES',
};

export const TRADE_TYPE_MARGIN = SUB_ACCOUNT_MAP.margin;
export const TRADE_TYPE_FUTURE = SUB_ACCOUNT_MAP.futures;

// NORMAL(0, "普通子账号"),
// ROBOT(1, "交易机器人子账号"),
// Novice(2, "新手理财子账号"),
// FUTURE(3, "合约子账号"),
// MARGIN(4, "杠杆子账号"),

/**
 * Owner: solar@kupotech.com
 */

import { _t } from 'tools/i18n';
import { ReactComponent as MainIcon } from 'static/assets/account_type-main.svg';
import { ReactComponent as TradeIcon } from 'static/assets/account_type-trade.svg';
import { ReactComponent as TradeHfIcon } from 'static/assets/account_type-trade_hf.svg';
import { ReactComponent as ContractIcon } from 'static/assets/account_type-contract.svg';
import { ReactComponent as MarginIcon } from 'static/assets/account_type-margin.svg';

// 逐仓的前缀、用于标记是to逐仓，需要与icon字典中的逐仓key一致，否则拿不到翻译
export const ISOLATED = 'ISOLATED';

export const MARGIN = 'MARGIN';
export const MAIN = 'MAIN';
export const TRADE = 'TRADE';
export const TRADE_HF = 'TRADE_HF';
export const CONTRACT = 'CONTRACT';

// 账户翻译字典
export const ACCOUNT_NAME_MAP = {
  [TRADE]: _t('58k2sXox3eRrGBvkF6TJzD'), // 币币账户
  [MAIN]: _t('uajwVb4AnM5W852gqvyVbC'), // 储蓄(资金）账户
  [TRADE_HF]: _t('fL7UnR7fGBuBmBj9ptbD76'), // 高频账户
  [MARGIN]: _t('8MqwJHbrJh92qjGwKntvjZ'), // 杠杆账户
  [ISOLATED]: _t('oHtsQxWt65VEbUCX4hRYCW'), // 逐仓杠杆账户
  [CONTRACT]: _t('v16juTnZnLPwbxYmU3iZVY'), // 合约账户
  // POOL: 'POOL', // 矿池账户
};
// 账户翻译字典（后面会加上Account，用在成功提示）
export const ACCOUNT_WHOLE_NAME_MAP = {
  [TRADE]: _t('convert.order.account.trading'), // 币币账户
  [MAIN]: _t('convert.order.account.main'), // 储蓄(资金）账户
  [TRADE_HF]: _t('assets.account.pro'), // 高频账户
  [MARGIN]: _t('crossMargin.account'), // 杠杆账户
  [ISOLATED]: _t('isolatedMargin.account'), // 逐仓杠杆账户
  [CONTRACT]: _t('margin.account'), // 合约账户
};

// 账户icon字典
export const ACCOUNT_ICON_MAP = {
  MAIN: MainIcon, // 储蓄账户
  TRADE: TradeIcon, // 币币账户
  TRADE_HF: TradeHfIcon, // 高频账户
  MARGIN: MarginIcon, // 杠杆账户
  ISOLATED: MarginIcon, // 逐仓杠杆账户
  CONTRACT: ContractIcon, // 合约账户
  // POOL: 'POOL', // 矿池账户
};

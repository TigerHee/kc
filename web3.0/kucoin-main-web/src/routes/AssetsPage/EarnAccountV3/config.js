/**
 * Owner: chris@kupotech.com
 */
import { _t } from 'tools/i18n';
import _ from 'lodash';

export const STAKING = 'STAKING';
export const DEMAND = 'DEMAND';
export const POLKA_FUND = 'POLKA_FUND';
export const ETH2 = 'ETH2';
export const KCS_STAKING = 'KCS_STAKING';
export const SAVING = 'SAVING';
export const TIME = 'TIME';
export const MULTI_TIME = 'MULTI_TIME';
export const ACTIVITY = 'ACTIVITY';
export const DUAL = 'DUAL';
export const PROTECTIVE_EARN = 'PROTECTIVE_EARN';
export const SHARKFIN = 'SHARKFIN';
export const LOCKDROP = 'LOCKDROP';
export const NFT = 'NFT';
export const MINING_POOL = 'MINING_POOL';
export const SHARKFIN_BASE = 'SHARKFIN_BASE';
export const CANCELED = 'CANCELED';
export const TWIN_WIN = 'TWIN_WIN';
export const CONVERT_PLUS = 'CONVERT_PLUS';
export const FUTURE_PLUS = 'FUTURE_PLUS';
export const RANGE_BOUND = 'RANGE_BOUND';
export const DUAL_BOOSTER = 'DUAL_BOOSTER';
export const DUAL_EXTRA = 'DUAL_EXTRA';
export const DUAL_CLASSIC = 'DUAL_CLASSIC';
export const LENDING = 'LENDING';
export const BEARISH = 'Bearish';
export const BULLISH = 'Bullish';

export const typeTabs = [
  { value: 'SIMPLE_EARN', label: '简单赚币' },
  { value: 'STAKING', label: 'Staking' },
  { value: DUAL, label: '双币盈' },
  { value: SHARKFIN, label: '鲨鱼鳍' },
  { value: FUTURE_PLUS, label: '合约宝' },
  { value: PROTECTIVE_EARN, label: '雪球' },
  { value: CONVERT_PLUS, label: '闪兑Plus' },
  { value: TWIN_WIN, label: '双向赢' },
  { value: RANGE_BOUND, label: '区间宝' },
  { value: 'BK_FUND', label: _t('earn.account.type.polka') },
  { value: 'LOCKDROP', label: 'Burning Drop' },
];

export const STRUCT_PROD = [
  DUAL,
  DUAL_BOOSTER,
  DUAL_EXTRA,
  SHARKFIN,
  FUTURE_PLUS,
  PROTECTIVE_EARN,
  CONVERT_PLUS,
  TWIN_WIN,
  RANGE_BOUND,
  // SHARKFIN_BASE,
];

export const FIXED_PROD = [DEMAND, ACTIVITY, STAKING];

export const DUAL_PROD = [DUAL, DUAL_BOOSTER, DUAL_EXTRA];

export const STATUS_ENUM = {
  ONGOING: _t('ongoing'), // 赚币中
  LOCKED: _t('ongoing'), // 赚币中
  ABNORMAL: _t('ongoing'), // 赚币中
  SETTLING: _t('336atmdGrtr99UuDdN5m3n'), // 结算中
  PENDING: _t('mRPucBnwtmV8JWDET9baeu'), // 申购中
  CANCELED: _t('creditCard.cancel'), // 已取消

  UNSOLD: _t('etf.status.subscribe.failed'), //申购失败
  FINISHED: _t('margin.entrustList.entrustType.closed'), //已经结算
  AUTO_REDEEM: _t('wNoDGUrfFXL29H5TyGTW1u'), //赎回中
  REDEEMING: _t('wNoDGUrfFXL29H5TyGTW1u'), //赎回中
};

export const ButtonGroup = ['LOCKDROP', 'ETH2', 'NFT'];

export const HISTORICAL_TAB = [
  { value: 'SAMPLE_EARN', label: _t('cbgXeMERsW7TDBKUKrTJSX'), children: [DEMAND, ACTIVITY] },
  {
    value: 'STAKING',
    label: _t('earn.account.staking.title'),
    children: [STAKING, KCS_STAKING, ETH2],
  },
  { value: 'STRUCT', label: _t('w5VTBJiPEB23VKHSVdsiwe'), children: STRUCT_PROD },
  { value: LENDING, label: _t('jZXnzjU4q6RfcrN8hi8YuY'), children: LENDING },
];

export const HISTORICAL_MAP = _.keyBy(HISTORICAL_TAB, 'value');

export const START = '******';

export const EARN_ACCOUNT_TYPES = ['current', 'history'];

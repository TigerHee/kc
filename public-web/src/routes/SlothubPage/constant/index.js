/*
 * Owner: harry.lai@kupotech.com
 */

import { addLangToPath } from 'src/tools/i18n';
import { trackClick } from 'src/utils/ga';
import siteConfig from 'utils/siteConfig';

const GEMSLOT_EVENT_TYPE_PREFIX = 'GEMSLOT_EVENT_';

export const GEMSLOT_EVENT_TYPE = {
  openShareModal: `${GEMSLOT_EVENT_TYPE_PREFIX}openShareModal`,
};

export const BACKEND_PROJECT_STATUS_TYPE = {
  /** 未上线 */
  NOT_LAUNCHED: 0,
  /** 运行中 */
  RUNNING: 1,
  /**  活动结果统计中 */
  ACTIVITY_RESULT_CALC: 2,
  /** 项目已结束状态 */
  ENDED: 3,
};

export const BACKEND_TASK_TYPE = {
  /** kyc任务 */
  KYC_TASK: 1,
  /** 交易奖励任务 */
  TRADING_REWARD_TASK: 2,
  /** 充值任务 */
  DEPOSIT_TASK: 3,
  /** 学习任务 */
  LEARN_TASK: 4,
};

/** 活动进行态 */
export const PROJECT_ACTIVITY_STATUS = {
  activityOngoing: 'activityOngoing', // '活动进行中',
  activityEnded: 'activityEnded', // '活动已结束',
  activityNotStarted: 'activityNotStarted', //'活动未开始'
};

const { TRADE_HOST, KUCOIN_HOST } = siteConfig;

export const LINKS = {
  trade: (symbol = 'BTC-USDT') => ({
    webUrl: addLangToPath(`${TRADE_HOST}/${symbol}`),
    /** telegramMiniApp支持路由则有这个xkcRoute */
    xkcRoute: `${TRADE_HOST}/${symbol}`,
    appUrl: `/trade?symbol=${symbol}&goBackUrl=${encodeURIComponent(window.location.href)}`,
  }),
  buyCrypto: () => ({
    webUrl: addLangToPath(`${KUCOIN_HOST}/express`),
    appUrl: `/otc`,
  }),
  deposit: (currency = 'USDT') => ({
    webUrl: addLangToPath(`${KUCOIN_HOST}/assets/coin/${currency}`),
    /** telegramMiniApp不支持路由但是需要用webview打开则有这个xkcUrl */
    xkcUrl: `${KUCOIN_HOST}/assets/coin/${currency}`,
    appUrl: '/account/deposit',
  }),
  kyc: () => ({
    webUrl: addLangToPath(`${KUCOIN_HOST}/account/kyc`),
    xkcUrl: `${KUCOIN_HOST}/account/kyc`,
    appUrl: '/user/kyc',
  }),
  login: () => ({
    webUrl: addLangToPath(
      `${KUCOIN_HOST}/ucenter/signin?backUrl=${encodeURIComponent(window.location.href)}`,
    ),
    appUrl: '/user/kyc',
  }),
  learnAndEarn: (childPath) => ({
    webUrl: addLangToPath(`${KUCOIN_HOST}/learn-and-earn${childPath}`),
    xkcUrl: `${KUCOIN_HOST}/learn-and-earn${childPath}`,
    appUrl: `/link?url=${encodeURIComponent(
      KUCOIN_HOST + addLangToPath(`/learn-and-earn${childPath}`),
    )}`,
  }),
};

// 是否预约过
export const IS_RESERVED_KEY = 'IS_RESERVED_KEY';

// 静态倒计时
export const STATIC_CUTDOWN = [6, 6, 24, 39];

/** 是否展示过新人引导弹窗 */
export const IS_SHOW_ONBOARD_DIALOG_CACHE_KEY = 'isShowOnboardDialog';

// 神策点击埋点
export const SENSORS = {
  share: () => trackClick(['share', '1']), // 分享按钮点击
  rules: () => trackClick(['rules', '1']), // 规则按钮点击
  basicKyc: () => trackClick(['kyc', '1']), // 通用kyc任务去认证点击
  basicTrade: () => trackClick(['trade', '1']), // 通用交易任务去交易点击
  basicInvite: () => trackClick(['invite', '1']), // 去邀请点击，详情页通用
  enroll: (data) => trackClick(['enroll', '1'], data), // 报名
  deposit: (data) => trackClick(['deposit', '1'], data), // 充值，详情页通用
  trade: (data) => trackClick(['trade', '2'], data), // 交易，详情页通用
  reserve: (data) => trackClick(['reserve', '1'], data), // 预约
  details: (data) => trackClick(['details', '1'], data), // 详情
  historyExchange: () => trackClick(['exchange', '1']), // 通用签详情-兑换点击
  currencyExchange: (data) => trackClick(['exchange', '2'], data), // 币种签-兑换点击，详情页通用
  exchange: (data) => trackClick(['exchange', '3'], data), // 兑换按钮
  history: () => trackClick(['history', '1']), // 通用签详情点击
  inviteDetails: () => trackClick(['inviteDetails', '1']), // 邀请详情点击，详情页专用
  learn: () => trackClick(['learn', '1']), // 去学习，详情页专用
  kycAuth: () => trackClick(['kyc', '2']), // 通用kyc任务去认证点击
};

export const INVITE_ORIGIN_APPEND_PARAM = 'utm_source=gemslot';

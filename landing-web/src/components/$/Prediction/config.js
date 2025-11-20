/**
 * Owner: jesse.shao@kupotech.com
 */
import { M_KUCOIN_HOST, TRADE_HOST, KUMEX_HOST } from 'utils/siteConfig';
import { _t } from 'utils/lang';

export const THEME_COLOR = {
  primary: '#887EFF',
  surface: '#B9C9FE',
  background: '#C1D0FF',
  notStartHeaderBg: 'linear-gradient(91.45deg, #9E96FF 28.65%, #F0D0FF 100%)', // 未开始卡片头部背景色
  processHeaderBg: 'linear-gradient(91.45deg, #7390F9 0%, #B385FF 100%)',// 进行中卡片头部背景色
  endHeaderBg: 'linear-gradient(91.45deg, #EFF3FF 0%, #FAF7FF 100%)', // 已结束卡片头部背景色
  highLightBg: 'linear-gradient(90deg, #fff 0%, #f7e6ff 100%)', // 奖品高光半划线背景色
  notStartCountDownBg: '#E6E9FF', // 未开始倒计时的背景色
}

// 页面显示Key
export const PAGE_KEY = {
  HOME_PAGE: 'HOME_PAGE', // 首页
  RULE: 'RULE', // 规则
  MY_LIST: 'MY_LIST', // 激活明细
};

// 弹窗显示类型
export const DIALOG_TYPE = {
  EDUCATION: 'EDUCATION', // 教育弹窗
  SCHEDULE_TIP: 'SCHEDULE_TIP', // 竞猜tip弹窗
  TRADE_TIP: 'TRADE_TIP', // 交易量Tip弹窗
  UNLOCK_TIP: 'UNLOCK_TIP', // 解锁弹窗
  ACTIVITY_END: 'ACTIVITY_END', // 活动结束
};

export const DIALOG_TYPE_BLOCK_ID = {
  SCHEDULE_TIP: 'Closing', // 竞猜tip弹窗
  TRADE_TIP: 'Quiz', // 交易量Tip弹窗
};

// 去交易的跳转添加 @todo 暂时产品还没给链接
export const TRADE_URL = {
  SPOT: {
    appUrl: `/trade`,
    pcUrl: `${TRADE_HOST}/ETH-USDT`,
    h5Url: `${M_KUCOIN_HOST}/trade/ETH-USDT`,
  },
  FUTURE: {
    appUrl: `/kumex/trade`,
    pcUrl: `${KUMEX_HOST}/trade/ETHUSDTM`,
    h5Url: `${KUMEX_HOST}/lite/brawl/ETHUSDTM`,
  }
};

// 激活号码显示配置
export const NUMBER_DISPLAY = {
  big_award: {
    color: '#FFB547',
    label: () => _t('prediction.bigPrize'),
    amountDesc: () => _t('prediction.sendPrizeTime'),
    amountColor: 'rgba(0, 20, 42, 0.6)',
    bizType: 'big_award',
  },
  sunshine_award: {
    color: THEME_COLOR.primary,
    label: () => _t('prediction.luckyPrize'),
    amountDesc: () => _t('prediction.sendPrizeTime'),
    amountColor: 'rgba(0, 20, 42, 0.6)',
    bizType: 'sunshine_award',
  },
  no_reward: {
    color: '#00142A',
    bizType: 'big_award',
  },
};
// Tab
export const TABS = [
  {
    label: () => _t('prediction.all'),
    value: 'all',
  },
  {
    label: () => _t('prediction.gotPrize'),
    value: 'win',
  },
];
// 奖金类型
export const PRIZE_CODE = {
  'no_reward-USDT': {
    label: () => _t('prediction.currentBigPrize'),
    valueRender: v => `${v} USDT`,
  },
  'big_award-USDT': {
    label: () => _t('prediction.usdtPrize'),
    valueRender: v => `${v} USDT`,
  },
  'sunshine_award-USDT': {
    label: () => _t('prediction.usdtPrize'),
    valueRender: v => `${v} USDT`,
  },
  'sunshine_award-COUPON_FUTURE_TRAL': {
    label: () => _t('prediction.futureSend'),
    valueRender: a => _t('prediction.futurePrize', { a }),
  },
};


/**
 * Owner: jesse.shao@kupotech.com
 */
import siteCfg from 'utils/siteConfig';
import JsBridge from 'utils/jsBridge';
import { isArray, filter, find, includes, reject } from 'lodash';
import PROMOTION_GLOBAL_BANNER_BG from 'assets/promotionGlobal/page-bg.png';
import { ReactComponent as PROMOTION_GLOBAL_ARROW_BACK } from 'assets/promotionGlobal/arrow-back.svg';
import { ReactComponent as PROMOTION_GLOBAL_ARROW_RIGHT } from 'assets/promotionGlobal/arrow-right-new.svg';

export {
  getLocalBase,
  languages,
  localeMap,
  getPathByLang,
  DEFAULT_LANG,
  _BASE_,
} from './utils/langTools';

/**
 * 通过参数keys来获取可用的的语言配置
 * keys : Array
 *
 */
export const getLangsByKeys = (keys = []) => {
  let result = [];
  if (isArray(keys)) {
    result = filter(ALL_LANGS, (item) => keys.includes(item.key));
    return result;
  } else {
    return result;
  }
};

/**
 * 通过参数rejectKeys来获取排除不需要语言后的可语言配置
 * rejectKeys : Array 排除的语言
 *
 */
export const getLangsByRejectKeys = (rejectKeys = []) => {
  let result = [];
  if (isArray(rejectKeys)) {
    result = reject(ALL_LANGS, (item) => rejectKeys.includes(item.key));
    return result;
  } else {
    return ALL_LANGS;
  }
};

//全部可用的语言配置-对应的显示名称
export const _ALL_LANGS = [
  { key: 'en_US', label: 'English' },
  { key: 'ru_RU', label: 'Русский' },
  { key: 'ko_KR', label: '한국어' },
  { key: 'ja_JP', label: '日本語' },
  { key: 'pt_PT', label: 'Português' },
  // { key: 'zh_CN', label: '简体中文' },
  { key: 'nl_NL', label: 'Nederlands' },
  { key: 'zh_HK', label: '繁體中文' },
  { key: 'de_DE', label: 'Deutsch' },
  { key: 'fr_FR', label: 'Français' },
  { key: 'es_ES', label: 'Español' },
  { key: 'vi_VN', label: 'Tiếng Việt' },
  { key: 'tr_TR', label: 'Türkçe' },
  { key: 'it_IT', label: 'Italiano' },
  { key: 'ms_MY', label: 'Bahasa Melayu' },
  { key: 'id_ID', label: 'Bahasa Indonesia' },
  { key: 'hi_IN', label: 'हिन्दी' },
  { key: 'th_TH', label: 'ไทย' },
  { key: 'bn_BD', label: 'বাংলা' },
  { key: 'pl_PL', label: 'Polski' },
  { key: 'fil_PH', label: 'Filipino' },
  { key: 'ar_AE', label: 'العربية' }, // 添加阿拉伯语
  { key: 'ur_PK', label: 'اردو' }, //添加乌尔都语
  { key: 'uk_UA', label: 'Українська' }, //添加乌克兰语
];

// ALL_LANGS 使用window.__KC_LANGUAGES__.__ALL__全局变量
export const ALL_LANGS =
  window.__KC_LANGUAGES__?.__ALL__?.map((lang) => {
    const label = _ALL_LANGS.find((i) => i.key === lang)?.label || lang;
    return {
      key: lang,
      label,
    };
  }) || _ALL_LANGS;

// 之前支持，现在要求不支持的语言，为避免有保存子路径的用户出现404，做特殊处理
export const NOT_SUPPORT_LANG = ['zh_CN'];

// LocalStorage Prefix
export const storagePrefix = 'land_';

// 屏幕宽度低于1040为h5模式
export const MAX_WIDTH = 1040;

// 最大精度
export const maxPrecision = 8;

const apiHost = '/_api';
// const apiHost = _DEV_ ? 'http://localhost:2999/next-web/_api' : '/_api';
// const apiHost = _DEV_ ? 'http://10.100.33.148:2999/next-web/_api' : '/_api';
// const apiHost = _DEV_ ? 'http://v2.kucoin.net/_api' : '/_api';

// 跨域调用需要配置代理进行调试
const kumexHost = `${siteCfg.KUMEX_HOST}/_api`;
const mainHost = `${siteCfg.MAINSITE_HOST}/_api`;

export const v2ApiHosts = {
  CMS: apiHost,
  WEB: apiHost,
  MAINSITE_API_HOST: apiHost,
  KUMEX_API_HOST: kumexHost,
  MAIN_API_HOST: mainHost,
};

// 4周年庆主题页支持的语言
export const ANNIVERSARY_4TH_LANGS = getLangsByKeys([window._DEFAULT_LANG_]);

// 福利中心目前不支持乌尔都语和阿拉伯语
export const KU_REWARDS = getLangsByRejectKeys(['ar_AE', 'ar_001', 'ur_PK']);

//交易大赛语种支持：中文简体、中文繁体、英文、土耳其、德语，越南语言, 葡萄牙语,其余语种默认使用英语
export const API_KING = getLangsByKeys([
  'zh_HK',
  'en_US',
  'zh_CN',
  'tr_TR',
  'de_DE',
  'vi_VN',
  'pt_PT',
]);

const NO_UR = getLangsByRejectKeys(['ur_PK']);

/**
 * 账户邮箱验证 正则
 */
export const EMAIL_EXP =
  /(?:[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/; // eslint-disable-line
/**
 * telegram验证 正则
 */
export const TELEGRAM_EXP = /^[a-zA-Z0-9_]{5,32}$/;

/**
 * CMS 组件配置 router => [keys...]
 *  keys为不含语言的前缀部分
 */
export const CmsComponents = {
  /** 通用 */
  _: ['com.head'],
  '/guardian': [
    'com.landing.guardian.project',
    'com.landing.project.projects',
    'com.landing.project.orgs',
    'com.landing.guardian.livings',
    'com.landing.guardian.motivation',
    'com.landing.guardian.meaning',
    'com.guradian.faq',
    'com.guradian.vioce',
    'com.guradian.userguard.desc',
  ],
  combine: ['com.head'],
};

/**
 * 支持全语言包的路由，否则只允许中英文
 */
export const routeFullLanguages = [
  '/brand-broker',
  '/partner',
  '/newfortunestars',
  '/spotlight_r5/:id',
  '/trade-competition',
  '/guardian',
  '/community-collect',
  '/price-protect',
  '/kcs-game/game-center',
  '/kcs-game/one-coin/home',
  '/kcs-game/one-coin/detail',
  '/kcs-game/one-coin/disable',
  '/kcs-game/one-coin/join-success',
  '/kcs-game/one-coin/my-record',
  '/kcs-game/one-coin/carve-up',
  '/kcs-game/one-coin-web/home',
  '/kcs-game/one-coin-web/detail',
  '/kcs-game/one-coin-web/disable',
  '/kanaria_nft_launchpad',
  '/kcs-game/guardian-star/home',
  '/kcs-game/guardian-star/detail',
  '/kcs-game/guardian-star/backpack',
  '/kcs-game/guardian-star/astrolabe',
  '/kcs-game/guardian-star/success',
  '/kcs-game/guardian-star/wait-open',
  '/kcs-game/slot-machine/home',
  '/kcs-game/slot-machine/detail',
  '/invite-friend',
  '/register',
  '/assets/deposit-question', // 资产业务组：APP充值提现界面，右上角的FAQ入口
  '/assets/withdraw-question', // 经确认已有全部小语种翻译(资产业务组：APP充值提现界面，右上角的FAQ入口)
  '/sign-up-rewards-campaign',
  '/referral-super-lucky-draw',
  '/kucoin-asian-carnival-kok',
  '/sepa-lucky-draw',
  '/gembox',
  '/treasure-coin-carnival',
  '/turkey-summer-frenzy-tl',
  '/pakistan-campaign-trx',
  '/treasure-coin-carnival-r2',
  '/prediction', // 20220619 竞猜页面
  '/prediction/rule', // 20220619 竞猜规则
  '/prediction/detail', // 20220619 竞猜激活列表
  '/prediction/winner-list', // 20220619 竞猜本轮得奖用户
  '/promotions/:path', // 乐高
  '/promotions-preview/:path', // 乐高预览页
  '/nps/:path', // nps
  '/LearnToEarn', // 20220716 NFT有奖答题
  '/eth-merge', // 20220810 ETH Merge
  '/recall', // 20220811 用户召回
  '/kucoin-5th-anniversary',
  '/kucoin-5th-anniversary-event',
  '/kucoin-5th-anniversary-gem',
  '/kucoin-5th-anniversary-kcs-boost',
  '/kucoin-5th-anniversary-event-trading',
  '/lunc', // 20220810 ETH Merge
  '/crypto-cup', // 2022 数字世界杯
  '/crypto-cup-rules', // 2022 数字世界杯 规则
  '/security', //安全主题页面
  '/activity/:path', // 运营活动模板
  '/activity-preview/:path', // 运营活动模板预览
  '/hotspot-news', // 热点运营新闻详情
  '/invite', // 拉新裂变-被邀请人界面
  '/refer-friends-to-kucoin-and-win-free-travel', // 砍一刀 2023
  '/earn-crypto-rewards-by-referring', // 20230714 现金红包
  '/wealth-calender', // 财富日历
  '/wealth-calender/:id', // 财富日历
  '/fee_discount_coupons/:symbol', //现货抵扣券h5
];

/**
 * 支持特定语言包的路由
 */
export const routeMakeLanguages = {
  '/KuCoin-4th-anniversary': ANNIVERSARY_4TH_LANGS,
  '/promotion': ANNIVERSARY_4TH_LANGS,
  '/recall': NO_UR,
  '/invite-friend': NO_UR,
  '/gembox': NO_UR,
  '/KuRewards': KU_REWARDS, // 20230524 福利中心 不支持阿拉伯语和乌尔都语
  '/KuRewards/detail': KU_REWARDS, // 20230524 福利中心二级页面详情 不支持阿拉伯语和乌尔都语
  '/KuRewards/coupons': KU_REWARDS, // 20230524 福利中心二级页面奖券中心 不支持阿拉伯语和乌尔都语
};

// 不是自适应的路由
export const routeNotFlexible = ['/brand-broker'];

// PC下关闭路由的cms header
export const PcDisableCMSHeader = ['/choice/:id', '/error'];

// H5下关闭路由的cms header
export const H5DisableCMSHeader = ['/choice/:id'];

// showcase 活动状态
export const SHOWCASE_STATUS = {
  NOT_STARTED: 1, // 未开始，注意：未开始的活动是无法进入页面的，一般无需关注
  PROCESSING: 2, // 进行中
  END: 3, // 已结束
};

// 投票上币规则
export const VOTE_RULES = {
  en_US: `${siteCfg.KUCOIN_HOST}/support/900001714626`,
  zh_CN: `${siteCfg.KUCOIN_HOST}/support/900001714626`,
};

// 申请投票上币
export const APPLICATION_VOTE = {
  en_US:
    'https://docs.google.com/forms/d/e/1FAIpQLSfs49SNwNeM9US_h5ZxWtdnuF2SeunI_TngiYnDp3N--697_g/viewform',
  zh_CN:
    'https://docs.google.com/forms/d/e/1FAIpQLSfs49SNwNeM9US_h5ZxWtdnuF2SeunI_TngiYnDp3N--697_g/viewform',
};

// 什么是投票上币
export const QUESTDES_VOTE = {
  en_US: `${siteCfg.KUCOIN_HOST}/support/900001714606`,
  zh_CN: `${siteCfg.KUCOIN_HOST}/support/900001714606`,
};

// 活动开始状态 包含计票状态
export const BEGIN_STATUS = {
  NO_COUNT: 1, // 未计票
  COUNTING: 2, // 计票中
  COUNTED_NO_VOTE: 3, // 计票结束未开始投票
  VOTING: 4, // 投票中
  OTHER: 0, // 无效
};

export const SHOW_CASE_ICO =
  'https://assets.staticimg.com/cms/media/7AV75b9jzr9S8H3eNuOuoqj8PwdUjaDQGKGczGqTS.png';

// todo多租户
export const SHOW_CASE_OG_IMAGE = 'https://assets.staticimg.com/cms/kucoin/open_graph_en.jpg';

// 用于买卖盘深度合并的精度
export const maxDecimalPrecision = 10;

export const ActivityType = {
  RANK: 1, // 竞赛
  AIRDROP: 2, // 空投
  VOTE: 3, // 投票
  UNIVERSAL: 4, // 万能活动
  SPOTLIGHT: 8, // SPOTLIGHT抢购
  SPOTLIGHT2: 9, // SPOTLIGHT2预约抽签
  DISTRIBUTE: 12, // 代币分发活动
  SPOTLIGHT5: 13, // SPOTLIGHT5
  SPOTLIGHT6: 14, // SPOTLIGHT6
};

export const SpotlightActivityType = [
  ActivityType.SPOTLIGHT,
  ActivityType.SPOTLIGHT2,
  ActivityType.SPOTLIGHT5,
  ActivityType.SPOTLIGHT6,
];

export const ActivityStatus = {
  WAIT_START: 1,
  PROCESSING: 2,
  WAIT_REWARD: 3,
  OVER: 4,
};

// 3.15.0 低于该版本H5无法使用App注入登录
export const SUPPORT_COOKIE_LOGIN = '3.15.0';

// 3.34.0 低于该版本H5无法使用kcs game
export const SUPPORT_KCS_GAME = '3.34.0';

// 周年庆活动 ERROR CODE
export const WALLET_ERROR = '110022';
export const WALLET_INSUFFICIENT = '110021';
export const END = '110018';
export const SOLD_OUT = '110024';
export const BOUGHT = '110025';
export const NOT_OPEN = '110019';
export const NOT_LOGIN = '110006';

export const OPEN_ERROR_MODAL_KEY = [
  WALLET_ERROR,
  WALLET_INSUFFICIENT,
  END,
  SOLD_OUT,
  BOUGHT,
  NOT_OPEN,
  NOT_LOGIN,
];

// 双十二福袋埋点枚举
export const LUCKY_BAG_ANCHOR = {
  'LUCKY-BAG-5': 'box1',
  'LUCKY-BAG-6': 'box2',
  'LUCKY-BAG-7': 'box3',
  'LUCKY-BAG-8': 'box4',
};

// 接口缓存策略
export const commonInterfaceCache = 'commonInterfaceCache'; // 公共接口缓存key
export const commonInterfaceCacheExpireTime = 'commonInterfaceCacheExpireTime'; // 公共接口缓存过期时间key
export const activityUrl = ['/interestMaker'];
export const interfaceUrl = [
  '/cms/components',
  '/currency/transfer-currencies',
  '/currency/site/transfer-currencies',
  '/currency/rates',
  '/currency/prices',
  '/ucenter/user/security-methods',
  '/ucenter/user/locale',
  '/ucenter/languages',
  '/kucoin-config/web/international/config-list',
  '/ucenter/is-open',
  '/ucenter/country-codes',
];

// 需要语言子路径的域名。
export const LANG_DOMAIN = window._LANG_DOMAIN_;

// 存储storage中语言数据的key的前缀
export const KUCOIN_LANG_KEY = 'kucoinv2';

// 注册页面的TabKey类型 用于pc端注册弹窗
export const SIGN_TAB_KEY = {
  SIGN_EMAIL_TAB_KEY: 'sign.email.tab',
  SIGN_PHONE_TAB_KEY: 'sign.phone.tab',
};

// 使用socket的页面
export const wsPageList = [
  '/prediction',
  '/eth-merge',
  '/lunc',
  '/activity', // 运营活动模板
];
// 当前页面是否使用socket
export const checkPageIsUseWs = (url = '') => {
  // 校验当前页面是否使用socket
  const nowPageUrl = url || window.location.href || '';
  const _find = find(wsPageList, (item) => includes(nowPageUrl, item));
  return _find;
};

// NFT-答题界面类型
export const NFT_QUIZ_TYPES = {
  MAIN: 'main',
  HIS: 'history',
  LEARN: 'learn',
};

export const NFT_QUIZ_STATUS = {
  NOT_BEGIN: 0,
  CURRENT: 1,
  EXPIRED: 2,
};

// 支持RN发贴页的版本
export const SUPPORT_ADD_POST_RN_VERSION = '3.56.0';

// 币种宣传活动页面的设置 目前有 Lunc Eth-MErage
export const CURRENCY_PROMOTION_CONFIG = {
  HI_YUGA_LABS: {
    ThemeColor: '#09E6BD', // 主题颜色
    BackgroundOpacity: 'rgba(33, 195, 151, 0.06)', //
    CoinListItemBorderColor: '#09E6BD', // 主题边框颜色
    CoinListItemBorderBottomColor: 'rgba(9, 230, 189, 0.16)', // 币种列表item下边框颜色
    PageBgImg: PROMOTION_GLOBAL_BANNER_BG, // 背景图片
    PageBgColor: '#010f21',
    CommunityArrowIcon: PROMOTION_GLOBAL_ARROW_BACK, // 社区讨论ArrowIcon
    CoinArrowIcon: PROMOTION_GLOBAL_ARROW_RIGHT, // 币种ArrowIcon
  },
};

export const FINGERPRINT_URLS = [
  {
    url: '/campaign-center/activity/registration',
    event: 'lego-v1-join',
  },
  // 邀请助力1.0 平台助力
  {
    url: '/campaign-center/invitation-support/platform-init',
    event: 'invitation-platform-init',
  },
  // 邀请助力1.0 好友助力
  {
    url: '/campaign-center/invitation-support/user-assist',
    event: 'invitation-user-assist',
  },
  // 现金礼包 领取礼包
  {
    url: '/campaign-center/invitation-fission/obtain/award',
    event: 'invitation-fission-obtain',
  },
  {
    url: '/nps/survey/collection',
    event: 'nps-survey-collection',
  },
  {
    url: '/nps/survey/info',
    event: 'nps-survey-info',
  },
  // 福利中心接口 - 老客提现
  {
    url: '/platform-markting/v2/quest/withdraw/apply',
    event: 'ku-rewards-old-guest-withdraw',
  },
  // 福利中心接口 - 新客领取奖励
  {
    url: '/platform-reward/newcomer/user/prize/draw',
    event: 'ku-rewards-new-guest-prize-draw',
  },
  // 福利中心接口 - 新客提现
  {
    url: '/platform-reward/newcommer/user/withdraw/apply',
    event: 'ku-rewards-new-guest-withdraw',
  },
];

// 低于该版本H5无法使用app的设备指纹token
export const SUPPORT_APP_TOKEN = '3.66.0';

// WITHOUT_QUERY_PARAM:不应该出现在url-query参数中的参数。
export const WITHOUT_QUERY_PARAM = ['rcode', 'utm_source', 'utm_campaign', 'utm_medium'];

/**
 * 不需要进行同步语言子路由的url
 * 场景：
 * 例如乐高活动1.0和2.0里面 活动只支持中、英文这2中语言，
 * 但是用户在全站设置的泰语
 * 这种场景下，访问乐高活动页面，活动页面会显示基准语言（英语）
 * 实现逻辑（app/selectLang 同时设置donotChangeUser: true：不更新用户配置，只对当前页面生效）
 * dispatch({
        type: 'app/selectLang',
        payload: {
          lang: standardLang,
          donotChangeUser: true,
        },
      });
 * 但是由于getUserInfo action里面会自动获取用户的语言并同步语言子路径，导致这里会无限循环
 * 故新增一个路由配置，在getUserInfo里面使用
 */
export const doNotSyncLangPath = ['/activity/:path', '/promotions/:path'];

const getMainPort = () => {
  const initHost = window.location.host;
  let newKcHostCom = siteCfg.MAINSITE_HOST_COM || siteCfg.MAINSITE_HOST;
  if (!newKcHostCom) return initHost;
  try {
    const parsed = new URL(newKcHostCom);
    newKcHostCom = parsed?.host || initHost;
  } catch (e) {
    return initHost;
  }
  return newKcHostCom?.replace(/\.plus|\.work/g, '.com') || initHost;
};

// 域名动态处理
const DEFAULT_MAIN_PORT = getMainPort();
const DEFAULT_MAIN_HOST = `https://${DEFAULT_MAIN_PORT}`;

const getHost = (withHttp = true) => {
  const _host = window.location.host;
  let host = String(_host);
  // 无效值或者localhost，直接返回默认值
  if (!host || host.includes('localhost')) return withHttp ? DEFAULT_MAIN_HOST : DEFAULT_MAIN_PORT;
  if (!host.startsWith('https://')) {
    host = `https://${host}`;
  }
  return withHttp ? host : String(_host);
};

export const APP_HOST = getHost(true);

export const APP_HOST_NAME = getHost(false);

// 分享域名动态处理
const getShareHost = () => {
  const isInApp = JsBridge.isApp();
  return isInApp ? DEFAULT_MAIN_HOST : APP_HOST;
};

export const SHARE_APP_HOST = getShareHost();

const RTLLangs = ['ar_AE', 'ur_PK'];

export const isRTLLanguage = (lang) => RTLLangs.includes(lang);

// 语言地区合规： 地区对应的需要下掉的语言
export const RESTRICT_CODE_TO_LANG = {
  FR: 'fr_FR',
  AT: 'de_DE',
};

/** kc app 支持各种页面/功能/桥方法的版本  */
export const KC_APP_SUPPORT_VERSION = {
  /** 3.15.0 低于该版本H5无法使用App注入登录  */
  supportCookieLogin: '3.15.0',
  /**  低于该版本 jump方法桥 的原生页面 /market 链接不支持 symbol参数  */
  supportMarketUrlSymbolQuery: '3.18.0',
  /** 3.34.0 低于该版本H5无法使用kcs game */
  supportKcsGame: '3.34.0',
  /** 低于该版本 不支持v3 */
  supportV3: '3.42.0',
  /** 低于该版本 不支持多海报分享  */
  supportGallery: '3.45.0',
  /** 低于该版本 不支持新版本分享组件  */
  supportNewShare: '3.89.0',
  /** 低于该版本 不支持跳转到杠杆免息券详情页面 */
  supportJumpLeverLendDetail: '3.95.0',
  /** 低于该版本 不支持打开手机系统消息通知 */
  supportPhoneSystemPush: '3.95.0',
  /** 低于该版本 不支持 app updateHeader 新的特性 */
  supportUpdateHeader: '3.97.0',
  /** 低于该版本 不支持绑定telegram小程序 */
  supportBindTelAppVersion: '3.98.0',
  /** 低于该版本 不支持跳转到 /safe/thirdAccountSetting?fromSource=2 进行三方绑定  */
  supportJumpThirdAccountSetting: '3.100.0',
  /** 低于该版本 不支持 mint app */
  supportMintApp: '3.100.0',
  /** 低于该版本 不支持 saveShareImage 桥方法 */
  supportSaveShareImage: '3.106.0',
  /** 低于该版本 行情异动不支持展示设置入口  */
  supportMarketMovementSetting: '3.117.0',
  /** 低于该版本 不支持调用跳转生物识别登陆桥方法  */
  supportJumpCheckLoginPage: '3.130.0',
};

export const BASE_CURRENCY = window._BASE_CURRENCY_;

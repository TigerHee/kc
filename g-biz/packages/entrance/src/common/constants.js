/**
 * Owner: iron@kupotech.com
 */
export const PREFIX = '$entrance'; // 前缀
export const IP_BAN_CODE = '50003'; // IP 封禁错误码
export const CLEAR_USER_CODE = '500117'; // 清退用户登陆错误码
export const INVITATION_LIST_CODE = '500701'; // 用户注册不在邀请名单错误码
export const CAPTCHA_CODE = '40011';
export const TOKEN_INVALID_CODE = '280001';
export const MAIL_AUTHORIZE_EXPIRE_CODE = '500017'; // 邮件授权过期的code
export const MULTI_DEVICE_LIMIT = '500035'; // 场景异常码500035，需要弹窗让用户确认踢出
export const THIRD_PARTY_NO_BINDING = '500037'; // 三方账号登录后未绑定kc账号
export const THIRD_PARTY_SIMPLE_REGISTER = '500665'; // 三方账号未注册 kc 账号 & 能获取到邮箱信息
export const VALIDATE_ERROR = '40007'; // 验证码错误

export const UTM_RCODE_MAP = {
  thirdPartClient: 'utm_source',
  utmCampaign: 'utm_campaign',
  utmMedium: 'utm_medium',
  referralCode: 'rcode',
};

export const DEFAULT_TRACK_SRC = 'mainSet';

export const MAX_RCODE_EXPIRE = 15 * 24 * 60 * 60 * 1000;

export const LOCAL_RCODE_KEY = `${PREFIX}_rcode_expire_presist_key`;

export const NAMESPACE_MAPS = {
  LOGIN: '$entrance_signIn',
  SIGNUP: '$entrance_signUp',
  'FORGET_PWD': '$entrance_forgetPwd',
};

// 展示个人概览 - 行情入口
// ip 是英国
export const ACCOUNT_MARKET_SPM = 'compliance.account.market.1';
// 展示个人概览 - 行情 - 热门 tab 入口
// ip 是英国
export const ACCOUNT_MARKET_HOT_TAB_SPM = 'compliance.account.marketHotTab.1';
// 隐藏 kyc 跳转 “机构VIP专属福利，充值享VIP优惠，邀请好友共享VIP等级” 链接入口
// ip 是英国
export const KYC_BENIFIT_URL_SPM = 'compliance.kyc.benifitUrl.1';
// 注册页面 展示 “全球加密货币，印度的选择” 模块
// ip 是印度
export const SIGNUP_INDIA_REGISTRATION_SPM = 'compliance.signup.leftIndia.1';
// 注册页面 隐藏 “Today’s registration reward”
// ip 是英国
export const SIGNUP_REGISTRATION_REWARD_SPM = 'compliance.signup.hiddenMktContent.1';
// 注册页面 隐藏 “专业投资者选择”
// ip 是英国
export const SIGNUP_PREFERRED_PROFESSIONALS_SPM = 'compliance.signup.preferredProfessionals.1';
// 注册页面 隐藏 “全球顶级数字货币交易所”
// ip 是英国
export const SIGNUP_LEADING_CRYTO_CURRENCY_EXCHAGED_SPM =
  'compliance.signup.leadingCyptocurrencyExchange.1';
//  Nav 上福利中心的入口元素的展业规则
export const HEADER_MARKETING_SPM = 'compliance.header.marketingHeader.1';

/**
 * Owner: willen@kupotech.com
 */
import siteConfig from 'utils/siteConfig';

const { DOCS_HOST } = siteConfig;

// 通过站点获取对应的翻译
export const getSiteName = (site, t) => {
  switch (site) {
    case 'australia':
      return t('122f15eb20c94800a85a');
    case 'europe':
      return t('327afb2cd06c4800a436');
    case 'global':
      return t('e60f7f265df84800a4e3');
    case 'demo':
      return 'DEMO';
    default:
      return t('e60f7f265df84800a4e3');
  }
};

// 站点不一致，接口报错错误码
export const SITE_FORCE_REDIRECT = '308100';

// ("用户类型 1（普通用户） 2(内部账号）3(子账号） 4(测试账号) 5(返佣做市商) 6(项目方) 7(项目方做市商) 8(固定费率做市商)")
export const ACCOUNT_TYPE = {
  Normal: 1,
  Internal: 2,
  SubAccount: 3,
  Test: 4,
  Return: 5,
  Project: 6,
  ProjectReturn: 7,
  FixedRate: 8,
};

export const COMMON_FETCH_STATUS = {
  init: 1,
  fetching: 2,
  success: 3,
  error: 4,
};
// api相关 ----------------------------- start
export const apiTabMap = {
  trade: {
    name: 'margin.api',
    docs: 'margin.api.docs',
    text: 'margin.api.text',
    href: DOCS_HOST,
    host: '',
  },
  contract: {
    name: 'futures.api',
    docs: 'api.landingPage.seeAPI.futures',
    text: 'futures.api.text',
    href: [DOCS_HOST, '/futures'].join(''),
    host: '-',
    // host: 'http://localhost:2999/futures-web',
  },
};

export const SubAccountDisableApiKeys = ['API_EARN'];

export const authMapSensorKey = {
  API_SPOT: 'SpotTrade',
  API_MARGIN: 'MarginTrade',
  API_FUTURES: 'FuturesTrade',
  API_WITHDRAW: 'Withdraw',
};
// api相关 ----------------------------- end

// 展业相关
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

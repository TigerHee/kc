/**
 * Owner: sean.shi@kupotech.com
 * 前端多租户配置
 */
import merge from 'lodash/merge';
import addLangToPath from '@tools/addLangToPath';
import storage from '@utils/storage';
import siteConfig from '../common/siteConfig';

const currentLang = storage.getItem('kucoinv2_lang');

// 多租户默认配置 - 按页面或功能模块分类
const defaultConfig = {
  // 交易密码不可用跳转链接
  withdrawPathwordJumpUrl: addLangToPath('/account/security/forgetWP', currentLang),
  // 未收到验证码弹窗中帮助中心链接
  notReceiverHelpCenterUrl: '/support',
  emailUnavailableUrl: addLangToPath('/support/requests?ticket_form_id=2', currentLang),
};

// global 站配置
const KC = {
  ...defaultConfig,
};

// 土耳其站配置
const TR = merge({}, defaultConfig, {
  emailUnavailableUrl: addLangToPath('/support/requests?ticket_form_id=79', currentLang),
});

// 泰国站配置
const TH = merge({}, defaultConfig, {
  emailUnavailableUrl:
    currentLang === 'en_US'
      ? 'https://kucoin-th.zendesk.com/hc/en-us/requests/new?ticket_form_id=10199280700815'
      : 'https://kucoin-th.zendesk.com/hc/th/requests/new?ticket_form_id=10199280700815',
});

// claim 站配置
const CL = merge({}, defaultConfig, {
  // CL 站点跳转到客服，申领站没有部署客服系统，需要使用主站地址
  withdrawPathwordJumpUrl: addLangToPath(
    `${siteConfig?.KC_SITE_HOST}/support/requests?ticket_form_id=3`,
    currentLang,
  ),
  // 申领站没有部署客服系统，需要使用主站地址
  notReceiverHelpCenterUrl: addLangToPath(
    `${siteConfig?.KC_SITE_HOST}/support/requests?ticket_form_id=3`,
    currentLang,
  ),
  emailUnavailableUrl: addLangToPath(
    `${siteConfig?.KC_SITE_HOST}/support/requests?ticket_form_id=3`,
    currentLang,
  ),
});

// g-biz 用 KC 兜底
const tenant = window._BRAND_SITE_ || 'KC';
const tenantConfig =
  {
    KC,
    TR,
    TH,
    CL,
  }[tenant] || KC;

export { tenantConfig, tenant };

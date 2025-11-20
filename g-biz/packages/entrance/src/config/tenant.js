/**
 * Owner: tiger@kupotech.com
 * 前端多租户配置
 * 使用：
 * import { tenantConfig } from '@packages/entrance/src/config/tenant';
 */
import merge from 'lodash/merge';
import siteConfig from '../common/siteConfig';

// 多租户默认配置 - 按页面或功能模块分类
const defaultConfig = {
  common: {
    initLanguageCode: 'US', // 默认语言国家
    initCountryCode: '', // 默认区号
    isCountryCodeDisabled: false, // 选择区号是否禁用
    isCountryCodeUseInit: false, // 选择区号是否使用初始化
    emailNotAvailableUrl: '/support/requests', // 邮箱不可用链接
    isShowSlotBgImg: true, // 是否显示容器传入的左侧背景图
    isShowRemoteBgImg: false, // 是否显示多站点配置的图片
    // 未收到验证码弹窗中帮助中心链接
    notReceiverHelpCenterUrl: '/support',
    dismissPT: false, // 是否禁止葡萄牙语区号
    notPreFillMobileCodeCountries: () => [], // 禁止自动预填写手机区号的国家
    forbiddenCountriesForUse: () => [
      {
        code: 'CN',
        mobileCode: '86',
        aliasName: '其他', // 被屏蔽的国家，界面显示的别名
        aliasNameEN: 'Other',
      },
    ], // 禁止使用的国家列表
  },
  signin: {
    isCenter: false, // 登录表单是否居中
    isSupportUpdatePwdTipDialog: false, // 是否支持密码更新提醒
  },
  signup: {
    showGlobalSiteContent: true, // 是否展示注册左侧交易所涉及全球站点营销文案
    needCenter: false, // 注册页面是否是居中模式
    isShowRegisterImg: false, // 是否展示后台配置的 registerPageContextUrl
    agreementList: () => [], // 注册前必须签署的协议列表
    hasInvitationList: false, // 注册是否有邀请名单限制
    contactCustomer: '', // 注册失败联系客服链接
    isShowMktContent: true, // 创建成功是否展示notice
    supportHideAgreement: true, // 是否支持隐藏注册协议
    // agreementTerm: 使用条款 privacyUserTerm: 隐私条款 marketingMsgAuthoriseTerm: 营销消息发送授权 personalDataAuthoriseTerm: 个人数据使用授权
    // 使用数组的话，需要用函数包一下，否则结果不是互斥关系，会是合集
    termConfigList: () => ['agreementTerm', 'privacyUserTerm'], // 输入账号页面包含的协议名称
    termInitialChecked: true, // 输入账号页面包含的协议是否默认选中状态
    registerFlag: {}, // 注册开关，现在只有 AU/EU 站有
    showKycBenefits: false, // 是否展示kyc注册奖励，只有主站展示
    kycPath: '/account/kyc', // 注册完成 kyc 引导跳转路径
  },
  forgetPwd: {
    alertText: (_t) => _t('2wkSuTvU8hx8YEhy5RETMR'),
  },
};

// global 站配置
const KC = merge({}, defaultConfig, {
  common: {
    dismissPT: true, // 禁止葡萄牙语区号
    // 禁止自动预填写手机区号的国家：奥地利AT43
    notPreFillMobileCodeCountries: () => ['AT'],
  },
  signup: {
    showKycBenefits: true,
    kycPath: '/account/kyc/setup/country-of-issue', // 注册完成 kyc 引导跳转路径
  },
});

// 澳洲站配置
const AU = merge({}, defaultConfig, {
  common: {
    initLanguageCode: 'AU',
  },
  signup: {
    showGlobalSiteContent: false,
    needCenter: true,
    registerFlag: {
      marketingFlag: {
        // 开关和后端对接的值
        id: 1,
        // 开关名称 注册营销消息发送授权
        name: 'marketingFlag',
        // 协议是否默认勾选
        termInitialChecked: true,
        // 使用到的协议列表
        termInfo: () => [
          {
            // Platform Privacy Policy
            type: 'termId',
            value: '47185419968070',
          },
          {
            // Finlux Privacy Policy：
            type: 'termId',
            value: '47497300093812',
          },
          {
            // Echuca Privacy Policy
            type: 'termId',
            value: '47497300093925',
          },
        ],
        // 翻译 key
        i18nKey: 'au_kyc_agreement_checkbox_3',
      },
    },
  },
});

// 欧洲站配置
const EU = merge({}, defaultConfig, {
  common: {
    initLanguageCode: 'AT',
  },
  signup: {
    showGlobalSiteContent: false,
    needCenter: true,
    // EU 站先不开启注册开关
    registerFlag: {
      // marketingFlag: {
      //   // 开关和后端对接的值
      //   id: 1,
      //   // 开关名称
      //   name: 'marketingFlag',
      //   // 使用的是隐私协议
      //   termInfo: () => [
      //     {
      //       type: 'termCode',
      //       value: 'privacyUserTerm',
      //     },
      //   ],
      //   // 翻译 key
      //   i18nKey: '6271bc1867674000a09e',
      // },
    },
  },
});

// 土耳其站配置
const TR = merge({}, defaultConfig, {
  common: {
    initLanguageCode: 'TR',
    initCountryCode: '90',
    isCountryCodeDisabled: true, // 选择区号是否禁用
    isCountryCodeUseInit: true, // 选择区号是否使用初始化
    isShowSlotBgImg: false,
    isShowRemoteBgImg: true,
    forbiddenCountriesForUse: () => [],
  },
  signin: {
    isCenter: true,
    isSupportUpdatePwdTipDialog: true, // 是否支持密码更新提醒
  },
  signup: {
    showGlobalSiteContent: false,
    needCenter: true,
    isShowRegisterImg: true,
    agreementList: (lang, _t) => [
      {
        // 协议标识，用来埋点上报
        key: 'FrameworkAgreement',
        // 和后端对接的协议名称
        termCode: 'frameworkTerm',
        // 协议名称
        name: _t('37f2e066ddb54800a368'),
        // 同意勾选文案
        desc: _t('97fe6c7ac0e54800a60c'),
      },
      {
        key: 'PrivacyPolicy',
        termCode: 'privacyUserTerm',
        name: _t('2bf563040c854800a2ed'),
        desc: _t('477bfd4c60ff4800ac58'),
      },
      {
        key: 'RiskStatements',
        termCode: 'riskDisclosureTerm',
        name: _t('5d3ad7a839ce4800a349'),
        desc: _t('55e457fe270d4800a993'),
      },
    ],
    isShowMktContent: false,
    supportHideAgreement: false,
    termConfigList: () => [
      'marketingMsgAuthoriseTerm',
      'personalDataAuthoriseTerm',
      'cookieTerm',
      'biologocalDataAuthroiseTerm',
    ],
    termInitialChecked: false,
  },
});

// 泰国站配置
const TH = merge({}, defaultConfig, {
  common: {
    initLanguageCode: 'TH',
    emailNotAvailableUrl: 'https://kucoin-th.zendesk.com/hc/th/requests/new',
    isShowSlotBgImg: false,
    isShowRemoteBgImg: true,
    forbiddenCountriesForUse: () => [],
  },
  signin: {
    isCenter: true,
  },
  signup: {
    showGlobalSiteContent: false,
    needCenter: true,
    isShowRegisterImg: true,
    hasInvitationList: true,
    contactCustomer: 'https://kucoin-th.zendesk.com/hc/th/requests/new',
    isShowMktContent: false,
    supportHideAgreement: false,
    termConfigList: () => ['agreementTerm', 'privacyUserTerm'],
    termInitialChecked: false,
  },
});

// claim 站配置
const CL = merge({}, defaultConfig, {
  common: {
    // 申领站使用主站的域名
    notReceiverHelpCenterUrl: `${siteConfig?.KC_SITE_HOST}/support/requests?ticket_form_id=3`,
    // 申领站使用主站的域名
    emailNotAvailableUrl: `${siteConfig?.KC_SITE_HOST}/support/requests?ticket_form_id=3`,
  },
  forgetPwd: {
    alertText: (_t) => _t('f92f2481d7c74000aab5'),
  },
});

// g-biz 用 KC 兜底
const tenant = window._BRAND_SITE_;
const tenantConfig =
  {
    KC,
    TR,
    TH,
    CL,
    AU,
    EU,
  }[tenant] || KC;

export { tenantConfig, tenant };

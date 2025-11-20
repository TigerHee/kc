/**
 * Owner: sean.shi@kupotech.com
 */
// 多租户默认配置
import merge from 'lodash-es/merge';
import { getSiteConfig, bootConfig } from 'kc-next/boot';

// 多租户默认配置 - 按页面或功能模块分类
const defaultConfig = () =>
  ({
    common: {
      initLanguageCode: 'US' as string, // 默认语言国家
      initCountryCode: '' as string, // 默认区号
      isCountryCodeDisabled: false as boolean, // 选择区号是否禁用
      isCountryCodeUseInit: false as boolean, // 选择区号是否使用初始化
      emailNotAvailableUrl: '/support/requests' as string, // 邮箱不可用链接
      isShowSlotBgImg: true as boolean, // 是否显示容器传入的左侧背景图
      isShowRemoteBgImg: false as boolean, // 是否显示多站点配置的图片
      // 未收到验证码弹窗中帮助中心链接
      notReceiverHelpCenterUrl: '/support' as string,
      // app 客服机器人路径
      appBotPath: '/support/app/help' as string,
      dismissPT: false as boolean, // 是否禁止葡萄牙语区号
      notPreFillMobileCodeCountries: () => [] as string[], // 禁止自动预填写手机区号的国家
      forbiddenCountriesForUse: () =>
        [
          {
            code: 'CN',
            mobileCode: '86',
            aliasName: '其他', // 被屏蔽的国家，界面显示的别名
            aliasNameEN: 'Other',
          },
        ] as Array<{ code: string; mobileCode: string; aliasName: string; aliasNameEN: string }>, // 禁止使用的国家列表
    },
    signin: {
      isCenter: false as boolean, // 登录表单是否居中
      isSupportUpdatePwdTipDialog: false as boolean, // 是否支持密码更新提醒
    },
    signup: {
      showGlobalSiteContent: true as boolean, // 是否展示注册左侧交易所涉及全球站点营销文案
      needCenter: false, // 注册页面是否是居中模式
      isShowRegisterImg: false as boolean, // 是否展示后台配置的 registerPageContextUrl
      agreementList: () => [] as Array<{ key: string; termCode: string; name: string; desc: string }>, // 注册前必须签署的协议列表
      hasInvitationList: false as boolean, // 注册是否有邀请名单限制
      contactCustomer: '' as string, // 注册失败联系客服链接
      isShowMktContent: true as boolean, // 创建成功是否展示notice
      signupDefaultDisabled: false as boolean,
      supportHideAgreement: true as boolean, // 是否支持隐藏注册协议
      registerFlag: null as {
        marketingFlag: {
          id: string;
          name: string;
          termInitialChecked: boolean;
          termInfo: () => Array<{
            // 协议变量 key
            key?: string;
            // 是 termId 还是 termCode
            type: 'termId' | 'termCode';
            // 值
            value: string;
          }>;
          i18nKey: string;
        };
      } | null,
      // agreementTerm: 使用条款 privacyUserTerm: 隐私条款 marketingMsgAuthoriseTerm: 营销消息发送授权 personalDataAuthoriseTerm: 个人数据使用授权
      // 使用数组的话，需要用函数包一下，否则结果不是互斥关系，会是合集
      termConfigList: () => ['agreementTermAndPrivacyNotice'] as string[], // 输入账号页面包含的协议名称
      termInitialChecked: true as boolean, // 输入账号页面包含的协议是否默认选中状态
      showKycBenefits: false as boolean, // 是否展示kyc注册奖励，只有主站展示
      kycPath: '/account/kyc' as string, // 注册完成 kyc 引导跳转路径
      termTipInfo: {
        // 协议提示弹窗内容
        i18nKey: '2810dd8a31414800ad3e' as string,
      },
    },
    forgetPwd: {
      hideCustomer: false,
      alertText: (_t: (key: string) => string) => _t('499a3770275e4800a9f0'),
    },
  } as const);

// global 站配置
const KC: () => ReturnType<typeof defaultConfig> = () =>
  merge({}, defaultConfig(), {
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
const AU: () => ReturnType<typeof defaultConfig> = () =>
  merge({}, defaultConfig(), {
    common: {
      initLanguageCode: 'AU',
    },
    signup: {
      showGlobalSiteContent: false,
      needCenter: true,
      supportMarketingFlag: true,
      termInitialChecked: false,
      registerFlag: {
        marketingFlag: {
          // 开关和后端对接的值
          id: 1,
          // 开关名称 注册营销消息发送授权
          name: 'marketingFlag',
          // 协议是否默认勾选
          termInitialChecked: false,
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
      termTipInfo: {
        // 协议提示弹窗内容
        i18nKey: 'a4eaed8649134800adf6' as string,
      },
    },
  });

// 欧洲站配置
const EU: () => ReturnType<typeof defaultConfig> = () =>
  merge({}, defaultConfig(), {
    common: {
      initLanguageCode: 'AT',
    },
    signup: {
      showGlobalSiteContent: false,
      needCenter: true,
      supportMarketingFlag: true,
      termInitialChecked: false,
      registerFlag: {
        marketingFlag: {
          // 开关和后端对接的值
          id: 1,
          // 开关名称 注册营销消息发送授权
          name: 'marketingFlag',
          // 协议是否默认勾选
          termInitialChecked: false,
          // 使用到的协议列表
          termInfo: () => [
            {
              key: '',
              // Platform Privacy Policy
              type: 'termCode',
              value: 'privacyUserTerm',
            },
          ],
          // 翻译 key
          i18nKey: '7f7f82fa0a3f4800a54b',
        },
      },
      termTipInfo: {
        // 协议提示弹窗内容
        i18nKey: 'a4eaed8649134800adf6' as string,
      },
    },
  });

// 土耳其站配置
const TR: () => ReturnType<typeof defaultConfig> = () =>
  merge({}, defaultConfig(), {
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
      signupDefaultDisabled: true,
      agreementList: (_t: (key: string) => string) => [
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
const TH: () => ReturnType<typeof defaultConfig> = () =>
  merge({}, defaultConfig(), {
    common: {
      initLanguageCode: 'TH',
      emailNotAvailableUrl: 'https://kucoin-th.zendesk.com/hc/th/requests/new',
      isShowSlotBgImg: false,
      isShowRemoteBgImg: true,
      appBotPath: '/support' as string,
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
      termInitialChecked: false,
    },
  });

// claim 站配置
const CL: () => ReturnType<typeof defaultConfig> = () =>
  merge({}, defaultConfig(), {
    common: {
      // 申领站使用主站的域名
      notReceiverHelpCenterUrl: `${getSiteConfig()?.KC_SITE_HOST}/support/requests?ticket_form_id=3`,
      // 申领站使用主站的域名
      emailNotAvailableUrl: `${getSiteConfig()?.KC_SITE_HOST}/support/requests?ticket_form_id=3`,
    },
    forgetPwd: {
      hideCustomer: true,
      alertText: (_t: (key: string) => string) => _t('f92f2481d7c74000aab5'),
    },
  });

const tenantConfigs = {
  KC,
  TR,
  TH,
  CL,
  AU,
  EU,
} as const;

export const getTenantConfig = () => {
  return tenantConfigs[bootConfig._BRAND_SITE_ as keyof typeof tenantConfigs]() || KC();
};

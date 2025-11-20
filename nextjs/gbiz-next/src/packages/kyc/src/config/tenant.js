/**
 * Owner: tiger@kupotech.com
 * 前端多租户配置
 * 使用：
 * import { tenantConfig } from 'packages/kyc/src/config/tenant';
 */
import merge from 'lodash/merge';
import { getSiteConfig } from 'kc-next/boot';

const siteConfig = getSiteConfig();
const { KUCOIN_HOST } = siteConfig;

const defaultConfig = {
  kyc1: {
    isNeedTurkeyExtInfo: false, // 是否需要录入TR相关的额外信息
    fixedCountry: '', // 固定只能选择某个国家
    privacyUrl: `${KUCOIN_HOST}/announcement/en-kyc-user-identity-authentication-statement`, // 使用者身分驗證聲明
    identityNumberLabel: (_t) => _t('vUL5xxCuLejygiJbjzabJT'), // 证件号码 intl key
  },
  compliance: {
    isShowStepBar: true, // 是否展示步骤进度条
    nfcExplainUrl: '', // NFC 支持说明链接
    af_key_liveness_completed: '', // 活体完成 AppsFlyer 事件
    af_key_submitted: '', // 流程提交完成 AppsFlyer 事件
  },
};

// global 站配置
const KC = merge({}, defaultConfig);

// 土耳其站配置
const TR = merge({}, defaultConfig, {
  kyc1: {
    isNeedTurkeyExtInfo: true,
    fixedCountry: 'TR',
    privacyUrl: `${KUCOIN_HOST}/support/47497300094074`,
    identityNumberLabel: (_t) => _t('4878bc912a794000a409'),
  },
});

// 泰国站配置
const TH = merge({}, defaultConfig, {
  compliance: {
    isShowStepBar: false,
    nfcExplainUrl:
      'https://kucoin-th.zendesk.com/hc/articles/12468720300943-The-Main-Uses-of-NFC-in-KYC',
    af_key_liveness_completed: 'th_liveness_completed_appsflyer', // 活体完成 AppsFlyer 事件
    af_key_submitted: 'th_kyc_submitted_appsflyer', // 流程提交完成 AppsFlyer 事件
  },
});

// 澳洲站配置
const AU = merge({}, defaultConfig);

// 欧洲站配置
const EU = merge({}, defaultConfig);

// g-biz 用 KC 兜底
const tenant = window._BRAND_SITE_;
const tenantConfig =
  {
    KC,
    TR,
    TH,
    AU,
    EU,
  }[tenant] || KC;

export { tenantConfig, tenant };

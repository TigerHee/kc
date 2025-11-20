import { currencyArray } from 'gbiz-next/metadata';
import { find, includes } from 'lodash-es';

// 最大精度
export const maxPrecision = 8;

// SEO Meta Configuration
export const SEO_META_CONFIG = [];

// 全局消息
export const message = {
  top: 120,
  duration: 4.5,
};

export const notification = {
  top: 100,
  duration: 4,
};

export const config = {
  v2ApiHosts: {
    CMS: '/_api',
    WEB: '/_api',
  },
};

// zendesk 语言列表key
export const zElanguages = {
  ar_AE: 'ar',
  bn_BD: 'bn',
  de_DE: 'de',
  en_US: 'en-us',
  es_ES: 'es',
  fil_PH: 'fil',
  fr_FR: 'fr',
  hi_IN: 'hi',
  it_IT: 'it',
  ja_JP: 'ja',
  ko_KR: 'ko-kr',
  id_ID: 'id-id',
  ms_MY: 'ms-my',
  nl_NL: 'nl',
  pl_PL: 'pl',
  pt_PT: 'pt',
  ru_RU: 'ru',
  th_TH: 'th',
  tr_TR: 'tr',
  vi_VN: 'vi',
  zh_CN: 'zh-cn',
  zh_HK: 'zh-tw',
};

/**
 * CMS 组件配置 router => [keys...]
 *  keys为不含语言的前缀部分
 */
export const CmsComponents = {
  /** 通用 */
  _: ['cms.common'],
  /** 首页 */
  '/': ['com.index.body.bottom'],
  combine: [
    'com.head',
    'com.header.logo',
    'com.newheader.logo',
    'com.newFooter.links',
    'com.newFooter.copyright',
    'com.indexbanner.news',
    'com.header.collaps',
    'com.header.nav.left',
    'com.header.nav.right',
    'com.header.navuser.left',
    'com.menu.before.faq',
    'com.footer.links',
    'com.footer.socials',
    'com.copyright',
  ],
  // ucenter: 需求来源-注册页
  '/ucenter': ['com.seo.land.tradingbot', 'com.seo.land.c2c', 'com.community'],
};
// 不使用socket的页面
export const noWsPageList = ['/ucenter', '/restrict'];

// 当前页面是否使用socket
export const nowPageUseWs = (url = '') => {
  // 校验当前页面是否使用socket
  const nowPageUrl = url || window.location.href || '';
  const _find = find(noWsPageList, (item) => includes(nowPageUrl, item));
  return !_find;
};

export const clickGaName = 'eleClickCollectionV1';
export const siteidGaName = 'kucoinWeb';
// 设备指纹埋点接口
export const FINGERPRINT_URLS = [
  { url: '/otc/order/buy', event: 'otc-buy' },
  { url: '/otc/order/sell', event: 'otc-sell' },
  { url: '/otc/order/pay-money', event: 'otc-pay-mark' },
  { url: '/otc/order/pay-coin', event: 'otc-pay' },
  { url: '/payment/withdraw/apply', event: 'withdrawal' },
  { url: '/welfare/web/receive2phone', event: 'redpack-receive' },
  { url: '/welfare/web/receive2code', event: 'redpack-receive' },
  { url: '/ucenter/user/phone/update', event: 'change-phone' },
  { url: '/ucenter/v2/user/phone', event: 'set-phone-v2' },
  { url: '/ucenter/v2/user/email', event: 'set-email-v2' },
  { url: '/ucenter/v2/user/email/update', event: 'change-email-v2' },
  { url: '/ucenter/v2/user/withdraw-password', event: 'set-trade-pwd-v2' },
  { url: '/ucenter/v2/user/withdraw-password/update', event: 'change-trade-pwd-v2' },
  { url: '/ucenter/v2/user/google2fa', event: 'set-2fa-v2' },
  { url: '/ucenter/v2/user/google2fa/update', event: 'change-2fa-v2' },
  { url: '/ucenter/v2/user/password/update', event: 'change-login-pwd-v2' },
  { url: '/ucenter/v2/user/email/unbind', event: 'unbind-email-v2' },
  { url: '/ucenter/v2/user/phone/unbind', event: 'unbind-phone-v2' },
  { url: '/ucenter/v2/user/phone/update', event: 'change-phone-v2' },
  { url: '/ucenter/user/email/update', event: 'change-email' },
  { url: '/ucenter/user/withdraw-password/update', event: 'change-trade-pwd' },
  { url: '/ucenter/user/google2fa/update', event: 'change-2fa' },
  { url: '/ucenter/user/password/update', event: 'change-login-pwd' },
  { url: '/deposit/v1/recharge/creditcard/prerecharge', event: 'otc-bank-deposit' },
  { url: '/ucenter/login-verify', event: 'login-verify' },
  { url: '/ucenter/rebind-phone/apply', event: 'rebind-phone' },
  { url: '/ucenter/g2fa/apply', event: 'reset-g2fa' },
  { url: '/ucenter/reset-trade-password/apply', event: 'reset-trade-password' },
  { url: '/validation-email/email/verify', event: 'validation-email-verify' },
  { url: '/ucenter/sub/api-key/add', event: 'create-sub-api' },
  { url: '/ucenter/sub/api-key/update', event: 'update-sub-api' },
  { url: '/cyber-truck-vault/sub/api-key/delete/:id', event: 'delete-sub-api', method: 'post' },
  { url: '/ucenter/sub/user/reset-password', event: 'sub-user-reset-pwd' },
  { url: '/ucenter/sub/user/reset-2fa', event: 'sub-user-reset-2fa' },
  { url: '/ucenter/sub/user/reset-trading-password', event: 'sub-user-reset-trading-pwd' },
  { url: '/ucenter/v2/sub/user/create', event: 'create-sub-user' },
  { url: '/ucenter/aggregate-login', event: 'login' },
  { url: '/payment/inner/withdraw/apply', event: 'inner-withdrawal' },
  { url: '/market-operation/invitation/v2/mystery/obtain', event: 'toc-mystery-obtain' },
  { url: '/market-operation/invitation/exchange/prize', event: 'toc-prize-exchange' },
  { url: '/payment-api/pmtapi/v1/payin_order/risk/detect', event: 'otc-bank-risk-check' },
  { url: '/payment-api/pmtapi/v1/payin_order/create', event: 'otc-bank-deposit' },
  { url: '/payment-api/pmtapi/v2/payin_order/create', event: 'otc-bank-deposit-v2' },
  { url: '/payment-api/pmtapi/v2/card/attach', event: 'fiat-deposit-add-card' },
  { url: '/payment-api/api/v1/user/create_payout_account', event: 'pay-fiat-bind-account' },
  { url: '/payment-api/api/v2/user/payout_account/delete', event: 'pay-fiat-delete-account' },
  { url: '/payment-api/api/v3/create_payout_transaction', event: 'pay-fiat-withdraw' },
  { url: '/ucenter/user/email/unbind', event: 'unbind-email' },
  { url: '/ucenter/user/phone/unbind', event: 'unbind-phone' },
  { url: '/payment/withdraw-address/add', event: 'withdraw-address' },
  { url: '/otc/ad/online-edit', event: 'otc-ad-online-edit' },
  { url: '/otc/ad/buy/putUp', event: 'otc-ad-buy-putup' },
  { url: '/otc/ad/sell/putUp', event: 'otc-ad-sell-putup' },
  { url: '/otc/ad/publish', event: 'otc-ad-publish' },
  { url: '/payment/withdraw-address/delete', event: 'delete-withdraw-address' },
  { url: '/payment/withdraw-address/batch-add', event: 'batch-add-withdraw-address' },
  { url: '/cyber-truck-vault/v2/api-key', event: 'create-api' },
  { url: '/cyber-truck-vault/v2/api-key/verify', event: 'verify-api' },
  { url: '/cyber-truck-vault/v2/api-key/update', event: 'update-api' },
  { url: '/cyber-truck-vault/api-key/delete/:id', event: 'delete-api', method: 'post' },
  { url: '/ucenter/v2/sub/api-key/add', event: 'create-sub-api' },
  { url: '/cyber-truck-vault/v2/sub/api-key/update', event: 'update-sub-api' },
  { url: '/payment/deposit-address/get', event: 'query-deposit-address' },
  { url: '/pmtapi/v2/instruments/wallets/attach', event: 'payment-instruments-attach' },
  { url: '/pmtapi/v2/instruments/batch-update', event: 'payment-instruments-batch-update' },
  { url: '/pool-staking/v3/locks', event: 'account-finance-buy' },
  { url: '/novice-zone/v2/novice/open/blind/box', event: 'market_mystery_box' },
  { url: '/payment/inner-withdraw-contract/batch-add', event: 'inner-withdraw-addFav' },
  { url: '/payment/inner-withdraw-contract/batch-delete', event: 'inner-withdraw-delFav' },
  { url: '/payment/innerTransfer/getUserInfoByAccount', event: 'innerTransfer-getUserInfo' },
  { url: '/payment/withdraw/info-confirm', event: 'withdraw-info-confirm' },
  { url: '/validation-email/email/risk-check', event: 'validation-risk-check' },
  { url: '/validation-email/email/resend', event: 'validation-email-resend' },
  { url: '/auth-code', event: 'oauth-auth-code', isGatewayOauth: true },
  { url: '/_oauth/v2/auth-code', event: 'oauth-auth-code-v2', isGatewayOauth: true },
  {
    url: '/_api/risk-validation-center/v1/security/validation/combine',
    event: 'risk-validation-center',
  },
  { url: '/user-biz-front/v2/freeze-user', event: 'freeze-user' },
  {
    url: '/ucenter/send-validation-code',
    event: 'send-validation-code',
  },
  {
    url: '/ucenter/bind-phone/code',
    event: 'bind-phone-code',
  },
  {
    url: '/ucenter/bind-email/code',
    event: 'bind-email-code',
  },
  { url: '/ucenter/external-binding', event: 'external-binding' },
  { url: '/ucenter/external-unbinding', event: 'external-unbinding' },
  { url: '/kyc/web/kyc/ng-primary/update', event: 'ng-primary-update' },
  { url: '/kyc/web/kyc/channel', event: 'kyc-channel' },
  { url: '/kyc/web/kyc/verify-risk/check', event: 'verify-risk-check' },
  { url: '/kyc/web/kyc/ng/finish', event: 'kyc-ng-finish' },
  {
    url: '/ucenter/sign-up-validation',
    event: 'sign-up-validation',
  },
  {
    url: '/kyc/web/kyc/data/createStandard',
    event: 'createStandard',
  },
  {
    url: '/kyc/web/compliance/thailand/advance/choose',
    event: 'thailand-advance-choose',
  },
  {
    url: '/ucenter/v2/user/safe-words',
    event: 'account-safe-words',
  },
  {
    url: '/ucenter/user/password',
    event: 'set-new-password',
  },
  {
    url: '/kyc/web/kyc/compliance/create',
    event: 'createComplianceStandard',
  },
  {
    url: '/risk-validation-center/v1/security/center/score',
    event: 'getSecurityScore',
  },
  {
    url: '/risk-validation-center/v1/security/center/cache-score',
    event: 'getSecurityCacheScore',
  },
  {
    url: '/ucenter/v2/passkey/register',
    event: 'passkeyRegister',
  },
  {
    url: '/ucenter/v2/passkey/delete',
    event: 'passkeyDelete',
  },
  {
    url: '/ucenter/user/rebind/apply',
    event: 'rebindApply',
  },
  {
    url: '/ucenter/v2/passkey/register',
    event: 'passkeyRegisterV2',
  },
  {
    url: '/ucenter/v2/passkey/delete',
    event: 'passkeyDeleteV2',
  },
];

export const restrictedStatusList = [1, 2];

// 需要单独处理tdk的路由
// 需要单独处理tdk,不采用tdk系统配置的路由。
export const TDK_EXCLUDE_PATH = [/\/price\/.*/, /\/news\/{0,1}.*/, /\/support\/.+/];

// 需要替换tdk的二级路由
export const TDK_REPLACE_PATH: RegExp[] = [];

// 支持 advance 人脸的版本
export const SUPPORT_ADVANCE_FACE = '3.117.0';

// 3.61.0 低于该版本H5无法使用app的人脸识别
export const SUPPORT_BAIDU_FACE = '3.61.0';

// 低于该版本H5无法使用app的设备指纹token
export const SUPPORT_APP_TOKEN = '3.66.0';

// 登录、注册、重置成功默认跳转到的路由地址
export const DEFAULT_JUMP_ROUTE = '/account';
export const DEFAULT_JUMP_ROUTE_CL = '/claim';

// kyc 错误code记录
export const ERROR_CODE = [
  '710000',
  '710001',
  '710002',
  '710003',
  '710004',
  '710005',
  '710006',
  '710007',
  '710008',
];
// 被清退用户-进行受限制操作时-弹出的提示文案
export const restrictedInfo = {
  zh_CN: '由于国家地区限制，该功能已暂停服务',
  en_US: 'Sorry, the service is temporarily unavailable in your country/region.',
};

export const CURRENCY_CHARS = currencyArray;

export const COMMON_GBIZ_TRANS_NS_LIST = [
  'common',
  'header',
  'footer',
  'siteRedirect',
  'notice-center',
  'userRestricted',
  'entrance',
  'kyc',
  'trade',
  'verification',
];

export const authMapSensorKey = {
  API_SPOT: 'SpotTrade',
  API_MARGIN: 'MarginTrade',
  API_FUTURES: 'FuturesTrade',
  API_WITHDRAW: 'Withdraw',
};

export const SubAccountDisableApiKeys = ['API_EARN'];

// localStorage 前缀
export const storagePrefix = 'ucenter-web';

// WITHOUT_QUERY_PARAM:不应该出现在 url-query 参数中的参数。
export const WITHOUT_QUERY_PARAM = ['rcode', 'utm_source', 'utm_campaign', 'utm_medium'];

export const RTL_LANGUAGES = ['ar_AE', 'ur_PK'];

// X-Platform 有透传这个 header，值是 default / mobile / app
export const X_PLATFORM_HEADER = 'x-platform';

// 审核不通过原因
export const FAIL_REASON = {
  patternError: {
    zh_CN: '格式不正确',
    zh_HK: '格式不正確',
    en_US: 'Incorrect format',
    key: 'incorrect.format.warn',
  },
  notSameError: {
    zh_CN: '与证件不符',
    zh_HK: '與證件不符',
    en_US: 'Does not match with the identity document',
    key: 'credentials.error.warn',
  },
  numberError: {
    zh_CN: '查无此号码',
    zh_HK: '查無此號碼',
    en_US: 'Non-existent phone number',
    key: 'check.noNumber.warn',
  },
  addressError: {
    zh_CN: '查无此地址',
    zh_HK: '查無此地址',
    en_US: 'Non-existent address',
    key: 'check.noAddress.warn',
  },
  companyError: {
    zh_CN: '查无此公司',
    zh_HK: '查無此公司',
    en_US: 'Non-existent company name',
    key: 'check.noCompany.warn',
  },
  certificateError: {
    zh_CN: '证件已过期',
    zh_HK: '證件已過期',
    en_US: 'Identity document expired ',
    key: 'credential.expire.warn',
  },
  imageError: {
    zh_CN: '图片不清晰/反光/被遮挡/不完整',
    zh_HK: '圖片不清晰/反光/被遮擋/不完整',
    en_US: 'Picture is not clear/covered/incomplete',
    key: 'picture.dim.warn',
  },
  cardTypeError: {
    zh_CN: '证件类型不正确',
    zh_HK: '證件類型不正確',
    en_US: 'Wrong credential type',
    key: 'identity.type.warn',
  },
  cardImageError: {
    zh_CN: '证件图片不符合要求',
    zh_HK: '證件圖片不符合要求',
    en_US: 'Wrong photograph uploaded',
    key: 'identity.type.error',
  },
  InfoInadequateError: {
    zh_CN: '信息不完善',
    zh_HK: '信息不完善',
    en_US: 'Inadequate information',
    key: 'info.notPerfect.warn',
  },
  cardPhotoWrongError: {
    zh_CN: '人脸与证件照不一致',
    zh_HK: '人臉與證件照不一致',
    en_US: 'The face does not match with that on the identity document',
    key: 'face.different.warn',
  },
  identityError: {
    zh_CN: '不通过',
    zh_HK: '不通過',
    en_US: '',
    key: 'no.pass',
  },
  faceError: {
    zh_CN: '不通过',
    zh_HK: '不通過',
    en_US: '',
    key: 'no.pass',
  },
  /* 新增的审核不通过原因 */
  abbreviationlastNamerror: {
    zh_CN: '您输入的姓是缩写，与证件不符，请写全称',
    zh_HK: '您輸入的姓是縮寫，與證件不符，請寫全稱',
    en_US: 'Does not support abbreviations, please enter your full last name',
    key: 'identity.lastName.error',
  },
  symbolNameError: {
    zh_CN: '不能带有任何符号',
    zh_HK: '不能帶有任何符號',
    en_US: 'Please do not enter any symbol',
    key: 'identity.name.symbolError',
  },
  noSurnameError: {
    zh_CN: '没有姓就不用填写此项',
    zh_HK: '沒有姓就不用填寫此項',
    en_US: 'Not required if there is no last name ',
    key: 'identity.name.noSurname',
  },
  abbreviationfirstNamerror: {
    zh_CN: '您输入的名是缩写，与证件不符，请写全称',
    zh_HK: '您輸入的名是縮寫，與證件不符，請寫全稱',
    en_US: 'Do not support abbreviations, please enter your full first name ',
    key: 'identity.firstName.abbrevError',
  },
  notmatchCountryError: {
    zh_CN: '您选择的国家与证件上的国家不符合',
    zh_HK: '您選擇的國家與證件上的國家不符合',
    en_US: 'Selected country does not match with your identity document',
    key: 'identity.country.nomatch',
  },
  CertTypeError: {
    zh_CN: '您选择的证件类型与上传的证件照不符合',
    zh_HK: '您選擇的證件類型與上傳的證件照不符合',
    en_US: 'Selected identity document type does not match with your identity document',
    key: 'identity.type.notmatch',
  },
  CertificateNumberNotCompleteError: {
    zh_CN: '您输入的证件号不完整',
    zh_HK: '您輸入的證件號不完整',
    en_US: 'Identity document number incomplete',
    key: 'identity.idnumber.notcomplete',
  },
  CertificateNumberNotMatchError: {
    zh_CN: '您输入的证件号码与上传的证件不一致',
    zh_HK: '您輸入的證件號碼與上傳的證件不一致',
    en_US: 'Identity document number does not match with your identity document',
    key: 'identity.idnumber.notmatch',
  },
  passportWholePageError: {
    zh_CN: '护照未展示需要的上下两页',
    zh_HK: '護照未展示需要的上下兩頁',
    en_US: 'Please open the passport and take pictures on the cover page and the information page',
    key: 'identity.display.incomplete',
  },
  ResidentPermitError: {
    zh_CN: '您提供的是居住许可，不符合要求，请您提供身份证，驾照或者护照',
    zh_HK: '您提供的是居住許可，不符合要求，請您提供身份證，駕照或者護照',
    en_US:
      'Resident Permit is not supported, please upload your ID Card,' +
      ' Driving License or Passport ',
    key: 'identity.type.ResidentPermitError',
  },
  ElectionCardPermitError: {
    zh_CN: '您提供的是选举卡，不符合要求，请您提供身份证，驾照或者护照',
    zh_HK: '您提供的是選舉卡，不符合要求，請您提供身份證，駕照或者護照',
    en_US:
      'Election Card is not supported, please upload your ID Card,' +
      ' Driving License or Passport ',
    key: 'identity.type.ElectionCardError',
  },
  TaxCardPermitError: {
    zh_CN: '您提供的是税卡，不符合要求，请您提供身份证，驾照或者护照',
    zh_HK: '您提供的是稅卡，不符合要求，請您提供身份證，駕照或者護照',
    en_US: 'Tax Card is not supported, please upload your ID Card, Driving License or Passport ',
    key: 'identity.type.TaxCardError',
  },
  PermitedCardsError: {
    zh_CN: '只有驾驶执照，护照，证件身份证才符合要求',
    zh_HK: '只有駕駛執照，護照，證件身份證才符合要求',
    en_US: 'Only supports ID Card, Driving License or Passport',
    key: 'identity.type.matchWitch',
  },
  CertificateUnrecognizedError: {
    zh_CN: '证件无法识别信息（证件磨损严重）',
    zh_HK: '證件無法識別信息（證件磨損嚴重）',
    en_US: 'Cannot recognize the information on the identity document',
    key: 'identity.info.unrecognized',
  },
  reUploadPicError: {
    zh_CN: '图片无法加载',
    zh_HK: '圖片無法加載',
    en_US: 'Fail to load the picture, please upload again ',
    key: 'identity.info.cantOpen',
  },
  ageError: {
    zh_CN: '未成年不符合要求',
    zh_HK: '未成年不符合要求',
    en_US: 'Age below 18',
    key: 'identity.age.error',
  },
  NoMsgInPagerError: {
    zh_CN: '纸条上没写日期/签名/code',
    zh_HK: '紙條上沒寫日期/簽名/code',
    en_US: "There's no date/hand-written signature/dynamic code on the note",
    key: 'identity.info.noHandWritting',
  },
  printedSignError: {
    zh_CN: '签名是打印的请手写',
    zh_HK: '簽名是打印的請手寫',
    en_US: 'The signature is printed, please write the signature by yourself',
    key: 'identity.type.noPrinted',
  },
  OcclusionError: {
    zh_CN: '手持遮挡人脸',
    zh_HK: '手持遮擋人臉',
    en_US: 'Identity document covered your face',
    key: 'identity.info.occlusionError',
  },
  printVersinError: {
    zh_CN: '手持证件不是原件',
    zh_HK: '手持證件不是原件',
    en_US: 'Identity document should be the original one',
    key: 'identity.type.noOriginal',
  },
  fabricationCertError: {
    zh_CN: '疑似伪造证件',
    zh_HK: '疑似偽造證件',
    en_US: 'Suspected fabrication of the identity document',
    key: 'identity.type.FakeError',
  },
  photoshoppedCertError: {
    zh_CN: '疑似P图',
    zh_HK: '疑似P圖',
    en_US: 'Suspected to be photoshopped',
    key: 'identity.type.photoshoppedError',
  },
  otherError: { zh_CN: '其他', zh_HK: '其他', en_US: 'Other', key: 'identity.other' },
  directorError: { zh_CN: '查无此人', en_US: 'user unknown', zh_HK: '查無此人' },
  // 新增
  requireError: {
    zh_CN: '很抱歉，根据我们的机构KYC 要求，您的机构KYC 未能通过',
    zh_HK: '很抱歉，根據我們的機構KYC 要求，您的機構KYC 未能通過',
    en_US: 'Your institutional KYC cannot be approved as per our institutional KYC requirements',
    key: 'g9HFC3kz24vUHmyhxzpaET',
  },
  notSameCompanyError: {
    zh_CN: '公司名不正确，请填入与注册证书上一致的公司名',
    zh_HK: '公司名不正確，請填入與註冊證書上一致的公司名',
    en_US: 'The company name is incorrect, please enter name which matches with the certificate',
    key: 'uViZmzLuZHNgRiXMry2eWy',
  },
  companyCodeError: {
    zh_CN: '公司编码不正确，请填入与注册证书上一致的公司编码',
    zh_HK: '公司編碼不正確，請填入與註冊證書上一致的公司編碼',
    en_US:
      'The registration number is incorrect, please enter number which matches with the certificate',
    key: 'fyNVZYsC5KeFskvACHr7Bv',
  },
  companyDateError: {
    zh_CN: '公司注册日期不正确，请填入与注册证书上一致的注册日期',
    zh_HK: '公司註冊日期不正確，請填入與註冊證書上一致的註冊日期',
    en_US:
      'The registration date is incorrect, please enter date which matches with the certificate',
    key: 'bsgYDWJwYyVQUrNF8y2eG9',
  },
  companyCertificateError: {
    zh_CN: '请上传一张手持公司注册证书的照片，确保人脸和证书清晰可见',
    zh_HK: '請上傳一張手持公司註冊證書的照片，確保人臉和證書清晰可見',
    en_US: 'Please upload a selfie of you holding the company registration certificate',
    key: 'x2WBLSSZ7nHaVFsELQXbq6',
  },
  companyLinkError: {
    zh_CN: '请上传验证公司注册的政府网站链接',
    zh_HK: '請上傳驗證公司註冊的政府網站鏈接',
    en_US: 'Please upload the Government verify link',
    key: 'ps4FyHrWAfDB6scJrUWjxz',
  },
  requireApplicantInfoError: {
    zh_CN: '请填入申请人姓名，职位并上传在职证书',
    zh_HK: '請填入申請人姓名，職位並上傳在職證書',
    en_US:
      "Please enter the applicant's name, working position and upload a working position certificate",
    key: 'ijEBAVeJGcuJAk7NBuPpFr',
  },
  identityExpirationError: {
    zh_CN: '证件上无有效期信息，请提供显示有效期信息的证件（可接受身份证，驾照和护照）',
    zh_HK: '證件上無有效期信息，請提供顯示有效期信息的證件（可接受身份證，駕照和護照）',
    en_US:
      'No expiration date on the document, please upload one which shows expiration date (ID, Driver license and Passport are accepted)',
    key: 'h17qVPLTpkm9p8Nte8RR9S',
  },
  identityCopyError: {
    zh_CN: '请提供证件原件，不接受打印件、复印件',
    zh_HK: '請提供證件原件，不接受打印件、複印件',
    en_US:
      'Please provide the original copy of the identity document, printed version is not accepted ',
    key: '8fdRTn1qfviTRWAdSUUVaQ',
  },
  documentSignError: {
    zh_CN: '请在文件上附上手写的签名',
    zh_HK: '請在文件上附上手寫的簽名',
    en_US: 'Please sign by hand on the document ',
    key: 'k9i5LULa69bSEnchXaeon2',
  },
  documentBlurryError: {
    zh_CN: '证件照模糊，请重新上传',
    zh_HK: '證件照模糊，請重新上傳',
    en_US: 'Document is blurry, please upload a clear one',
    key: 'uoe8T9iyrBzdknRUWTWgtB',
  },
  authorizeAttachmentRequiredError: {
    zh_CN: '若公司有董事会，请提交董事会决议文件；若公司是独董，请提交授权书文件',
    zh_HK: '若公司有董事會，請提交董事會決議文件；若公司是獨董，請提交授權書文件',
    en_US:
      'If the company is equipped with a board of directors, the Corporate Board Resolution is required; Otherwise, Power of Attorney is required',
    key: 'ebp1xU9LQgnwtsuKGrmk9i',
  },
  shareholdersRequiredError: {
    zh_CN: '请上传公司的股东名单/股份结构',
    zh_HK: '請上傳公司的股東名單/股份結構',
    en_US: 'Please upload an official list of the Register of Shareholders',
    key: 'vX3WintzNx4ttAFkq5nTZp',
  },
  shareholdersHoldIdentityError: {
    zh_CN: '公司中持股大于等于25%的股东，烦请提供有效证件',
    zh_HK: '公司中持股大於等於25%的股東，煩請提供有效證件',
    en_US:
      'For shareholders who hold more than 25% shares, please provide valid identity documents',
    key: 'nLyxcYX8jdXX4AcbhKmdpx',
  },
  shareholdersCompanyError: {
    zh_CN:
      '若股东是公司，请提供该公司的注册证书和股东名单/股份结构；该公司中持股大于等于25%的最终受益人，烦请提供有效证件',
    zh_HK:
      '若股東是公司，請提供該公司的註冊證書和股東名單/股份結構；該公司中持股大於等於25%的最終受益人，煩請提供有效證件',
    en_US:
      'For institution shareholder, its registration certificate and share structure are required. Valid identity documents of the applicant’s ultimate beneficiary owners (>25%) are also required. ',
    key: 'nMWBDgYJ41CPkZeT6vmbf3',
  },
  directorsRequiredError: {
    zh_CN: '请上传公司的董事名单',
    zh_HK: '請上傳公司的董事名單',
    en_US: 'Please upload an official list of the List of directors',
    key: 'abYWAJCejBJqeNK76iiq8t',
  },
  notAliveError: {
    zh_CN: '活体检测失败',
    zh_HK: '活體檢測失敗',
    en_US: 'Liveness detection failed.',
    key: 'it69KWzQv25MWJJXt6h8aF',
  },
};

export const DEFAULT_FAIL_REASON_CODE = 'otherError';

export const ZArticlesLangs = {
  ur_PK: 'ur',
  ar_AE: 'ar',
  de_DE: 'de',
  en_US: 'en-us',
  es_ES: 'es',
  fr_FR: 'fr',
  ko_KR: 'ko',
  nl_NL: 'nl',
  pt_PT: 'pt',
  ru_RU: 'ru',
  tr_TR: 'tr',
  vi_VN: 'vi',
  zh_CN: 'zh-cn',
  zh_HK: 'zh-tw',
  it_IT: 'it',
  id_ID: 'id',
  ms_MY: 'ms',
  hi_IN: 'hi',
  th_TH: 'th',
  ja_JP: 'ja',
  bn_BD: 'bn',
  pl_PL: 'pl',
  fil_PH: 'fil',
};

export const intoPageGaName = 'pageVisitCollectionV1';

/**
 * Owner: willen@kupotech.com
 */
export const SOURCE = 'web'; // 应用来源

export const KYC_TYPE = {
  PERSONAL: 0, // 个人
  INSTITUTIONAL: 1, // 机构
};

/** 证件照分类 */
export const PHOTO_TYPE = {
  /** 正面 */
  POSITIVE: 0,
  /** 背面 */
  BACK: 1,
  /** 手持证件照片 */
  PHOTO_WITH_ID: 2,
  /** 公司注册证书 */
  CERTIFICATE_OF_INCORPORATION: 3,
  /** 手持证书照 */
  PHOTO_OF_CERTIFICATE: 4,
  /** 董事名单 */
  BOARD_OF_DIRECTORS: 5,
  /** 在职证明 */
  PROOF_OF_EMPLOYMENT: 6,
  /** 董事会决议或授权书，新 kyb 流程里仅代表授权书，董事会决议有新的枚举 */
  AUTHORIZE_IMG: 7,
  /** 履约承诺协议 */
  PERFORMANCE_IMG: 8,
  /** 股东名单 */
  SHAREHOLDERS_IMG: 9,
  /** 其他补充文件 */
  OTHER_IMG: 10,
  /** 营业执照 */
  BUSINESS_LICENSE: 11,
  /** 股东或实际控制人证件 */
  ACTUAL_CONTROLLER: 12,
  /** 董事证件 */
  DIRECTOR_CERTIFICATE: 13,
  /** 尽职调查问卷ECDD */
  DUE_DILIGENCE: 14,
  /** 股权架构图或十大股东名单 */
  EQUITY_STRUCTURE: 15,
  /** 经营者身份证明 */
  OPERATOR_IDENTIFICATION_CERTIFICATE: 16,
  /** 合伙协议 */
  PARTNERSHIP_AGREEMENT: 17,
  /** 合伙人证件 */
  PARTNER_ID: 18,
  /** 出资确认书 */
  CONFIRMATION_CAPITAL_CONTRIBUTION: 19,
  /** 大型企业股东证件 */
  CERTIFICATE_OF_LARGE_ENTERPRISE: 20,
  /** 金融业务许可证 */
  FINANCIAL_BUSINESS_OPERATION_PERMIT: 22,
  /** 资金来源证明或资产证明 */
  PROOF_FUNDING_SOURCE: 23,
  /** 未加盖公章声明 */
  UNSTAMPED_CERTIFICATE: 24,
  /** 董事会决议 */
  BOARD_RESOLUTION: 25,
  /** 持股超过 25% 机构资料 */
  SHAREHOLDING_EXCEEDS_ONE_FOURTH: 26,
};

// 认证方式 0 上传证件照人工审核 1 活体认证
export const VERIFY_TYPE = {
  PERSONAL_VERIFY: 0,
  LIVE_VERIFY: 1,
};

export const KYC2_STATUS = {
  NOT_VERIFIED: -1, // 未认证
};

// 不需要切分姓和名的国家
export const DOT_NEED_DIVIDE_COUNTRIES = ['CN', 'TW', 'HK'];

// 需要固定填写身份证的国家
export const NEED_IDCARD = ['CN'];

// 用户身份认证信息声明：
// /announcement/kyc-user-identity-authentication-statement
// /announcement/en-kyc-user-identity-authentication-statement

// 用户证件信息声明：
// /announcement/kyc-user-identity-statement
// /announcement/en-kyc-user-identity-statement

// 用户声明相关信息
export const USER_KYC_IDENTITY_INFO = {
  CN_USER_AUTH: '/announcement/kyc-user-identity-authentication-statement',
  EN_USER_AUTH: '/announcement/en-kyc-user-identity-authentication-statement',
  CN_USER_CERTIFICATE: '/announcement/kyc-user-identity-statement',
  EN_USER_CERTIFICATE: '/announcement/en-kyc-user-identity-statement',
};

// 交易量(BTC/24H)
export const TRADE_OPTIONS = [
  { code: 't001', value: '<5' },
  { code: 't002', value: '5-10' },
  { code: 't003', value: '10-20' },
  { code: 't004', value: '20-30' },
  { code: 't005', value: '30-50' },
  { code: 't006', value: '50-100' },
  { code: 't007', value: '>100' },
];

// 上传文件大小限制 4M
export const UPLOAD_FILE_SIZE = 4 * 1024 * 1024;

// NORMAL支持文件类型
export const NORMAL_FILE_TYPES = ['image/jpeg', 'image/png'];

//机构认证补充文件上传类型
export const SUPPLEMENTARY_FILE_TYPES = [...NORMAL_FILE_TYPES, 'application/pdf'];

// MULTIPLE支持文件类型
export const MULTIPLE_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
  'application/vnd.ms-excel', // xls
  'application/msword', // doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'application/pdf', // pdf
];

// 机构认证-其他补充文件上传类型
export const SUPPLEMENTARY_OTHER_FILE_TYPES = [
  ...MULTIPLE_FILE_TYPES,
  'text/csv', // csv
];

// 文件大小错误提示
export const UPLOAD_SIZE_ERROR = {
  zh_CN: '请根据提示，上传正确的文件大小',
  en_US: 'Please follow the prompts to upload the correct file size',
};

// 文件类型错误提示
export const UPLOAD_TYPE_ERROR = {
  zh_CN: '请根据提示，上传正确的文件类型',
  en_US: 'Please follow the prompts to upload the correct file type',
};

// 错误返回字段对应FORM字段
export const ERROR_FIELD_MAP = {
  name: 'name',
  registrationDate: 'registrationDate',
  code: 'code',
  dutyParagraph: 'dutyParagraph',
  governmentWebsite: 'governmentWebsite',
  officialWebsite: 'officialWebsite',
  capitalSource: 'capitalSource',
  tradeAmount: 'tradeAmount',
  registrationAttachment: 'registrationAttachment',
  handleRegistrationAttachment: 'handleRegistrationAttachment',
  directorAttachments: 'directorAttachments',
  workCountry: 'workCountry',
  workCity: 'workCity',
  workProvince: 'workProvince',
  workStreet: 'workStreet',
  workHome: 'workHome',
  workPostcode: 'workPostcode',
  registrationCountry: 'registrationCountry',
  registrationCity: 'registrationCity',
  registrationProvince: 'registrationProvince',
  registrationStreet: 'registrationStreet',
  registrationHome: 'registrationHome',
  registrationPostcode: 'registrationPostcode',
  firstName: 'firstName',
  lastName: 'lastName',
  duty: 'duty',
  incumbencyPhoto: 'incumbencyPhoto',
  frontPhoto: 'frontPhoto',
  backPhoto: 'backPhoto',
  handlePhoto: 'handlePhoto',
  idExpireDate: 'idExpireDate',
  director: 'director',
  authorizeAttachments: 'authorizeAttachments',
  performanceAttachments: 'performanceAttachments',
  shareholdersAttachments: 'shareholdersAttachments',
  otherAttachments: 'otherAttachments',
};

// FORM字段对应错误返回字段
export const FIELD_ERROR_MAP = {
  name: 'name',
  registrationDate: 'registrationDate',
  code: 'code',
  dutyParagraph: 'dutyParagraph',
  governmentWebsite: 'governmentWebsite',
  officialWebsite: 'officialWebsite',
  capitalSource: 'capitalSource',
  tradeAmount: 'tradeAmount',
  registrationAttachment: 'registrationAttachment',
  handleRegistrationAttachment: 'handleRegistrationAttachment',
  directorAttachments: 'directorAttachments',
  workCountry: 'workCountry',
  workCity: 'workCity',
  workProvince: 'workProvince',
  workStreet: 'workStreet',
  workHome: 'workHome',
  workPostcode: 'workPostcode',
  registrationCountry: 'registrationCountry',
  registrationCity: 'registrationCity',
  registrationProvince: 'registrationProvince',
  registrationStreet: 'registrationStreet',
  registrationHome: 'registrationHome',
  registrationPostcode: 'registrationPostcode',
  firstName: 'firstName',
  lastName: 'lastName',
  duty: 'duty',
  incumbencyPhoto: 'incumbencyPhoto',
  frontPhoto: 'frontPhoto',
  backPhoto: 'backPhoto',
  handlePhoto: 'handlePhoto',
  idExpireDate: 'idExpireDate',
  director: 'director',
  authorizeAttachments: 'authorizeAttachments',
  performanceAttachments: 'performanceAttachments',
  shareholdersAttachments: 'shareholdersAttachments',
  otherAttachments: 'otherAttachments',
};
//  PDF 链接
export const PDF_LINk = {
  resolution:
    'https://assets.staticimg.com/cms/media/7A8dyGmv67BwqrLotroBJFr9qa7DYCr9yjrfXeCrz.pdf', // 董事会决议模板
  certificate:
    'https://assets.staticimg.com/cms/media/YOFKdHD8Hp8P3lteoYKc0IQQ81Uc3DSBQ5Lx7taJ2.pdf', // 授权书模板
  commitment:
    'https://assets.staticimg.com/cms/media/EWnSbSGKXV38NpBhEWyBwJSn6GSP4pzGTNcVTBP1K.pdf', // 履约承诺协议
  statement: 'https://assets.staticimg.com/cms/media/1f3qC3AISrzgK7aAZlfWAXDKAotUVAgqKGX22GTcX.pdf', // 声明
  ecdd: 'https://assets.staticimg.com/cms/media/u05aV1ETIUUpYgroe1rxffiCDzQuK6EbgAbjQnbJ4.pdf', // 尽职调查问卷ECDD
};

// moment 语言包key
// export const locales = {
//   zh_CN: 'zh-cn',
//   en_US: 'en',
//   es_ES: 'es',
//   fr_FR: fr,
//   it_IT: 'it',
//   ko_KR: 'ko',
//   nl_NL: 'nl',
//   pt_PT: 'pt',
//   ru_RU: ru,
//   tr_TR: 'tr',
//   vi_VN: 'vi',
//   zh_HK: 'zh-hk',
// };

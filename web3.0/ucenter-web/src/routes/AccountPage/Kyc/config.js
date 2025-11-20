/**
 * Owner: willen@kupotech.com
 */
import {
  DOT_NEED_DIVIDE_COUNTRIES,
  PDF_LINk,
  PHOTO_TYPE,
} from 'components/Account/Kyc/common/constants';
import { includes, isArray, isEmpty, map } from 'lodash';
import moment from 'moment';
import { Fragment } from 'react';
import { _t, _tHTML } from 'tools/i18n';

const noop = () => '';

// EKYC认证中，美国，日本均显示为认证失败，但是是享受了认证成功的权益的。
export const displayFailedCountries = ['OT'];

// kyc1初级认证状态
export const PRIMARY_VERIFY_STATUS = {
  noPass: 0,
  pass: 1,
};

const description = (reason, isChinaLang) => {
  const flag = isChinaLang ? '：' : ': ';
  reason = reason ? `${flag}${reason}` : '';
  return _t('kyc.account.sec.review.certificate.submit.failed.reason', { reason });
};
// kyc2/机构kyc认证状态
export const VERIFY_STATUS = {
  // 未提交
  '-1': {
    code: -1,
  },
  // 待审核
  0: {
    code: 0,
    alertType: 'success',
    message: () => _t('kyc.account.sec.reviewing'),
    description: () => _t('kyc.account.sec.reviewing.notice.info'),
    hideBtn: true,
    hideTriggerBtn: true,
  },
  // 审核通过
  1: {
    code: 1,
    hideBtn: true,
    hideTriggerBtn: true,
  },
  // 审核不通过
  2: {
    code: 2,
    alertType: 'error',
    message: () => _t('kyc.account.sec.review.passnot'),
    description: (reason, isChinaLang) => {
      const flag = isChinaLang ? '：' : ': ';
      reason = reason ? `${flag}${reason}` : '';
      // 如果没有失败原因则展示默认的失败原因
      if (!reason) {
        return (
          <Fragment>
            <div>
              {_t('account.ekyc.retry.tip')}
              {_t('account.ekyc.fail.checkitem')}
            </div>
            <div>{_t('account.ekyc.fail.checkitem1')}</div>
            <div>{_t('account.ekyc.fail.checkitem2')}</div>
          </Fragment>
        );
      }
      return _t('kyc.account.sec.review.certificate.submit.failed.reason', { reason });
    },
  },
  // 待AML人工审核
  3: {
    code: 3,
    alertType: 'success',
    message: () => _t('kyc.account.sec.reviewing'),
    description: () => _t('kyc.account.sec.reviewing.notice.info'),
    hideBtn: true,
    hideTriggerBtn: true,
  },
  // 人工审核不通过
  4: {
    code: 4,
    alertType: 'error',
    message: () => _t('kyc.account.sec.review.passnot'),
    description,
  },
  // 该国家不支持高级KYC
  // EKYC: 包含美国/日本假失败的情况,regionCode: OT verifyStatus: 5
  5: {
    code: 5,
    alertType: 'error',
    message: () => _t('kyc.account.sec.review.passnot'),
    description: (reason, isChinaLang, kycInfo) => {
      const { regionCode } = kycInfo || {};
      if (includes(displayFailedCountries, regionCode)) {
        return _t('account.ekyc.forbidden.desc');
      }
      return _t('kyc.account.sec.review.gov.restrictions.passnot.info');
    },
    hideBtn: true,
  },
  // EKYC-OCR认证中
  6: {
    code: 6,
    alertType: 'success',
    description: () => _t('account.ekyc.working.desc'),
    message: noop,
    hideBtn: true,
  },
  // EKYC-活体检测中
  7: {
    code: 7,
    alertType: 'success',
    description: () => _t('account.ekyc.working.desc'),
    message: noop,
    hideBtn: true,
  },
  // EKYC-自动KYC认证失败
  8: {
    code: 8,
    alertType: 'error',
    message: () => _t('account.ekyc.kyc.fail'),
    description: (reason, isChinaLang, kycInfo) => {
      const { regionCode, failureReasonLists = [] } = kycInfo || {};
      if (includes(displayFailedCountries, regionCode)) {
        return _t('account.ekyc.forbidden.desc');
      }
      let content = null;
      // 添加ekyc认证失败的接口返回原因,如果失败原因为空，还是展示原本固定的原因
      if (isArray(failureReasonLists) && !isEmpty(failureReasonLists)) {
        content = map(failureReasonLists, (item, index) => {
          if (item && item.trim()) {
            return <div key={index}>{`${index + 1}. ${item}`}</div>;
          }
        });
      } else {
        content = (
          <Fragment>
            <div>{_t('account.ekyc.fail.checkitem1')}</div>
            <div>{_t('account.ekyc.fail.checkitem2')}</div>
          </Fragment>
        );
      }
      return (
        <Fragment>
          <div>
            {_t('account.ekyc.retry.tip')}
            {_t('account.ekyc.fail.checkitem')}
          </div>
          {content}
        </Fragment>
      );
    },
  },
};

// 显示正在认证中的状态标签(加入了ekyc的新状态)
export const doVerifyStatus = [0, 3, 7];
// 显示未认证的状态标签(加入了ekyc的新状态)
export const notPassStatus = [-1, 2, 4, 5, 6, 8];

// 属于kyc1要提交的字段
export const KYC1_KEY = ['nationality', 'firstName', 'lastName', 'idType', 'idNumber'];

// 认证项
export const VERIFY_ITEM = {
  lastName: () => _t('kyc.form.lastName'),
  firstName: () => _t('kyc.form.firstName'),
  gender: () => _t('kyc.form.gender'),
  regionName: () => _t('kyc.form.nation'),
  idType: () => _t('kyc.form.cardType'),
  idNumber: () => _t('kyc.form.cardNo'),
  idExpireDate: () => _t('kyc.form.expiryDate'),
  frontPhoto: () => _t('kyc.form.frontPhoto'),
  backPhoto: () => _t('kyc.form.backPhoto'),
  handlePhoto: () => _t('kyc.form.handlePhoto'),
  faceDetection: () => _t('kyc.verify.faceDetection'),
  identityVerification: () => _t('kyc.verify'),
  incumbencyPhoto: () => _t('kyc.contacts.incumbency'),
  registrationAttachment: () => _t('kyc.doc.reg'),
  handleRegistrationAttachment: () => _t('kyc.verification.info.hold.corp.docum'),
  name: () => _t('kyc.company.name'),
  registrationDate: () => _t('kyc.company.regDate'),
  code: () => _t('kyc.company.code'),
  dutyParagraph: () => _t('kyc.company.taxCode'),
  capitalSource: () => _t('kyc.company.ivSource'),
  tradeAmount: () => _t('kyc.mechanism.verify.company.trading.volume'),
  workCountry: () => _t('kyc.form.nation'),
  workCity: () => _t('kyc.form.city'),
  workProvince: () => _t('kyc.form.state'),
  workStreet: () => _t('kyc.form.street'),
  workHome: () => _t('kyc.form.houseno'),
  workPostcode: () => _t('kyc.form.postcode'),
  registrationCountry: () => _t('kyc.form.nation'),
  registrationCity: () => _t('kyc.form.city'),
  registrationProvince: () => _t('kyc.form.state'),
  registrationStreet: () => _t('kyc.form.street'),
  registrationHome: () => _t('kyc.form.houseno'),
  registrationPostcode: () => _t('kyc.form.postcode'),
  directorAttachments: () => _t('kyc.verification.info.documents.item5'),
  authorizeAttachments: () => _t('kyc.verification.info.documents.item1'),
  performanceAttachments: () => _t('kyc.verification.info.documents.item2'),
  shareholdersAttachments: () => _t('kyc.verification.info.documents.item3'),
  otherAttachments: () => _t('kyc.verification.info.documents.item4'),
  governmentWebsite: () => _t('kyc.company.govUrl'),
  officialWebsite: () => _t('kyc.company.url'),
  director: () => _t('kyc.company.director'),
  middleName: () => _t('kyc.form.middleName1'),
  middleName2: () => _t('kyc.form.middleName2'),
  duty: () => _t('kyc.contact.information.position'),
  facePhoto: () => _t('aDxH6pLT7pajsxdJKjdU9x'),
};

export const isVerifyingStatus = (verifyStatus) => {
  return includes(doVerifyStatus, verifyStatus);
};

export const isPersonalNotKycPass = (verifyStatus) => {
  return includes(notPassStatus, verifyStatus);
};

// 由firstName, lastName拼装显示用户的kyc姓名
export const getKycDisplayName = ({ regionCode, firstName = '', lastName = '' }) => {
  if (!firstName && !lastName) return '';
  const isDivideName = !includes(DOT_NEED_DIVIDE_COUNTRIES, regionCode);
  return isDivideName ? `${firstName} ${lastName}` : `${lastName}${firstName}`;
};

/** 企业类型 */
export const COMPANY_TYPE = {
  /** 普通企业 */
  NORMAL: 'NORMAL',
  /** 大型企业 */
  LARGE_ENTERPRISES: 'LARGE_ENTERPRISES',
  /** 个体户/一人企业 */
  INDIVIDUAL_ENTERPRISE: 'INDIVIDUAL_ENTERPRISE',
  /** 合伙制企业 */
  PARTNERSHIP: 'PARTNERSHIP',
  /** 金融机构 */
  FINANCIAL_INSTITUTION: 'FINANCIAL_INSTITUTION',
  /** 其他类型企业 */
  OTHER: 'OTHER',
};

/**
 * 传统企业类型
 ** 名称是 AI 起的，不代表产品设计
 */
export const TRADITIONAL_BUSINESS_TYPES = [
  COMPANY_TYPE.NORMAL,
  COMPANY_TYPE.LARGE_ENTERPRISES,
  COMPANY_TYPE.FINANCIAL_INSTITUTION,
  COMPANY_TYPE.OTHER,
];
/** 灵活企业类型 */
export const FLEXIBLE_BUSINESS_TYPES = [
  COMPANY_TYPE.INDIVIDUAL_ENTERPRISE,
  COMPANY_TYPE.PARTNERSHIP,
];

/** kyb 认证类型枚举 */
export const KYB_CERT_TYPES = {
  /** 平台 kyb 认证 */
  COMMON: '0',
  /** kucoin pay kyb 认证 */
  KUCOIN_PAY: '1',
};

/** 企业列表 */
export const COMPANY_TYPE_LIST = [
  {
    title: _t('3ddfaddcee864000a3bd'),
    description: _t('ed2a0e6f210d4000a298'),
    value: COMPANY_TYPE.NORMAL,
  },
  {
    title: _t('d3e1e23f493f4000a3f6'),
    description: _t('f804c2a0d96a4800abf9'),
    value: COMPANY_TYPE.LARGE_ENTERPRISES,
  },
  {
    title: _t('59536a0ad6264800a722'),
    description: _t('08d308b936e64000a65e'),
    value: COMPANY_TYPE.INDIVIDUAL_ENTERPRISE,
  },
  {
    title: _t('620af46bd0fa4800a9c2'),
    description: _t('bbca1c20180c4800a802'),
    value: COMPANY_TYPE.PARTNERSHIP,
  },
  {
    title: _t('51654fb7daf14000ad97'),
    description: _t('032df87d80804800a08b'),
    value: COMPANY_TYPE.FINANCIAL_INSTITUTION,
  },
  {
    title: _t('5f4ff9acb6394000a612'),
    description: _t('4935419913574800ac84'),
    value: COMPANY_TYPE.OTHER,
  },
];

/** 新 KYB 流程用到的文件类型的字段 */
export const TOTAL_FILE_FIELDS = {
  /** 公司注册证书或商业登记证 */
  registrationAttachment: 'registrationAttachment',
  /** 材料类型 */
  businessLicenseOrThirdWebsite: 'businessLicenseOrThirdWebsite',
  /** 第三方平台网址 */
  thirdPartyPlatformWebsite: 'thirdPartyPlatformWebsite',
  /** 【营业执照】 */
  businessLicense: 'businessLicense',
  /** 【手持公司注册证书或商业登记证】 或 【手持营业执照】 */
  handleRegistrationAttachment: 'handleRegistrationAttachment',
  /** 股东或实际控制人证件（持股超过25%自然人的证件） */
  actualController: 'actualController',
  /** 大型企业股东证件（只有公司类型为大型企业的才有） */
  certificateOfLargeEnterprise: 'certificateOfLargeEnterprise',
  /** 出资确认书 */
  confirmationCapitalContribution: 'confirmationCapitalContribution',
  /** 证件照正面 */
  frontPhoto: 'frontPhoto',
  /** 证件照背面 */
  backPhoto: 'backPhoto',
  /** 手持证件照 */
  handlePhoto: 'handlePhoto',
  /** 董事证件 */
  directorCertificate: 'directorCertificate',
  /** 董事会决议 */
  boardResolution: 'boardResolution',
  /** 董事名单 */
  directorAttachment: 'directorAttachment',
  /** 尽职调查问卷 */
  dueDiligence: 'dueDiligence',
  /** 股权架构图或十大股东名单 */
  equityStructure: 'equityStructure',
  /** 金融业务许可证 */
  financialBusinessOperationPermit: 'financialBusinessOperationPermit',
  /** 经营者身份证明 */
  operatorIdentificationCertificate: 'operatorIdentificationCertificate',
  /** 合伙人证件 */
  partnerID: 'partnerID',
  /** 合伙协议 */
  partnershipAgreement: 'partnershipAgreement',
  /** 履约承诺协议 */
  performanceAttachment: 'performanceAttachment',
  /** 资金来源证明或资产证明 */
  proofFundingSource: 'proofFundingSource',
  /** 股东名单 */
  shareholdersAttachment: 'shareholdersAttachment',
  /** 授权书 */
  authorizeAttachment: 'authorizeAttachment',
  /** 持股超过 25% 机构资料 */
  shareholdingExceedsOneFourth: 'shareholdingExceedsOneFourth',
  /** 未加盖公章声明 */
  unstampedCertificate: 'unstampedCertificate',
};

/** 新 KYB 流程用到的全部字段 */
export const TOTAL_FIELDS = {
  companyType: 'companyType',
  name: 'name',
  registrationDate: 'registrationDate',
  code: 'code',
  dutyParagraph: 'dutyParagraph',
  capitalSource: 'capitalSource',
  tradeAmount: 'tradeAmount',
  director: 'director',
  governmentWebsite: 'governmentWebsite',
  officialWebsite: 'officialWebsite',
  industryCode: 'industryCode',
  tradeCode: 'tradeCode',
  registrationCountry: 'registrationCountry',
  registrationProvince: 'registrationProvince',
  registrationCity: 'registrationCity',
  registrationPostcode: 'registrationPostcode',
  registrationStreet: 'registrationStreet',
  registrationHome: 'registrationHome',
  detailSameOfficeAddress: 'detailSameOfficeAddress',
  workCountry: 'workCountry',
  workProvince: 'workProvince',
  workCity: 'workCity',
  workPostcode: 'workPostcode',
  workStreet: 'workStreet',
  workHome: 'workHome',
  firstName: 'firstName',
  lastName: 'lastName',
  middleName: 'middleName',
  middleName2: 'middleName2',
  duty: 'duty',
  imAccount: 'imAccount',
  detailContactorPhotoType: 'detailContactorPhotoType',
  idExpireDate: 'idExpireDate',
  detailDirectorSingle: 'detailDirectorSingle',
  detailIndividualShareholdersRatio: 'detailIndividualShareholdersRatio',
  detailInstitutionShareholdersRatio: 'detailInstitutionShareholdersRatio',
  detailOfficialSealAvailable: 'detailOfficialSealAvailable',
  ...TOTAL_FILE_FIELDS,
};

/**
 * 字段对应的 title、description以及文件类型
 ** 部分字段会根据企业类型展示不同的文案
 */
export const TOTAL_FIELD_INFOS = {
  [TOTAL_FIELDS.thirdPartyPlatformWebsite]: {
    title: () => _t('5917b2c99fb94000a83c'),
  },
  [TOTAL_FIELDS.companyType]: {
    title: () => _t('1697d795cbef4800a8ad'),
  },
  [TOTAL_FIELDS.name]: {
    title: () => _t('kyc.company.name'),
  },
  [TOTAL_FIELDS.registrationDate]: {
    title: () => _t('kyc.company.regDate'),
  },
  [TOTAL_FIELDS.code]: {
    title: () => _t('kyc.company.code'),
  },
  [TOTAL_FIELDS.dutyParagraph]: {
    title: () => _t('kyc.company.taxCode'),
  },
  [TOTAL_FIELDS.capitalSource]: {
    title: () => _t('kyc.company.ivSource'),
  },
  [TOTAL_FIELDS.tradeAmount]: {
    title: () => _t('kyc.company.tradeAmout'),
  },
  [TOTAL_FIELDS.director]: {
    title: () => _t('9a848413a7b44000a2bb'),
  },
  [TOTAL_FIELDS.governmentWebsite]: {
    title: () => _t('kyc.company.govUrl'),
  },
  [TOTAL_FIELDS.officialWebsite]: {
    title: () => _t('kyc.company.url'),
  },
  [TOTAL_FIELDS.industryCode]: {
    title: () => _t('89d64b6e25984000af05'),
  },
  [TOTAL_FIELDS.tradeCode]: {
    title: () => _t('8263956d60ee4000a3fd'),
  },
  [TOTAL_FIELDS.registrationCountry]: {
    title: () => _t('kyc.company.regAddr'),
  },
  [TOTAL_FIELDS.registrationProvince]: {
    title: () => _t('kyc.form.state'),
  },
  [TOTAL_FIELDS.registrationCity]: {
    title: () => _t('kyc.form.city'),
  },
  [TOTAL_FIELDS.registrationPostcode]: {
    title: () => _t('kyc.form.postcode'),
  },
  [TOTAL_FIELDS.registrationStreet]: {
    title: () => _t('kyc.form.street'),
  },
  [TOTAL_FIELDS.registrationHome]: {
    title: () => _t('kyc.form.houseno'),
  },
  [TOTAL_FIELDS.workCountry]: {
    title: () => _t('kyc.company.addr'),
  },
  [TOTAL_FIELDS.workProvince]: {
    title: () => _t('kyc.form.state'),
  },
  [TOTAL_FIELDS.workCity]: {
    title: () => _t('kyc.form.city'),
  },
  [TOTAL_FIELDS.workPostcode]: {
    title: () => _t('kyc.form.postcode'),
  },
  [TOTAL_FIELDS.workStreet]: {
    title: () => _t('kyc.form.street'),
  },
  [TOTAL_FIELDS.workHome]: {
    title: () => _t('kyc.form.houseno'),
  },
  [TOTAL_FIELDS.firstName]: {
    title: () => _t('kyc.form.firstName'),
  },
  [TOTAL_FIELDS.lastName]: {
    title: () => _t('kyc.form.lastName'),
  },
  [TOTAL_FIELDS.middleName]: {
    title: () => _t('kyc.form.middleName1'),
  },
  [TOTAL_FIELDS.middleName2]: {
    title: () => _t('kyc.form.middleName2'),
  },
  [TOTAL_FIELDS.duty]: {
    title: () => _t('kyc.contact.information.position'),
  },
  [TOTAL_FIELDS.imAccount]: {
    title: () => 'Telegram/Whatsapp',
  },
  [TOTAL_FIELDS.idExpireDate]: {
    title: () => _t('kyc.contact.information.certificate.lastdate'),
  },
  [TOTAL_FIELDS.registrationAttachment]: {
    title: () => _t('4fc293dfb1134800a661'),
    description: () => _t('a04944f6dc454000a792'),
    photoType: () => PHOTO_TYPE.CERTIFICATE_OF_INCORPORATION,
    max: 6,
  },
  [TOTAL_FIELDS.businessLicense]: {
    title: () => _t('4c7fb8ac77cd4000acbf'),
    description: () => _t('89ab80e4a3e14000aded'),
    photoType: () => PHOTO_TYPE.BUSINESS_LICENSE,
    max: 6,
  },
  [TOTAL_FIELDS.handleRegistrationAttachment]: (() => {
    /** 根据公司类型显示「手持营业执照」或是「手持公司注册证书」 */
    return {
      title: ({ companyType }) =>
        FLEXIBLE_BUSINESS_TYPES.includes(companyType)
          ? _t('786e878f204c4000ad6d')
          : _t('b3edf740a6804000a643'),
      description: ({ companyType, kycCode }) => {
        return _tHTML('c34faff554d94000aab9', {
          documents: FLEXIBLE_BUSINESS_TYPES.includes(companyType)
            ? _t('4c7fb8ac77cd4000acbf')
            : _t('4fc293dfb1134800a661'),
          code: kycCode,
          date: moment().format('YYYY-MM-DD'),
          className: 'bold',
        });
      },
      photoType: () => PHOTO_TYPE.PHOTO_OF_CERTIFICATE,
      max: 6,
    };
  })(),
  [TOTAL_FIELDS.actualController]: {
    title: () => _t('59cead7d33b84800ae08'),
    description: () => _t('8fdf157999174800afe9'),
    photoType: () => PHOTO_TYPE.ACTUAL_CONTROLLER,
  },
  [TOTAL_FIELDS.certificateOfLargeEnterprise]: {
    title: () => _t('e73cea3930d84800afa9'),
    description: () => _t('5a9e11b5a67a4800a55f'),
    photoType: () => PHOTO_TYPE.CERTIFICATE_OF_LARGE_ENTERPRISE,
  },
  [TOTAL_FIELDS.shareholdingExceedsOneFourth]: {
    title: () => _t('3b49b2e86f1f4000a338'),
    description: () => _t('80a0f797d8f74800aeec'),
    photoType: () => PHOTO_TYPE.SHAREHOLDING_EXCEEDS_ONE_FOURTH,
  },
  [TOTAL_FIELDS.confirmationCapitalContribution]: {
    title: () => _t('1b21688d234a4800a045'),
    description: () => _t('ed998d06c8d04000a0dc'),
    photoType: () => PHOTO_TYPE.CONFIRMATION_CAPITAL_CONTRIBUTION,
  },
  [TOTAL_FIELDS.frontPhoto]: {
    title: ({ detailContactorPhotoType }) =>
      detailContactorPhotoType === 'idCard'
        ? _t('kyc.contact.information.ID.photo.front')
        : _t('1be5c790e84b4000ac72'),
    photoType: () => PHOTO_TYPE.POSITIVE,
    max: 1,
  },
  [TOTAL_FIELDS.backPhoto]: {
    title: () => _t('kyc.contact.information.ID.photo.back'),
    photoType: () => PHOTO_TYPE.BACK,
    max: 1,
  },
  [TOTAL_FIELDS.handlePhoto]: {
    title: () => _t('kyc.contact.information.verified.holding.upload'),
    description: ({ kycCode }) => {
      return _tHTML('kyc.mechanism.verify.company.verify.holding.upload', {
        code: kycCode,
        date: moment().format('YYYY-MM-DD'),
        className: 'bold',
      });
    },
    photoType: () => PHOTO_TYPE.PHOTO_WITH_ID,
    max: 1,
  },
  [TOTAL_FIELDS.directorCertificate]: {
    title: () => _t('2f1cd526fbee4800a320'),
    description: () => _t('40868b6bf3c44000a5e5'),
    photoType: () => PHOTO_TYPE.DIRECTOR_CERTIFICATE,
  },
  [TOTAL_FIELDS.authorizeAttachment]: {
    title: () => _t('9272266fcafa4000a20b'),
    description: () => (
      <div>
        {_t('30a85d4849e34000a938')}&nbsp;
        <a href={PDF_LINk.certificate} target="_blank" rel="noreferrer">
          {_t('kyc.verification.info.documents.link3')}
        </a>
      </div>
    ),
    photoType: () => PHOTO_TYPE.AUTHORIZE_IMG,
  },
  [TOTAL_FIELDS.boardResolution]: {
    title: ({ companyType }) =>
      companyType === COMPANY_TYPE.PARTNERSHIP
        ? _t('6468a2516be34000aec4')
        : _t('4432da7affcc4000afb6'),
    description: () => (
      <div>
        {_t('30a85d4849e34000a938')}&nbsp;
        <a href={PDF_LINk.resolution} target="_blank" rel="noreferrer">
          {_t('kyc.verification.info.documents.link2')}
        </a>
      </div>
    ),
    photoType: () => PHOTO_TYPE.BOARD_RESOLUTION,
  },
  [TOTAL_FIELDS.directorAttachment]: {
    title: () => _t('kyc.verification.info.documents.item5'),
    description: () => _t('kyc.verification.info.documents.item.tips7'),
    photoType: () => PHOTO_TYPE.BOARD_OF_DIRECTORS,
  },
  [TOTAL_FIELDS.dueDiligence]: {
    title: () => _t('5b151c8024114800aedb'),
    description: () => {
      return <div>{_tHTML('e65cc6a5e1084800afcd', { url: PDF_LINk.ecdd })}</div>;
    },
    photoType: () => PHOTO_TYPE.DUE_DILIGENCE,
  },
  [TOTAL_FIELDS.equityStructure]: {
    title: () => _t('0ec0d5222d1c4000a714'),
    description: () => _t('6438daef4ed44000ae79'),
    photoType: () => PHOTO_TYPE.EQUITY_STRUCTURE,
  },
  [TOTAL_FIELDS.financialBusinessOperationPermit]: {
    title: () => _t('3727ed96e4084800a5bf'),
    description: () => _t('ef8ddf94672a4800ab6f'),
    photoType: () => PHOTO_TYPE.FINANCIAL_BUSINESS_OPERATION_PERMIT,
  },
  [TOTAL_FIELDS.operatorIdentificationCertificate]: {
    title: () => _t('bb157d4d379f4000adb0'),
    description: () => _t('02a43b2393c74800a071'),
    photoType: () => PHOTO_TYPE.OPERATOR_IDENTIFICATION_CERTIFICATE,
  },
  [TOTAL_FIELDS.partnerID]: {
    title: () => _t('6f962d2cbeb84800a1f6'),
    description: () => _t('3e35445d8f7c4000a7d2'),
    photoType: () => PHOTO_TYPE.PARTNER_ID,
  },
  [TOTAL_FIELDS.partnershipAgreement]: {
    title: () => _t('a90616086a014000a41d'),
    description: () => _t('9e2ba4a7f7514800ad09'),
    photoType: () => PHOTO_TYPE.PARTNERSHIP_AGREEMENT,
  },
  [TOTAL_FIELDS.performanceAttachment]: {
    title: () => _t('kyc.verification.info.documents.item2'),
    description: () => (
      <>
        <div>{_t('196e9947d64e4000a977')}</div>
        <div>
          {_t('30a85d4849e34000a938')}&nbsp;
          <a href={PDF_LINk.commitment} target="_blank" rel="noreferrer">
            {_t('kyc.verification.info.documents.link4')}
          </a>
        </div>
      </>
    ),
    photoType: () => PHOTO_TYPE.PERFORMANCE_IMG,
  },
  [TOTAL_FIELDS.proofFundingSource]: {
    title: () => _t('67726300daad4000afc7'),
    description: () => _t('a60111ae39404000a15e'),
    photoType: () => PHOTO_TYPE.PROOF_FUNDING_SOURCE,
  },
  [TOTAL_FIELDS.shareholdersAttachment]: {
    title: () => _t('2ec27e3770a04800a0bd'),
    description: () => _t('02c89239bbb74000a93d'),
    photoType: () => PHOTO_TYPE.SHAREHOLDERS_IMG,
  },
  [TOTAL_FIELDS.unstampedCertificate]: {
    title: () => _t('kyc.verification.info.documents.link1'),
    description: () => _tHTML('0b91ce932b244800af7b', { url: PDF_LINk.statement }),
    photoType: () => PHOTO_TYPE.UNSTAMPED_CERTIFICATE,
  },
};

/** 需要校验的表单元素的容器类名，用于校验失败时滚动定位 */
export const VERIFY_CONTAINER_CLASS_NAME = 'kyb-verify-container';

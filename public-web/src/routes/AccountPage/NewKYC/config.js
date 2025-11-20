/**
 * Owner: willen@kupotech.com
 */
import withdrawIcon from 'static/account/newKyc/withdraw.svg';
import contractIcon from 'static/account/newKyc/contract.svg';
import otcIcon from 'static/account/newKyc/otc.svg';
import institutionIcon from 'static/account/newKyc/institution.svg';
import personalIcon from 'static/account/newKyc/personal.svg';
import { _t } from 'tools/i18n';
import siteConfig from 'utils/siteConfig';

const { KUCOIN_HOST_CHINA } = siteConfig;
// 跳转到app端二级认证的地址
export const APP_KYC_URL = `${KUCOIN_HOST_CHINA}?link=kucoin:///kycHighLevel`;

// 当前权益
export const PRIVILEGES = {
  trade: () => _t('kyc.coin.transaction'),
  withdrawal: () => _t('kyc.withdrawal'),
  margin_trade: () => _t('kyc.lever.transaction'),
  deposit: () => _t('kyc.recharge'),
  otc: () => _t('kyc.fiat.currency.transaction'),
  contract: () => _t('kyc.contract.transaction'),
};

// 通过认证权益
export const PASSED_LEGAL = [
  {
    key: 'withdrawalAmount',
    icon: withdrawIcon,
    name: () => _t('kyc.withdraw.quota'),
    describe: (v) => _t('kyc.withdraw.quota.everyday', { limit: v }),
    describe2: () => _t('kyc.withdraw.quota.tips'),
  },
  {
    key: 'contractMargin',
    icon: contractIcon,
    name: () => _t('kyc.contract.transaction.multiple'),
    describe: (v) => _t('kyc.contract.transaction.multiple.x', { multiple: v }),
  },
  {
    key: 'maxOTCAmountDaily',
    icon: otcIcon,
    name: () => _t('kyc.fiat.currency.trading.limit'),
    describe: (v) => _t('kyc.transaction.limit', { limit: v }),
  },
];

// 认证类型
export const TYPE = {
  noCommit: -1, // 未提交
  personal: 0, // 个人认证
  institution: 1, // 机构认证
};

// 页面类型
export const PAGE_TYPE = {
  // 个人认证
  personal: {
    type: 0,
    code: 'personal',
    icon: institutionIcon,
    title: () => _t('kyc.certification.personal'),
    triggerBtnText: () => _t('kyc.certification.mechanism.change'),
  },
  // 机构认证
  institution: {
    type: 1,
    code: 'institution',
    icon: personalIcon,
    title: () => _t('kyc.certification.mechanism'),
    triggerBtnText: () => _t('kyc.certification.personal.change'),
  },
};

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
    alertType: 'primary',
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
    alertType: 'secondary',
    message: () => _t('kyc.account.sec.review.passnot'),
    description,
  },
  // 待AML人工审核
  3: {
    code: 3,
    alertType: 'primary',
    message: () => _t('kyc.account.sec.reviewing'),
    description: () => _t('kyc.account.sec.reviewing.notice.info'),
    hideBtn: true,
    hideTriggerBtn: true,
  },
  // 人工审核不通过
  4: {
    code: 4,
    alertType: 'secondary',
    message: () => _t('kyc.account.sec.review.passnot'),
    description,
  },
  // 该国家不支持高级KYC
  5: {
    code: 5,
    alertType: 'secondary',
    message: () => _t('kyc.account.sec.review.passnot'),
    description: () => _t('kyc.account.sec.review.gov.restrictions.passnot.info'),
    hideBtn: true,
  },
};

// 属于kyc1要提交的字段
export const KYC1_KEY = ['nationality', 'firstName', 'lastName', 'idType', 'idNumber'];

// kyc2 的字段
export const KYC2_KEY = ['frontPhoto', 'backendPhoto', 'handlePhoto'];

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
  directorAttachment: () => _t('kyc.doc.boss'),
  birthday: () => _t('kyc.form.birthday'),
};

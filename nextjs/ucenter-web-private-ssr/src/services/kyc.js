/**
 * Owner: willen@kupotech.com
 */
import AES from 'crypto-js/aes';
import Base64 from 'crypto-js/enc-base64';
import encUtf8 from 'crypto-js/enc-utf8';
import ECB from 'crypto-js/mode-ecb';
import Pkcs7 from 'crypto-js/pad-pkcs7';
import { post, postJson, pull as originPull } from 'tools/request';
import { pullWrapper } from 'utils/pullCache';

const pull = pullWrapper(originPull);


// const key = encUtf8.parse(UCENTER_KYC_ENCRYPT_KEY);
const key = encUtf8.parse('ry35490gf27et52d');
// 加密方法
const encrypt = (data) => {
  data = JSON.stringify(data);
  const srcs = encUtf8.parse(data);
  const encrypted = AES.encrypt(srcs, key, {
    mode: ECB,
    padding: Pkcs7,
  });
  return encrypted.ciphertext.toString(Base64);
};

const eKycPrefix = '/kyc';

// 确认提交审核
export const confirm = (params) => {
  return pull('/kyc/kyc/submit', params);
};

export const getKycCode = () => {
  return pull('/kyc/kyc-code');
};

/**
 * 获取用户填写的kyc姓名，不带*号
 * @returns
 */
export const getKycName = () => {
  return pull('/kyc/web/kyc/kyc-info');
};

// 获取kyc认证状态
export const getKycInfo = (params) => {
  return pull('/kyc/kyc/info', params);
};
/**
 * 获取kyc认证状态（新）verifyStatus 会返回 6，7，8（EKYC的认证状态）
 * /kyc/kyc/info的接口状态6、7返回状态0、状态8返回状态2
 * @param {*} params
 * @returns
 */
export const getKycResult = (params) => {
  const url = `${eKycPrefix}/web/kyc/result/personal`;

  return pull(url, params);
};
// 获取kyb权益
export const getKybPrivileges = (params) => {
  return post('/kyc/web/kyb/privileges', params, false, true);
};

// 上传文件
export const kycUpload = (params) => post('/kyc/kyc/web/upload', params);

// 提交高级认证
export const kycSeniorSubmit = (params) => post('/kyc/kyc/senior/submit', params);

// KYC机构基本信息提交
export const kycCompBasicSubmit = (params) =>
  post('/kyc/kyc/company/normal/create-or-update', { info: encrypt(params) });

// KYC机构联系人信息
export const kycCompContactSubmit = (params) =>
  post('/kyc/kyc/company/contact/create-or-update', { info: encrypt(params) });

// KYC获取国家接口
export const kycGetCountries = (params) => pull('/kyc/kyc/regions/v2', params);

// KYB获取国家接口
export const kybGetCountries = (params) => pull('/kyc/kyc/regions/v3', params);

// KYC获取国家接口-加了白名单的
export const kycGetCountries2 = ({ token }) =>
  pull(`/ucenter/whitelist/kyc/regions?token=${token}`);

// 查询用户机构认证信息
export const KycCompanyDetail = (params) => pull('/kyc/v2/kyc/company/detail', params);

// 机构认证的时候多个图片上传提交
export const kycCompMoreImg = (params) =>
  post('/kyc/kyc/company/credentials/create-or-update', params, false, true);

//获取高级认证的渠道
export const getKyc2Channel = (params) => {
  const url = '/kyc/web/kyc/channel';
  return post(url, params, false, true);
};
// 完成jumio认证流程，触发后续结果处理
export const finishJumio = (params) => {
  return post('/kyc/web/kyc/finish/jumio', params, false, true);
};
//  完成sumsub认证流程，触发后续结果处理
export const finishSumsub = (params) => {
  return post('/kyc/web/kyc/finish/sumsub', params, false, true);
};
// 获取advance扫脸url
export const getAdvanceUrl = (params) => {
  return pull('/kyc/web/kyc/face-identity/url', params);
};
// 获取尼日利亚用户bvn/nin认证结果
export const getNGResult = () => {
  return pull('/kyc/web/kyc/ng/check-result');
};
// 获取advance扫脸结果,扫脸是否完成
export const getAdvanceResult = (params) => {
  return post('/kyc/web/kyc/ng/finish', params, false, true);
};
// kyc去认证前置风控
export const checkKycRisk = () => {
  return pull('/kyc/web/kyc/verify-risk/check');
};
//lego 提交证件照
export const submitKycOcr = (params) => {
  return post('/kyc/web/kyc/ocr', params, false, true);
};
// lego 获取advance扫脸结果,扫脸是否完成
export const getLegoAdvanceResult = (params) => {
  return post('/kyc/web/kyc/finish/lego', params, false, true);
};
// lego 获取advance扫脸url
export const getLegoAdvanceUrl = (params) => {
  return pull('/kyc/web/kyc/advance-liveness/url', params);
};
// 手动上传证件路径上报接口
export const submitIdImgs = (params) => {
  return post('/kyc/web/kyc/id/upload', params, false, true);
};
//自拍人脸照上传接口
export const submitSelfie = (params) => {
  return post('/kyc/web/kyc/selfie/upload', params, false, true);
};
//单证件照片iqa检测接口
export const checkImg = (params) => {
  return post('/kyc/web/kyc/id-image/check', params, false, true);
};
//kyc权益
export const getPrivileges = (params) => {
  return post('/kyc/web/kyc/privileges', params, false, true);
};
// kyc等级限额
export const getAmountLimit = (params) => {
  return post('/kyc/web/kyc/afterkyclimit', params, false, true);
};
//通用上传接口（手动上传证件/自拍人脸照片）
export const uploadImg = (params) => {
  return post('/kyc/web/kyc/file/upload', params);
};
// 尼日利亚bvn/nin 提交kyc1信息
export const submitNgKyc1 = (params) => post('/kyc/web/kyc/ng-primary/update', params, false, true);
//查询kyc打回状态
export const getKycClearInfo = (params) => {
  return pull('/kyc/kyc/clear/info', params);
};

//打回kyc
export const clearInfo = (params) => {
  return post('/kyc/kyc/clear?clearType=0', params);
};

/**
 * 是否需要做kyc引导
 * @param {string} biz // 业务线 default-kyc业务 kucard-支付业务 customer-客服业务 currency-现货业务 futures-合约业务 tradingbot-机器人业务 operation-平台运营
 */
export const getKycGuide = (params) => {
  return postJson(`${eKycPrefix}/common/kyc/guide`, params);
};

// kyc引导信息
export const getKycGuideContent = (params) => {
  return postJson(`${eKycPrefix}/common/kyc/guide/content`, params);
};

// 获取KYC3的福利信息
export const getKYC3RewardInfo = () => {
  return pull('/platform-reward/v2/newcomer/user-task/info');
};

/**
 * 福利中心新手任务步骤
 */
export const getRewardStatus = (params, headers) => {
  return pull('/platform-reward/newcomer/user/homepage/info', params, {
    headers,
  });
};

// sumsub跳过美国
export const getSumsubDelete = () => {
  return post('/kyc/web/kyc/sumsub/delete');
};

// 自助服务获取advance token
export const getAdvanceToken = () => {
  return pull('/kyc/kyc/lego/liveness-config');
};

// kyc人脸对比初级
export function kycCheckPic(query) {
  return post(`${eKycPrefix}/web/kyc/face/match/primary`, query, false, true);
}

// kyc人脸对比高级
export function kycCheckFace(query) {
  return post(`${eKycPrefix}/web/kyc/face/match/senior`, query, false, true);
}

/**
 * 获取银行法币账号信息，turkey专用接口
 */
export const getDepositAccount = () => {
  return pull(`${eKycPrefix}/kyc/funds/deposit-account`);
};

/**
 *
 * @typedef BannerInfoPayload
 * @prop {string} region 国家
 * @prop {"idcard"|"drivinglicense"|"passport"} identityType 证件类型
 * @prop {string} userId 用户长ID
 */

/**
 * 获取kyc引流的banner信息
 * https://k-devdoc.atlassian.net/wiki/spaces/Payment/pages/619972289/KYC
 * @param {BannerInfoPayload} query
 * @returns
 */
export const getBannerInfo = (query) => {
  return pull(`${eKycPrefix}/kyc/payment/kucard/banner`, query);
};

// PI - KYC准入认证列表
export const getFinanceList = (params) => {
  return pull('/kyc/web/compliance/finance/list', params);
};

// PI - 准入标准选择接口
export const postFinanceChoose = (params) => {
  return postJson('/kyc/web/compliance/finance/choose', params);
};

// 证件更新状态查询
export const getKycUpdateStatus = (params) => {
  return pull('/kyc/web/kyc/data/getUpdateStatus', params);
};

// 选择证件更新标准接口
export const postKycUpdateChoose = (params) => {
  return postJson('/kyc/web/kyc/data/createStandard', params);
};

/** 提交国家&证件 */
export const postCountryID = (params) => postJson('/kyc/web/kyc/primary/submit', params);

/** 获取认证页面的临时缓存 */
export const getTempValue = (params) =>
  pull('/kyc/web/kyc/compliance/getComplianceTempValue', params);

/** 缓存认证页面的临时值 */
export const postTempValue = (params) =>
  postJson('/kyc/web/kyc/compliance/saveComplianceTempValue', params);

/** 重新认证 */
export const postKycCancel = () => postJson('/kyc/kyc/cancel');

/** 根据国家获取支持的证件类型 */
export const getIdentityTypes = (params) => pull('/kyc/web/kyc/identityType/config', params);

/** 根据国家和证件类型获取州省数据 */
export const getKycState = (params) => pull('/kyc/web/kyc/state/list', params);

/** 开始 kyc认证，认证或重新认证在唤起中台前调用 */
export const postKycCreate = (params) => postJson('/kyc/web/kyc/compliance/create', params);

/** 取消本次 kyc 认证 */
export const postKycCancelV2 = (params) => postJson('/kyc/web/kyc/compliance/cancel', params);

/**
 * 根据标签查询 kyc 的认证状态，支持查询不同的 kyc 认证
 * @param {string} type
 */
export const getKycResultV2 = ({ type }) => {
  return pull('/kyc/web/kyc/compliance/result', { type });
};

/** 拉取居住地配置 */
export const getResidenceInfo = () => pull('/kyc/kyc/residenceRegion/info');

/** 拉取可选的居住地列表 */
export const getResidenceList = () => pull('/kyc/kyc/residence/regions');

/**
 * 拉取站点支持的国家列表
 * @param {string} siteType
 * @param {string} kycType
 */
export const pullSiteRegions = (params) => pull('/kyc/kyc/site/regions', params);

export const pullOcrResult = (params) => post('/kyc/web/kyc/finish/ocrResult', params, false, true);

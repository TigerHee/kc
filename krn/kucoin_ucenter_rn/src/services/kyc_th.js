import {pull, post} from 'utils/request';

/**
 * 获取kyc认证状态
 * @param {*} params {}
 * @returns
 * kycProcessStatus（kyc流程状态 -1:未发起 0:认证中 1:已完成）
 * kybProcessStatus（kyb流程状态 -1:未发起 0:认证中 1:已完成）
 * kycVerifyStatus（kyc认证状态 0:未通过 1:已通过）
 * kybVerifyStatus（kyb认证状态 0:未通过 1:已通过）
 */
export const getKycVerifyStatus = () => {
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     // 待认证
  //     // resolve({
  //     //   success: true,
  //     //   data: {
  //     //     kycProcessStatus: -1,
  //     //     kybProcessStatus: -1,
  //     //     kycVerifyStatus: 0,
  //     //     kybVerifyStatus: 0,
  //     //   },
  //     // });
  //     // KYC 认证中
  //     // resolve({
  //     //   success: true,
  //     //   data: {
  //     //     kycProcessStatus: 0,
  //     //     kybProcessStatus: -1,
  //     //     kycVerifyStatus: 0,
  //     //     kybVerifyStatus: 0,
  //     //   },
  //     // });
  //     // KYC 认证成功
  //     // resolve({
  //     //   success: true,
  //     //   data: {
  //     //     kycProcessStatus: 1,
  //     //     kybProcessStatus: -1,
  //     //     kycVerifyStatus: 1,
  //     //     kybVerifyStatus: 0,
  //     //   },
  //     // });
  //     // KYC 认证失败
  //     // resolve({
  //     //   success: true,
  //     //   data: {
  //     //     kycProcessStatus: 1,
  //     //     kybProcessStatus: -1,
  //     //     kycVerifyStatus: 0,
  //     //     kybVerifyStatus: 0,
  //     //   },
  //     // });
  //     // KYB 认证中
  //     // resolve({
  //     //   success: true,
  //     //   data: {
  //     //     kycProcessStatus: -1,
  //     //     kybProcessStatus: 0,
  //     //     kycVerifyStatus: 0,
  //     //     kybVerifyStatus: 0,
  //     //   },
  //     // });
  //     // KYB 认证成功
  //     // resolve({
  //     //   success: true,
  //     //   data: {
  //     //     kycProcessStatus: -1,
  //     //     kybProcessStatus: 1,
  //     //     kycVerifyStatus: 0,
  //     //     kybVerifyStatus: 1,
  //     //   },
  //     // });
  //     // KYB 认证失败
  //     resolve({
  //       success: true,
  //       data: {
  //         kycProcessStatus: -1,
  //         kybProcessStatus: 1,
  //         kycVerifyStatus: 0,
  //         kybVerifyStatus: 0,
  //       },
  //     });
  //   }, 1000);
  // });

  return pull('/kyc/web/kyc/verify/status');
};

// 新增查询 kyc 认证状态及失败原因等信息的接口
export const getKYCVerifyResult = () => {
  return pull('/kyc/web/kyc/verify/result/individual');
};

// 新增查询 kyb 认证状态及失败原因等信息的接口
// 没有联调，待未来增加 KYB 后联调
export const getKYBVerifyResult = () => {
  return pull('/kyc/web/kyc/verify/result/entity');
};

// 读取配置
export const getComplianceConfig = () => {
  return pull('/kyc/kyc/compliance/config');
};

// 记录用户操作
export const recordSelect = params => {
  return post('/kyc/web/kyc/compliance/record', params, false, true);
};

export async function getPrivileges() {
  return post('/kyc/web/kyc/thailand/privileges', {}, false, true);
}

// advance 状态
export const getAdvanceStatus = params => {
  return pull('/kyc/web/compliance/thailand/advance/result', params);
};

// 开始advance流程
export const postAdvance = params => {
  return post(
    '/kyc/web/compliance/thailand/advance/choose',
    params,
    false,
    true,
  );
};

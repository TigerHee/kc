/**
 * Owner: odan.ou@kupotech.com
 */
import { post, postJson } from 'tools/request';

//#region 司法协查

/**
 * 获取验证码
 * @param {{
 *  email: string,
 *  type: number,
 * }} params type=>1注册、2登录、修改密码是3
 */
export const legalVerifyCode = (params) => {
  return postJson('/workbench-legal/account/verifyCode', params);
};

/**
 * 注册执法机构账户
 * @param {{
 *  email: string,
 *  password: string,
 *  verifyCode: string,
 * }} params
 */
export const legalRegister = (params) => {
  return postJson('/workbench-legal/account/register', params);
};

/**
 * 登录执法机构账户
 * @param {{
 *  email: string,
 *  password: string,
 *  verifyCode: string,
 * }} params
 * @returns { Promise<{ data: { token: string }}>}
 */
export const legalLogin = (params) => {
  return postJson('/workbench-legal/account/login', params);
};

/**
 * 重置密码（忘记密码）
 * @param {{
 *  email: string,
 *  password: string,
 *  verifyCode: string,
 * }} params
 */
export const legalResetPassword = (params) => {
  return postJson('/workbench-legal/account/forget', params);
};

/**
 * 登录用户身份证明（提交身份证明信息表单）
 * @param {{
 *  token: string,
 *  country: string,
 *  lawEnforcementAgencyFullName: string,
 *  lawEnforcementAgencyEmail: string,
 *  identificationProof: string[],
 * }} params
 */
export const legalUserVerify = (params) => {
  return postJson('/workbench-legal/judicialInvestigation/verify/request', params);
};

/**
 * 登录用户身份证明结果(身份证明信息验证结果)
 * @param {{
 *  token: string,
 * }} params
 * @returns { Promise<{ data: { status: number, reason?: string }}>}
 * 状态(status) -1:未提交身份证明 0待核验 1通过 2拒绝
 * 原因(reason) 状态为2时返回 拒绝理由
 */
export const legalUserVerifyRes = (params) => {
  return postJson('/workbench-legal/judicialInvestigation/verify/result', params);
};

/**
 * 文件上传
 * @param {{
 *  file: any,
 *  token: string,
 * }} params
 * @returns { Promise<{ data: { fileId: string, url: string }}>}
 */
export const legalUpload = (params) => {
  return post('/workbench-legal/file/uploadFile', params);
};

/**
 * 提交司法协查表单
 * @param {Record<string, any> & { token: string }} params
 * @returns
 */
export const addLegalRequests = (params) => {
  return postJson('/workbench-legal/judicialInvestigation/request', params);
};

//#endregion

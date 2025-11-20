/**
 * Owner: jessie@kupotech.com
 */
import { getUserApiKeysUsingGet1 } from 'api/ucenter';
import { post, pull } from 'tools/request';

const prefix = '/cyber-truck-vault';

/**
 * @description 获取用户API列表
 * @return {Promise<*>}
 */
export async function getApiList(subName = null) {
  if (subName) {
    // 获取子账号API 列表
    return pull(`${prefix}/v2/sub/api-keys`, { subName });
  }
  return getUserApiKeysUsingGet1({ baseUrl: prefix });
}

/**
 * @description 创建API
 * @param apiName api名称 必填 string
 * @param passphrase api密码 必填 string
 * @param authGroupMap 权限组信息 string
 * @param brokerId 第三方应用ID string
 * @param ipWhitelist ip白名单 string
 * @param ipWhitelistStatus ip白名单状态：0.禁用 1.启用 int
 * @param subName 子账户登录名 string
 * @return {Promise<*>}
 */
export async function createAPI(params = {}) {
  if (params.subName) {
    // 创建子账号API
    return post(`${prefix}/v2/sub/api-key`, params);
  }

  return post(`${prefix}/v2/api-key`, params);
}

/**
 * @description 删除API
 * @param id
 * @return {Promise<*>}
 */
export async function deleteAPI({ id, subName }) {
  if (subName) {
    // 删除子账号API
    return post(`${prefix}/sub/api-key/delete/${id}`, { subName });
  }
  return post(`${prefix}/api-key/delete/${id}`);
}

/**
 * @description 获取单个API信息
 * @param apiKey 必填 string
 * @return {Promise<*>}
 */
export async function getAPIDetail({ apiKey, subName }) {
  if (subName) {
    return pull(`${prefix}/v2/sub/api-key/detail`, { apiKey });
  }
  return pull(`${prefix}/v2/api-key/detail`, { apiKey });
}

/**
 * @description 更新API
 * @param apiKey apiKey 必填 string
 * @param ipWhitelistStatus ip白名单状态：0.禁用 1.启用 必填 int
 * @param authGroupMap 权限组信息 string
 * @param ipWhitelist ip白名单 string
 * @param subName 子账户登录名 string
 * @param brokerId 第三方应用ID string
 * @return {Promise<*>}
 */
export async function updateAPI(params) {
  if (params.subName) {
    // 更新子账号API
    return post(`${prefix}/v2/sub/api-key/update`, params);
  }
  return post(`${prefix}/v2/api-key/update`, params);
}

/**
 * 获取可用（已启用）api 的数量
 */
export async function getEnabledApi() {
  return pull(`${prefix}/v2/api-key/enable-count`);
}

// api ip 通知
export async function updateApiIpNoticeStatus(params) {
  return post(`${prefix}/update-apikey-ip-notice`, params);
}

export async function getApiIpNoticeStatus() {
  return pull(`${prefix}/get-apikey-ip-notice`);
}

/**
 * @description 获取rsaPubKey
 * @return {Promise<*>}
 */
export async function getRsaPubKey(params) {
  return post(`${prefix}/gen-rsa-key`, params);
}

/**
 * @description 激活api
 * @return {Promise<*>}
 */
export async function goActivate({ token }) {
  return post(`${prefix}/api-key/activate?token=${token}`);
}

/**
 * @description 重新发送激活邮件
 * @return {Promise<*>}
 */
export async function activateEmail({ apiKey }) {
  return post(`${prefix}/api-key/activation/resend?apiKey=${apiKey}`);
}

/**
 * @description 重发API授权邮件
 * @return {Promise<*>}
 */
export async function resendVerifyEmail({ verifyId }) {
  return post(`${prefix}/v2/api-key/resend-verify`, { verifyId });
}

/**
 * @description 创建API邮件授权
 * @return {Promise<*>}
 */
export async function verifyEmail({ verifyToken }) {
  return post(`${prefix}/v2/api-key/verify`, { verifyToken });
}

/**
 * @description 获取broker展示名
 * @return {Promise<*>}
 */
export async function getNameList() {
  return pull('/broker/broker/name-list');
}

/**
 * @description 用于获取获取创建API时的ip与权限
 * @return {Promise<*>}
 */
export async function getCreateInfo({ subName }) {
  return pull(`${prefix}/v2/api-key/create-info`, { subName });
}

// 获取broker api key列表
export async function queryBrokerApiKeyList() {
  return pull(`${prefix}/broker/nd/apikey`);
}

// 创建broker api key
export async function createBrokerApiKey(data) {
  return post(`${prefix}/broker/nd/apikey`, {
    passphrase: data.passphrase,
    apiName: data.apiName,
  });
}

// 删除broker api key
export async function deleteBrokerApiKey(data) {
  return post(`${prefix}/broker/nd/delete-apikey`, {
    apiKey: data.apiKey,
  });
}

/** 获取用户是否具有带单权限 */
export function pullIsLeadTraderAccount() {
  return pull('/ct-copy-trade/v1/copyTrading/isLeadTraderAccount');
}

/**
 * @description 用于获取获取创建跟单API时的ip与权限
 * @return {Promise<*>}
 */
export async function getCreateLeadTradeInfo() {
  return pull(`${prefix}/v2/api-key/create-leadtrade-info`);
}

/** 查询带单 api 列表 */
export async function getLeadTradeApiList() {
  return pull(`${prefix}/v2/leadtrade-api-keys`);
}

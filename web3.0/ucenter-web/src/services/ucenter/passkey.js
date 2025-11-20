/**
 * Owner: eli.xiang@kupotech.com
 */
// import { deletePasskeyUsingDelete } from 'api/ucenter';
import { del, post, postV2, pull } from 'tools/request';

const prefix = '/ucenter';

/**
 * 获取passkey注册选项信息
 * @param {*}
 */
export async function getPasskeyRegisterOptionsApi() {
  return pull(`${prefix}/passkey/register/options`);
}

/**
 * passkey注册
 * @param {*}
 */
export async function passkeyRegisterApi(data, headers) {
  console.log('passkeyRegisterApi data:', data);
  // return post(`${prefix}/passkey/register`, data, false, true);
  return postV2({ url: `${prefix}/v2/passkey/register`, data, isJson: false, headers });
}

/**
 * 获取passkey列表
 * @param {*}
 */
export async function getPasskeyListApi() {
  return pull(`${prefix}/passkey/list`);
}

/**
 * 更新passkey nickname
 * @param {*}
 */
export async function updatePasskeyApi(data) {
  return post(`${prefix}/passkey/update/nickname`, data);
}

/**
 * 删除passkey
 * @param {*}
 */
export async function deletePasskeyApi(queryData, options) {
  // return deletePasskeyUsingDelete(queryData, { baseUrl: prefix, ...options });
  return del(`${prefix}/v2/passkey/delete`, queryData, options);
}

/**
 * Owner: sean.shi@kupotech.com
 */
import { AxiosResponse } from 'axios';
import remoteEvent from 'tools/remoteEvent';
import { CLEAR_USER_CODE } from './constants';

const CLEAR_USER_API = [
  '/_api/ucenter/v2/aggregate-login',
  '/_api/ucenter/passkey-login',
  '/_api/ucenter/aggregate-login',
  '/_api/ucenter/external-login',
];

/**
 * @description 对于清退用户，打开提示弹窗
 * @param {接口返回} response
 * @returns 响应
 */
export async function clearUserInterceptor(response: AxiosResponse) {
  try {
    const { data } = response;
    const url = response?.config?.url;
    // 只有接口返回是清退用户错误码 & 接口需要是特定的接口
    if (data?.code === CLEAR_USER_CODE && url && CLEAR_USER_API.some(item => url.includes(item))) {
      // 打开清退用户提示弹窗, 返回 promise 是防止业务弹窗，toast 渲染出来
      await new Promise(() => {
        remoteEvent.emit(remoteEvent.evts.SHOW_CLEAR_USE_DIALOG);
      });
    }
  } catch (err) {
    console.log('err..', err);
  }
  return Promise.resolve(response);
}

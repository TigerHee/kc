/**
 * Owner: sean.shi@kupotech.com
 */
import remoteEvent from '@tools/remoteEvent';
import { CLEAR_USER_CODE } from './constants';

const CLEAR_USER_API = [
  '/ucenter/v2/aggregate-login',
  '/ucenter/passkey-login',
  '/ucenter/aggregate-login',
  '/ucenter/external-login',
];

/**
 * @description 对于清退用户，打开提示弹窗
 * @param {接口返回} response
 * @returns 响应
 */
export async function clearUserInterceptor(response) {
  try {
    const { data } = response;
    // 只有接口返回是清退用户错误码 & 接口需要是特定的接口
    if (data?.code === CLEAR_USER_CODE && CLEAR_USER_API.includes(response?.config?.url)) {
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

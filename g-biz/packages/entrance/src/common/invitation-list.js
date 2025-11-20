/**
 * Owner: sean.shi@kupotech.com
 */
import remoteEvent from '@tools/remoteEvent';
import { tenantConfig } from '@packages/entrance/src/config/tenant';
import { INVITATION_LIST_CODE } from './constants';

// 泰国站注册白名单拦截接口
const INVITATION_LIST_API = [
  // 发送邮箱验证码
  '/ucenter/register-email',
  '/ucenter/register-short-message',
];

/**
 * @description 对于不在泰国站的注册邀请名单用户，打开提示弹窗
 * @param {接口返回} response
 * @returns 响应
 */
export async function invitationListInterceptor(response) {
  try {
    const { data } = response;
    // 只有多站点配置注册邀请名单限制，注册发送验证码接口返回不在注册邀请名单用户时才会提示
    if (
      tenantConfig.signup.hasInvitationList &&
      data?.code === INVITATION_LIST_CODE &&
      INVITATION_LIST_API.includes(response?.config?.url)
    ) {
      // 打开提示弹窗, 返回 promise 是防止业务弹窗，toast 渲染出来
      await new Promise(() => {
        remoteEvent.emit(remoteEvent.evts.SHOW_INVITATION_LIST_DIALOG);
      });
    }
  } catch (err) {
    console.log('err..', err);
  }
  return Promise.resolve(response);
}

import { useUserStore } from '@/store/user';
import { toast } from '@kux/design';
import { addLangToPath } from '../i18n';

// 账户被冻结
const ACCOUNT_FROZEN = '4111';
// 安全验证检测到token登录失效
const LOGIN_INVALID = '280001';
// 未升级
const NO_UPGRADE = '4113';
// 用户碰撞检测
const CONFLICT = '500009';
// session 过期
const LOGIN_401 = '401';

const freezeWhitePaths = ['/freeze', '/freeze/apply'];

/**
 * 响应错误拦截器
 * 处理 HTTP 错误状态码
 */
const responseErrorInterceptor = (response: any) => {
  const status = response?.status;
  const { code = null, msg = null } = response.data || {};

  switch (code) {
    case LOGIN_INVALID:
      if (msg) toast.error(msg);
      window.location.href = addLangToPath('/ucenter/signin'); // 登录失效，要跳转到登录页面
      break;

    case LOGIN_401:
      // 更新用户状态为未登录
      useUserStore.setState({ isLogin: false, user: null });
      break;

    case ACCOUNT_FROZEN: // 用户被冻结，所有返回4111的接口触发跳转到freeze页面
      if (freezeWhitePaths.indexOf(window.location.pathname) === -1) {
        window.location.href = addLangToPath('/freeze');
      }
      break;

    case NO_UPGRADE: // 用户没有升级
      window.location.href = addLangToPath('/utransfer');
      break;

    case CONFLICT:
      // 设置用户碰撞检测弹窗状态
      useUserStore.setState({ conflictModal: true });
      break;

    case '403':
      break;

    default:
      break;
  }

  // 处理 HTTP 错误状态码
  switch (status) {
    case 401:
      // 更新用户状态为未登录
      useUserStore.setState({ isLogin: false, user: null });
      break;
    default:
      break;
  }

  return Promise.reject(response);
};

export { responseErrorInterceptor };

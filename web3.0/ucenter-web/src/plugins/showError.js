/**
 * Owner: willen@kupotech.com
 */
import {
  ACCOUNT_FROZEN,
  CHECK_LOGIN_SECURITY_FAILED,
  CONFLICT,
  LOGIN_401,
  LOGIN_INVALID,
  NO_UPGRADE,
  UNAUTH,
} from 'codes';
import SingletonRegisterModel from 'tools/SingletonRegisterModel';
import { push as routerPush } from 'utils/router';

// 绕过 babel-plugin-register-model 的静态检查，把 namespace 定义为常量
const LOGIN = 'login';
const USER = 'user';
const APP = 'app';
const ACCOUNT_FREEZE = 'account_freeze';

const __singletonRegisterModel__ = new SingletonRegisterModel();

const freezeWhitePaths = ['/freeze', '/freeze/apply'];

const onError = (error, dispatch) => {
  const { code = null, msg = null, level = null, response } = error;

  import('src/__models/base/app').then((m) => {
    __singletonRegisterModel__.add([m]);
  });

  switch (code) {
    case CHECK_LOGIN_SECURITY_FAILED:
      import('src/__models/ucenter/login').then((m) => {
        __singletonRegisterModel__.add([m]);
        dispatch({
          type: `${LOGIN}/update`,
          payload: { security: false, needActions: error.data.needActions },
        });
      });
      return;
    case LOGIN_INVALID:
      dispatch({ type: `${APP}/setToast`, payload: { type: 'error', message: msg } });

      routerPush('/ucenter/signin'); // 登录失效，要跳转到登录页面
      return;
    case LOGIN_401:
      import('src/__models/base/user').then((m) => {
        __singletonRegisterModel__.add([m]);
        dispatch({
          type: `${USER}/update`,
          payload: {
            isLogin: false,
            user: null,
          },
        });
      });
      // dispatch({ type: 'app/connectWs' });
      return;
    case ACCOUNT_FROZEN: // 用户被冻结，所有返回4111的接口触发跳转到freeze页面
      if (freezeWhitePaths.indexOf(window.location.pathname) === -1) {
        routerPush('/freeze');
      }
      import('src/__models/accountFreeze').then((m) => {
        __singletonRegisterModel__.add([m]);
        dispatch({
          type: `${ACCOUNT_FREEZE}/updateFrozenTime`,
          payload: {
            frozenTime: Number(error.data),
          },
        });
      });
      break;
    case UNAUTH:
      import('src/__models/base/app').then((m) => {
        __singletonRegisterModel__.add([m]);
        dispatch({ type: `${APP}/clearSessionData` });
      });
      return;
    case NO_UPGRADE: // 用户没有升级
      routerPush('/utransfer');
      return;
    case CONFLICT:
      import('src/__models/base/user').then((m) => {
        __singletonRegisterModel__.add([m]);
        dispatch({
          type: `${USER}/udpate`,
          payload: {
            conflictModal: true,
          },
        });
      });
      return;
    case '403':
      break;
    default:
      break;
  }

  if (msg && code !== '401') {
    if (level === 'warn') {
      dispatch({ type: `${APP}/setToast`, payload: { type: 'warning', message: msg } });
    } else {
      dispatch({ type: `${APP}/setToast`, payload: { type: 'info', message: msg } });
    }
    return;
  }

  if (response) {
    switch (response.status) {
      case 401:
        Promise.all([import('src/__models/base/app'), import('src/__models/base/user')]).then(
          (values) => {
            __singletonRegisterModel__.add(values);
            dispatch({ type: `${APP}/clearSessionData` });
            dispatch({ type: `${USER}/update`, payload: { isLogin: false } });
          },
        );
        break;
      default:
        break;
    }
  }
};

export default onError;

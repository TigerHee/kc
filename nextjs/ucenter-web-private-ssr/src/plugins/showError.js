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
} from '@/codes';
import Router from 'kc-next/router';
import { toast } from '@kux/design';

// 绕过 babel-plugin-register-model 的静态检查，把 namespace 定义为常量
// const LOGIN = 'login';
// const USER = 'user';
// const APP = 'app';
// const ACCOUNT_FREEZE = 'account_freeze';

const freezeWhitePaths = ['/freeze', '/freeze/apply'];

const onError = (error, dispatch) => {
  const { code = null, msg = null, level = null, response } = error;

  switch (code) {
    case CHECK_LOGIN_SECURITY_FAILED:
      dispatch({
        type: 'login/update',
        payload: { security: false, needActions: error.data.needActions },
      });
      return;
    case LOGIN_INVALID:
      toast.error(msg);

      Router.push('/ucenter/signin'); // 登录失效，要跳转到登录页面
      return;
    case LOGIN_401:
      dispatch({
        type: 'user/update',
        payload: {
          isLogin: false,
          user: null,
        },
      });
      // dispatch({ type: 'app/connectWs' });
      return;
    case ACCOUNT_FROZEN: // 用户被冻结，所有返回4111的接口触发跳转到freeze页面
      if (freezeWhitePaths.indexOf(window.location.pathname) === -1) {
        Router.push('/freeze');
      }
      dispatch({
        type: 'account_freeze/updateFrozenTime',
        payload: {
          frozenTime: Number(error.data),
        },
      });
      break;
    case UNAUTH:
      dispatch({ type: 'app/clearSessionData' });
      return;
    case NO_UPGRADE: // 用户没有升级
      Router.push('/utransfer');
      return;
    case CONFLICT:
      dispatch({
        type: 'user/udpate',
        payload: {
          conflictModal: true,
        },
      });
      return;
    case '403':
      break;
    default:
      break;
  }


  if (msg && code !== '401') {
    if (level === 'warn') {
      toast.warn(msg);
    } else {
      toast.error(msg);
    }
    return;
  }

  if (response) {
    switch (response.status) {
      case 401:
        dispatch({ type: 'app/clearSessionData' });
        dispatch({ type: 'user/update', payload: { isLogin: false } });
        break;
      default:
        break;
    }
  }
};

export default onError;

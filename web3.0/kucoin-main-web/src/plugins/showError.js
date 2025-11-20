/**
 * Owner: willen@kupotech.com
 */
/**
 * showError 依赖模型，babel-reigster-model 插件的存在，这里的模型依赖会被缓存起来。
 * 当执行到 App 渲染的时候，缓存的模型会统一注册并执行 subscriptions 造成阻塞
 * 所以这里添加异步加载模型并注册的逻辑
 */

import _ from 'lodash';
import {
  UNAUTH,
  // CHECK_LOGIN_SECURITY_FAILED,
  ACCOUNT_FROZEN,
  LOGIN_INVALID,
  LOGIN_401,
  NO_UPGRADE,
  CONFLICT,
} from 'codes';
import { push as routerPush } from 'utils/router';
import onUnhandledRejection from 'utils/onUnhandledRejection';
import { basename } from '@kucoin-base/i18n';
import SingletonRegisterModel from 'tools/SingletonRegisterModel';

const asyncMessage = (cb) => import('components/Toast').then((m) => cb(m.message));

// 绕过 babel-plugin-register-model 的静态检查，把 namespace 定义为常量
const USER = 'user';
const APP = 'app';
const ACCOUNT_FREEZE = 'account_freeze';

const __singletonRegisterModel__ = new SingletonRegisterModel();
const freezeWhitePaths = ['/freeze', '/freeze/apply'];

// unhandledRejection in browser
// let Raven;

let _handled = false;

if (!_handled) {
  _handled = true;

  // sentry in node for handing Exceptions
  // Raven = require('../../sentry/browser');
  // if (typeof Raven._promiseRejectionHandler === 'function') {
  //   // remove sentry default unhandledrejection and use our onUnhandledRejection
  //   self.removeEventListener('unhandledrejection', Raven._promiseRejectionHandler);
  // }
  onUnhandledRejection((ev) => {
    // console.log(ev);
    if (!(ev && ev._no_sentry)) {
      // Raven.captureException(ev);
    }
  });
}

const throttleDo = _.throttle((action) => {
  if (typeof action === 'function') {
    action.call(null);
  }
}, 1000);

const onError = (error, dispatch) => {
  const { code = null, msg = null, level = null, response } = error;
  let { pathname } = window.location;
  switch (code) {
    case LOGIN_INVALID:
      asyncMessage((message) => throttleDo(() => message.error(msg)));
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
      pathname = pathname.replace(basename, '/');
      if (freezeWhitePaths.indexOf(pathname) === -1) {
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
      return;
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
      asyncMessage((message) => throttleDo(() => message.warning(msg, 3)));
    } else {
      asyncMessage((message) => throttleDo(() => message.error(msg, 3)));
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

  // console.log(error);

  // if (!_IS_SERVER_) {
  //   if (Raven) {
  //     if (!(error && error._no_sentry)) {
  //       Raven.captureException(error);
  //     }
  //   }
  // }
};

export default onError;

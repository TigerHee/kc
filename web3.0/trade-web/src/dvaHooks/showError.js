/**
 * Owner: borden@kupotech.com
 */
import _ from 'lodash';
import {
  UNAUTH,
  CHECK_LOGIN_SECURITY_FAILED,
  ACCOUNT_FROZEN,
  LOGIN_INVALID,
  LOGIN_401,
  NO_UPGRADE,
} from 'codes';
import { siteCfg } from 'config';
import onUnhandledRejection from 'utils/onUnhandledRejection';
import getMainsiteLink from 'utils/getMainsiteLink';
import { addLangToPath } from 'utils/lang';

onUnhandledRejection((ev) => {
  // console.log(ev);
});

// throttle action
const throttleDo = _.throttle((action) => {
  if (typeof action === 'function') {
    action.call(null);
  }
}, 1000);

// router location
const routerPush = (path) => {
  window.location.href = addLangToPath(`${siteCfg.MAINSITE_HOST}${path}`);
};

export default function () {
  return {
    onError(error, dispatch) {
      const { code = null, msg = null, level = null, response } = error;

      switch (code) {
        case CHECK_LOGIN_SECURITY_FAILED:
          dispatch({
            type: 'login/update',
            payload: { security: false, needActions: error.data.needActions },
          });
          return;
        case UNAUTH:
        case LOGIN_401:
          dispatch({ type: 'app/clearSessionData' });
          return;
        case LOGIN_INVALID:
          throttleDo(() => {
            dispatch({
              type: 'notice/feed',
              payload: {
                type: 'message.error',
                message: msg,
              },
            });
          });
          {
            const { loginUrl } = getMainsiteLink();
            window.location.href = loginUrl; // 登录失效，要跳转到登录页面
          }
          return;
        case ACCOUNT_FROZEN: // 用户被冻结，所有返回4111的接口触发跳转到freeze页面
          routerPush('/freeze');
          return;
        case NO_UPGRADE: // 用户没有升级
          routerPush('/utransfer');
          return;
        case '403':
          break;
        default:
          break;
      }

      if (msg && code !== '401') {
        if (level === 'warning') {
          throttleDo(() => {
            dispatch({
              type: 'notice/feed',
              payload: {
                type: 'message.warning',
                message: msg,
              },
            });
          });
        } else {
          throttleDo(() => {
            dispatch({
              type: 'notice/feed',
              payload: {
                type: 'message.error',
                message: msg,
              },
            });
          });
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
    },
  };
}

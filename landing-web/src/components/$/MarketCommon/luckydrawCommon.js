/**
 * Owner: jesse.shao@kupotech.com
 */
import { message } from 'antd';
import JsBridge from 'utils/jsBridge';
import { addLangToPath } from 'utils/lang';
import { KUCOIN_HOST } from 'utils/siteConfig';

export const handleJoin = async params => {
  const { dispatch, namespace, activityName, regToast } = params;
  const { data } = await dispatch({
    type: `${namespace}/activityReg`,
    payload: { activityName },
  });
  if (!!data && regToast[data]) {
    message[regToast[data].type](regToast[data].msg);
    dispatch({
      type: `${namespace}/getRegStatus`,
      payload: { activityName },
    });
  }
};

export const handleLogin = (isInApp, supportCookieLogin, loginBackUrl) => {
  if (isInApp && supportCookieLogin) {
    JsBridge.open({
      type: 'jump',
      params: {
        url: '/user/login',
      },
    });
    return;
  }
  const currentSearch = window.location.search;
  const searchValue = currentSearch
    ? `${currentSearch}&backUrl=${loginBackUrl}`
    : `?backUrl=${loginBackUrl}`;
  const loginUrl = addLangToPath(`${KUCOIN_HOST}/ucenter/signin${searchValue}`);
  window.location.href = loginUrl;
};

export const handleSignup = (isInApp, supportCookieLogin, loginBackUrl) => {
  if (isInApp && supportCookieLogin) {
    JsBridge.open({
      type: 'jump',
      params: {
        url: '/user/register',
      },
    });
    return;
  }
  const currentSearch = window.location.search;
  const searchValue = currentSearch
    ? `${currentSearch}&backUrl=${loginBackUrl}`
    : `?backUrl=${loginBackUrl}`;
  const loginUrl = addLangToPath(`${KUCOIN_HOST}/ucenter/signup${searchValue}`);
  window.location.href = loginUrl;
};

export const goPage = options => {
  const { webUrl, h5Url, appUrl, isInApp, isMobile } = options || {};
  if (isInApp) {
    JsBridge.open({
      type: 'jump',
      params: {
        url: appUrl,
      },
    });
    return;
  }
  const pageUrl = isMobile ? h5Url : webUrl;
  const newWindow = window.open(pageUrl, '_blank');
  newWindow.opener = null;
};
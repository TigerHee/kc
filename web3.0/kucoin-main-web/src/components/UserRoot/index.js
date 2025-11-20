/*
 * @Owner: Melon@kupotech.com
 * @Author: Melon Melon@kupotech.com
 * @Date: 2023-06-15 10:42:37
 * @LastEditors: Melon Melon@kupotech.com
 * @LastEditTime: 2025-06-12 19:57:02
 * @FilePath: /kucoin-main-web/src/components/UserRoot/index.js
 * @Description:
 *
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import getIsInApp from 'utils/runInApp';
import { withRouter } from 'components/Router';
import requireProps from 'hocs/requireProps';
import { replace } from 'utils/router';
import { gotoAppLogin } from '@knb/native-bridge/lib/BizBridge';

const NO_BACK_URL_ROUTS = ['/account-sub/assets/:sub', '/account-sub/api-manager/:sub'];
@withRouter()
@connect((state) => {
  return {
    isLogin: state.user.isLogin,
    user: state.user.user,
  };
})
@requireProps({
  isLogin(v) {
    return v !== undefined;
  },
})
export default class UserRoot extends React.Component {
  static defaultProps = {
    path: '/ucenter/signin',
    needRedirect: true,
  };

  render() {
    const ssg = navigator.userAgent.indexOf('SSG_ENV') !== -1;
    const isInApp = getIsInApp();
    if (ssg) {
      return null;
    }

    const { isLogin, children, path, user, pathname, currentRoute, needRedirect } = this.props;
    if (!needRedirect) {
      return <React.Fragment>{children}</React.Fragment>;
    }

    let backUrl = window.location.href;
    // 自助服务页面退出登录后都返回到帮助中心首页,且再次登录的backUrl为空
    if (currentRoute.includes('/selfservice') || NO_BACK_URL_ROUTS.includes(currentRoute)) {
      backUrl = '';
    }
    if (isLogin) {
      const { status } = user || {};
      if (status === 9) {
        if (pathname !== '/utransfer') {
          replace('/utransfer');
          return null;
        }
      }
      return <React.Fragment>{children}</React.Fragment>;
    }
    // 如果在app中， 统一调起app的登录
    if (isInApp) {
      gotoAppLogin();
    }
    // web默认统一去登录页面
    replace(`${path}?backUrl=${encodeURIComponent(backUrl)}`);
    return null;
  }
}

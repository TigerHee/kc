/**
 * Owner: willen@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { withRouter } from 'components/Router';
import requireProps from 'hocs/requireProps';
import React from 'react';
import { connect } from 'react-redux';
import { matchPath } from 'react-router-dom';
import { replace } from 'utils/router';

const NO_BACK_URL_ROUTS = ['/account-sub/assets/:sub', '/account-sub/api-manager/:sub'];
/** SSG 可访问的不需要登陆态的路由白名单 */
const SSG_WITHOUT_LOGIN_ROUTES = ['/account/security/score'];
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

  constructor(props) {
    super(props);
    const { pathname } = props;
    let backUrl = window.location.href;
    if (NO_BACK_URL_ROUTS.some((path) => !!matchPath(pathname, { path, exact: true }))) {
      backUrl = '';
    }
    this.state = { backUrl };
  }

  onListenAppLogin = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'app/initApp' });
  };

  componentDidMount() {
    if (JsBridge.isApp()) {
      JsBridge.listenNativeEvent.on('onLogin', this.onListenAppLogin);
    }
  }

  componentWillUnmount() {
    if (JsBridge.isApp()) {
      JsBridge.listenNativeEvent.off('onLogin', this.onListenAppLogin);
    }
  }

  render() {
    const ssg = navigator.userAgent.indexOf('SSG_ENV') !== -1;
    const isInApp = JsBridge.isApp();
    if (ssg) {
      if (SSG_WITHOUT_LOGIN_ROUTES.includes(this.props.pathname)) {
        return <React.Fragment>{children}</React.Fragment>;
      }
      return null;
    }

    const { isLogin, children, path, user, pathname, needRedirect } = this.props;
    if (!needRedirect) {
      return <React.Fragment>{children}</React.Fragment>;
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
      // 调起logout方法时，安卓会监听接口返回的code。只要接口返回280003就会弹出提示“检测到环境变化请重新登录”， 并弹出登陆页面，退出h5回到app首页
      // ios不会退出h5回到app
      JsBridge.open(
        {
          type: 'func',
          params: { name: 'logout' },
          // 为了保持安卓和ios统一， 都退出h5
        },
        () => {
          JsBridge.open(
            {
              type: 'jump',
              params: { url: '/user/login' },
            },
            () => {
              JsBridge.open({
                type: 'func',
                params: { name: 'exit' },
              });
            },
          );
        },
      );
      return null;
    }
    // web默认统一去登录页面
    replace(`${path}?backUrl=${encodeURIComponent(this.state.backUrl)}`);
    return null;
  }
}

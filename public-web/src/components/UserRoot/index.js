/**
 * Owner: willen@kupotech.com
 */
import { withRouter } from 'components/Router';
import requireProps from 'hocs/requireProps';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { replace } from 'utils/router';

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
    const { isLogin, children, path, user, pathname, currentRoute, needRedirect } = this.props;

    if (!needRedirect) {
      return <React.Fragment>{children}</React.Fragment>;
    }

    let backUrl = window.location.href;
    if (['/account-sub/assets/:sub', '/account-sub/api-manager/:sub'].includes(currentRoute)) {
      backUrl = '';
    }
    if (isLogin) {
      const { status } = user || {};
      if (status === 9) {
        if (pathname !== '/utransfer') {
          return <Redirect to="/utransfer" />;
        }
      }
      return <React.Fragment>{children}</React.Fragment>;
    }
    replace(`${path}?backUrl=${encodeURIComponent(backUrl)}`);
    return null;
    // return <Redirect to={`${path}?backUrl=${encodeURIComponent(backUrl)}`} />;
  }
}

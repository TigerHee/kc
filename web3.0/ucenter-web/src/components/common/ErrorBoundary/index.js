/**
 * Header 错误边界组件
 * 防止header组件内部异常导致全屏白屏
 */
import { Component } from 'react';
import { sentryReport } from 'tools/sentry';

export const SCENE_MAP = {
  root: {
    header: 'root_header',
    body: 'root_body',
    footer: 'root_footer',
    ada: 'root_ada',
  },
  login: {
    index: 'login_page',
    remoteLogin: 'login_remoteLogin',
    remoteLoginCL: 'login_remoteLoginCL',
  },
  signup: {
    index: 'signup_page',
    signupLayout: 'signup_signupLayout',
  },
  oauth: {
    index: 'oauth_page',
    restrictNotice: 'oauth_restrictNotice',
    header: 'oauth_header',
    authorize: 'oauth_authorize',
    login: 'oauth_login',
    siteRedirect: 'oauth_siteRedirect',
  },
  accountSecurity: {
    configPage: 'accountSecurity_configPage',
    bot: 'accountSecurity_bot',
    phone: {
      index: 'accountSecurity_phone_index',
      unbindIndex: 'accountSecurity_phone_unbind',
      appIntro: 'accountSecurity_phone_appIntro',
      bindAndModify: 'accountSecurity_phone_bindAndModify',
      phoneComponent: 'accountSecurity_phone_phoneComponent',
    },
    g2fa: {
      index: 'accountSecurity_g2fa_index',
    },
    email: {
      index: 'accountSecurity_email_index',
      unbindIndex: 'accountSecurity_email_unbindIndex',
    },
    tradePassword: {
      index: 'accountSecurity_tradePassword_index',
    },
    loginPassword: {
      index: 'accountSecurity_loginPassword_index',
    },
    passkey: {
      index: 'accountSecurity_passkey_index',
    },
  },
  forgetPwd: {
    index: 'forgetPwd_index',
    bot: 'forgetPwd_bot',
  },
};

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // 更新state，下次渲染将显示fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    // 更新state存储错误信息
    this.setState({
      errorInfo,
    });

    const errorType = `ucenter_web_${this.props.scene}_error_boundary`;

    sentryReport({
      message: error?.message,
      level: 'error',
      tags: {
        errorType,
      },
      extra: {
        errorInfo: errorInfo?.componentStack,
      },
      fingerprint: [errorType],
    });
  }

  render() {
    if (this.state.hasError) {
      return <div />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

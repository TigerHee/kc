/**
 * Header 错误边界组件
 * 防止header组件内部异常导致全屏白屏
 */
import React, { Component, ReactNode } from 'react';
import { sentryReport } from '@/core/telemetryModule';

interface Props {
  scene: string;
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export const SCENE_MAP = {
  root: {
    app: 'root_app',
    header: 'root_header',
    body: 'root_body',
    footer: 'root_footer',
    bot: 'root_bot',
  },
  signin: {
    index: 'signin_page',
    remoteLogin: 'signin_remoteLogin',
  },
  signup: {
    index: 'signup_page',
    signupLayout: 'signup_signupLayout',
    signupLayoutGbiz: 'signup_signupLayout_gbiz',
  },
  resetPassword: {
    index: 'resetPassword_page',
    resetPasswordGbiz: 'resetPassword_gbiz'
  },
  oauth: {
    index: 'oauth_page',
    restrictNotice: 'oauth_restrictNotice',
    header: 'oauth_header',
    authorize: 'oauth_authorize',
    login: 'oauth_login',
    siteRedirect: 'oauth_siteRedirect',
  },
} as const;

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // 更新state，下次渲染将显示fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 更新state存储错误信息
    this.setState({
      errorInfo,
    });

    const errorType = `ucenter-web-ssr_${this.props.scene}_error_boundary`;

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
      return (
        <div />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

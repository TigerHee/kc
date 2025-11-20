/**
 * Header 错误边界组件
 * 防止header组件内部异常导致全屏白屏
 */
import React, { Component, ReactNode } from 'react';
import { sentryReport } from '../../common/tools';

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
  forgetPwd: {
    index: 'forgetPwd',
    inputAccount: 'forgetPwd_inputAccount',
    resetPwd: 'forgetPwd_resetPwd',
  },
  login: {
    accountInput: 'login_accountInput',
    accountInputWithDrawer: 'accountInputWithDrawer',
    loginDrawer: 'login_loginDrawer',
    fusionSignIn: 'login_fusionSignIn',
    fusionSigninCaptcha: 'login_fusionSignin_capcha',
    inputAccount: 'login_inputAccount',
    validateForm: 'login_validateForm',
    mailAuthorize: 'login_mainAuthorize',
    thirdPartyAccountDiversion: 'login_thirdPartyAccountDiversion',
    thirdPartySimpleSignup: 'login_thirdPartySimpleSignup',
    multiDeviceDialog: 'login_multiDeviceDialog',
    clearUserDialog: 'login_clearUserDialog',
    updateTermDialogVisible: 'login_updateTermDialogVisible',
    updatePwdTipDialog: 'login_updatePwdTipDialog',
  },
  loginCL: {
    loginWithTheme: 'loginCL_loginWithTheme',
    fusionSigninCaptcha: 'loginCL_fusionSignin_capcha',
    inputAccount: 'loginCL_inputAccount',
    validateForm: 'loginCL_validateForm',
    mailAuthorize: 'loginCL_mainAuthorize',
    multiDeviceDialog: 'loginCL_multiDeviceDialog',
  }
}

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

    const errorType = `entrance_${this.props.scene}_error_boundary`;

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

/**
 * 错误边界组件
 * 防止组件内部异常导致全屏白屏
 */
import { Component } from 'react';
import { sentryReport } from '@/core/telemetryModule';

export const SCENE_MAP = {
  root: {
    header: 'root_header',
    body: 'root_body',
    footer: 'root_footer',
    ada: 'root_ada',
    index: 'root_index',
    accountLayoutMenu: 'root_account_layout_menu',
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
  account: {
    index: 'account_page',
    examineTips: 'account_examin_tips',
    baseInfo: 'account_base_info',
    getStarted: 'account_get_started',
    balance: 'account_balance',
    market: 'account_market',
    vipInfo: 'account_vip_info',
    banner: 'account_banner',
    announcement: 'account_announcement',
    download: 'account_download',
    setPasswordDialog: 'account_set_password_dialog',
    beginnerDialog: 'account_beginner_dialog',
    userPromptDialog: 'account_user_prompt_dialog',
    passkeyDialog: 'account_passkey_dialog',
    updatePwdTipDialog: 'account_pwd_tip_dialog',
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
    wordType: {
      index: 'accountSecurity_wordType_index',
    },
    deleteAccount: {
      index: 'accountSecurity_deleteAccount_index',
    },
  },
  forgetPwd: {
    index: 'forgetPwd_index',
    bot: 'forgetPwd_bot',
  },
  guidanceZBX: {
    index: 'guidance_index',
  },
  escrowAccount: {
    index: 'escrow_account_index',
  },
  authorizeResult: {
    index: 'authorize_result_index',
  },
  freeze: {
    index: 'freeze_index',
    apply: 'freeze_apply_index',
  },
  freezing: {
    index: 'freezing_index',
  },
  kyc: {
    index: 'kyc_index',
    kyc_setup_country_of_issue: 'kyc_setup_country_of_issue',
    kyc_setup_identity_type: 'kyc_setup_identity_type',
    kyc_setup_method: 'kyc_setup_method',
    kyc_setup_ocr: 'kyc_setup_ocr',
    kyc_home: 'kyc_home',
    kyc_migrate: 'kyc_migrate',
    kyb_setup: 'kyb_setup',
    kyb_migrate: 'kyb_migrate',
    kyb_certification: 'kyb_certification',
    kyc_institutional_kyc: 'kyc_institutional_kyc',
    kyb_home: 'kyb_home',
  },
  subAccount: {
    index: 'subAccount_index',
    api_manager: 'subAccount_api_manager',
    api_create: 'subAccount_api_create',
    api_create_security: 'subAccount_api_create_security',
    api_edit: 'subAccount_api_edit',
    api_edit_presecurity: 'subAccount_api_edit_presecurity',
    api_edit_postsecurity: 'subAccount_api_edit_postsecurity',
    history: 'subAccount_history',
  },
  resetSecurity: {
    index: 'accountSecurity_resetSecurity_index',
    token: 'accountSecurity_resetSecurity_token',
    address: 'accountSecurity_resetSecurity_address',
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

    const errorType = `ucenter_web_private_ssr_${this.props.scene}_error_boundary`;

    console.error('ErrorBoundary caught an error:', errorType, error, errorInfo);

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

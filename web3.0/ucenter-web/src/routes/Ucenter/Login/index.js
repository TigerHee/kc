/**
 * Owner: willen@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { Box, styled, useSnackbar } from '@kux/mui';
import ErrorBoundary, { SCENE_MAP } from 'components/common/ErrorBoundary';
import { useQueryParams } from 'components/Entrance/hookTool';
import { DEFAULT_JUMP_ROUTE, DEFAULT_JUMP_ROUTE_CL } from 'config/base';
import { tenantConfig } from 'config/tenant';
import { checkUrlIsSafe } from 'helper';
import { AccountPageOpener, setAccountPageOpener } from 'hooks/usePasskeyGuide';
import { useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ACCOUNT_TYPE } from 'src/constants';
import { addLangToPath, _t, _tHTML } from 'tools/i18n';
import { sentryReport } from 'tools/sentry';
import { push } from 'utils/router';
import storage from 'utils/storage';
import RemoteLogin from './RemoteLogin';
import RemoteLoginCL from './RemoteLoginCL';

const FastClick = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  & a {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 700;
    text-decoration: underline;
    cursor: pointer;
  }
`;

function getUrlSearch() {
  return window.location.search || '';
}

export default () => {
  useLocale();
  const { back, isThird, backUrl } = useQueryParams();
  const { message } = useSnackbar();
  // 是否刚登陆成功
  const isFromLoginAccount = useRef(false);

  const isLogin = useSelector((state) => state.user.isLogin);

  const verifyCanNotUseClick = useCallback((token) => {
    push(addLangToPath(`/ucenter/reset-security/token/${token}`));
  }, []);

  const loginSuccess = (data) => {
    isFromLoginAccount.current = true;
    message.success(_t('operation.succeed'));
    const defaultJumpRoute = addLangToPath(
      tenantConfig.common.useCLLogin ? DEFAULT_JUMP_ROUTE_CL : DEFAULT_JUMP_ROUTE,
    );
    let targetUrl = defaultJumpRoute;
    console.log('login data data:', data);
    const { finishUpgrade, type: accountType, uid } = data;
    // 优先使用backUrl跳转
    if (backUrl) {
      // backUrl 不能使用 addLangToPath 包裹，因为如果 backUrl 中是跨站点的链接，使用 addLangToPath 无法匹配跨站点的语言 base
      targetUrl = window._CHECK_BACK_URL_IS_SAFE_?.(backUrl) ? backUrl : defaultJumpRoute;
    } else if (isThird) {
      // back 和 backUrl 一样的
      targetUrl = checkUrlIsSafe(back) ? back : defaultJumpRoute;
    } else {
      if (finishUpgrade) {
        targetUrl = defaultJumpRoute;
      } else {
        targetUrl = addLangToPath(`${window.location.origin}/utransfer`);
      }
    }
    // 主账号登录后才开启passkey引导
    if (
      targetUrl.includes(
        tenantConfig.common.useCLLogin ? DEFAULT_JUMP_ROUTE_CL : DEFAULT_JUMP_ROUTE,
      ) &&
      accountType === ACCOUNT_TYPE.Normal
    ) {
      setAccountPageOpener(uid, AccountPageOpener.loginSuccess);
    }
    // 必须保证 targetUrl 如果不是从 backUrl、back 中获取的，都需要使用 addLangToPath 包裹
    window.location.href = targetUrl;
  };

  // 如果登陆页面在 App 中，则使用 App 原生登陆功能
  useEffect(() => {
    const onListenAppLogin = () => {
      let targetUrl = '';
      // 如果有 backUrl, 使用 backUrl
      if (backUrl) {
        targetUrl = window._CHECK_BACK_URL_IS_SAFE_?.(backUrl) ? backUrl : '';
      } else if (isThird) {
        // 如果是三方调过来的，使用 back
        targetUrl = checkUrlIsSafe(back) ? back : '';
      }
      // 如果有 targetUrl, 重定向过去
      if (targetUrl) {
        window.location.href = targetUrl;
      } else if (document.referrer !== '') {
        // 如果有 referrer 说明是从上个页面跳转过来的, 返回到上一个 url
        history.goBack();
      } else if (JsBridge.isApp()) {
        JsBridge.open({
          type: 'jump',
          params: { url: '/home' },
        });
      }
    };
    // 监听登陆成功事件, 安卓登陆成功直接回到首页，IOS 还会停留在 Webview 页面
    if (JsBridge.isApp()) {
      JsBridge.listenNativeEvent.on('onLogin', onListenAppLogin);
    }

    // 在 App 中，打开 App 原生登陆页面
    if (JsBridge.isApp()) {
      sentryReport({
        level: 'warning',
        message: `signin page open in app. referrer url: ${document.referrer}, backUrl: ${
          backUrl || back
        }`,
        tags: {
          errorType: 'signin_in_app',
        },
      });
      JsBridge.open({
        type: 'jump',
        params: { url: '/user/login' },
      });
    }
    return () => {
      // 组件销毁注销事件
      if (JsBridge.isApp()) {
        JsBridge.listenNativeEvent.off('onLogin', onListenAppLogin);
      }
    };
  }, [back, backUrl, isThird]);

  useEffect(() => {
    // 如果不是刚登陆成功
    // 如果是登陆态，不能在 app 中，则跳转
    if (!JsBridge.isApp() && isLogin && !isFromLoginAccount.current) {
      // 如果是 claim 站点，跳转到 claim 路由
      window.location.href = addLangToPath(
        tenantConfig.common.useCLLogin ? DEFAULT_JUMP_ROUTE_CL : DEFAULT_JUMP_ROUTE,
      );
    }
  }, [isLogin]);

  return (
    <Box width="100%" style={{ height: '100%' }}>
      {tenantConfig.common.useCLLogin ? (
        <ErrorBoundary scene={SCENE_MAP.login.remoteLoginCL}>
          <RemoteLoginCL
            loginKey={storage.getItem('login_key')}
            showLoginSafeWord
            onForgetPwdClick={() => {
              push('/ucenter/reset-password');
            }}
            verifyCanNotUseClick={verifyCanNotUseClick}
            onSuccess={loginSuccess}
          />
        </ErrorBoundary>
      ) : (
        <ErrorBoundary scene={SCENE_MAP.login.remoteLogin}>
          <RemoteLogin
            loginKey={storage.getItem('login_key')}
            showLoginSafeWord
            forgetBottom={
              <FastClick
                data-inspector="signin_signup_btn"
                className="fastText"
                onClick={(e) => {
                  if (e?.target?.tagName === 'A') {
                    push(`/ucenter/signup${getUrlSearch()}`);
                  }
                }}
              >
                {_tHTML('fast.signup')}
              </FastClick>
            }
            onSuccess={loginSuccess}
            onForgetPwdClick={() => {
              push('/ucenter/reset-password');
            }}
            verifyCanNotUseClick={verifyCanNotUseClick}
          />
        </ErrorBoundary>
      )}
    </Box>
  );
};

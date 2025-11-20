/**
 * Owner: tiger@kupotech.com
 */
import JsBridge from 'gbiz-next/bridge';
import { useSnackbar } from '@kux/mui';
import { useQueryParams } from '@/components/Entrance/hookTool';
import { DEFAULT_JUMP_ROUTE, DEFAULT_JUMP_ROUTE_CL, ACCOUNT_TYPE } from '@/config/base';
import { getTenantConfig } from '@/tenant';
import { checkUrlIsSafe } from '@/tools/helper';
import { AccountPageOpener, setAccountPageOpener } from '@/hooks/usePasskeyGuide';
import { useCallback, useEffect } from 'react';
import { addLangToPath } from '@/tools/i18n';
import useTranslation from '@/hooks/useTranslation';
import { sentryReport } from '@/core/telemetryModule';
import { useRouter } from 'kc-next/compat/router';
import storage from 'gbiz-next/storage';
import { useLoginJump } from '@/hooks/useLoginJump';
import ErrorBoundary, { SCENE_MAP } from '@/components/ErrorBoundary';
import RemoteLogin from './RemoteLogin';
import RemoteLoginCL from './RemoteLoginCL';
import styles from './styles.module.scss';

function getUrlSearch() {
  return window.location.search || '';
}

export default ({ query }: { query?: Record<string, string> }) => {
  const router = useRouter();
  const { t: _t, Trans } = useTranslation();
  const { back, isThird, backUrl } = useQueryParams(query);
  const { message } = useSnackbar();
  const tenantConfig = getTenantConfig();

  const verifyCanNotUseClick = useCallback(
    (token) => {
      window.location.href = addLangToPath(`/ucenter/reset-security/token/${token}`);
    },
    [],
  );

  const loginSuccess = (data) => {
    message.success(_t('operation.succeed'));
    const defaultJumpRoute = addLangToPath(
      tenantConfig.common.useCLLogin ? DEFAULT_JUMP_ROUTE_CL : DEFAULT_JUMP_ROUTE,
    );
    let targetUrl = defaultJumpRoute;
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
    console.log('login data data:', data);
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

  useLoginJump();

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
        history.back();
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

  return (
    <section className={styles.page} data-inspector="signin_page">
      <ErrorBoundary scene={SCENE_MAP.signin.remoteLogin}>
        {tenantConfig.common.useCLLogin ? (
          <RemoteLoginCL
            query={query}
            loginKey={storage.getItem('login_key')}
            showLoginSafeWord
            onForgetPwdClick={() => {
              router?.push('/ucenter/reset-password');
            }}
            verifyCanNotUseClick={verifyCanNotUseClick}
            onSuccess={loginSuccess}
          />
        ) : (
          <RemoteLogin
            query={query}
            loginKey={storage.getItem('login_key')}
            showLoginSafeWord
            forgetBottom={
              <div
                className={styles.fastClick}
                data-inspector="signin_signup_btn"
                onClick={(e) => {
                  if ((e.target as HTMLElement)?.tagName === 'A') {
                    router?.push(`/ucenter/signup${getUrlSearch()}`);
                  }
                }}
              >
                <Trans i18nKey="fast.signup" components={{ a: <a /> }} />
              </div>
            }
            onSuccess={loginSuccess}
            onForgetPwdClick={() => {
              router?.push('/ucenter/reset-password');
            }}
            verifyCanNotUseClick={verifyCanNotUseClick}
          />
        )}
      </ErrorBoundary>
    </section>
  );
};

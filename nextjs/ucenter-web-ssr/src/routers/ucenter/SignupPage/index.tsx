import { useMktVisible } from 'gbiz-next/hooks';
import styles from './styles.module.scss';
import JsBridge from 'gbiz-next/bridge';
import { SignupLayout } from './Layout';
import {
  useNewcomerBannerBackground,
  useQueryParams,
} from '@/components/Entrance/hookTool';
import { sentryReport } from '@/core/telemetryModule';
import { useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'kc-next/compat/router';
import { addLangToPath } from '@/tools/i18n';
import storage from 'gbiz-next/storage';
import { addSpmIntoQuery } from '@/tools/formatUrlWithLang';
import { gtag_report_conversion } from '@/tools/helper';
import { getUrlSearch } from '@/utils/searchToJson';
import ErrorBoundary, { SCENE_MAP } from '@/components/ErrorBoundary';
import { useLoginJump } from '@/hooks/useLoginJump';

export function SignupPage() {
  const { showMktContent } = useMktVisible();
  useNewcomerBannerBackground(); // 修改注册页面的banner
  const { backUrl } = useQueryParams();
  const router = useRouter();

  const trackFbRegister = useCallback((options) => {
    if (
      typeof window !== 'undefined' &&
      window.fbq &&
      typeof window.fbq === 'function'
    ) {
      const _data = typeof options === 'object' ? options : {};
      const { uid } = _data;
      window.fbq('track', 'CompleteRegistration', {
        content_nam: uid,
      });
    }
  }, []);

  const uet_report_conversion = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.uetq = window.uetq || [];
      window.uetq.push('event', 'signup', { event_category: 'register' });
    }
  }, []);

  const yandexRegister = useCallback(() => {
    if (typeof window !== 'undefined' && window.ym) {
      window.ym(84577030, 'reachGoal', 'registration');
    }
  }, []);
  const handleChange = useCallback(
    (data) => {
      let blockID = '';
      if (data && data.$$blockID) {
        blockID = data.$$blockID;
      }
      let redirectUrl = '';
      if (
        typeof window !== 'undefined' &&
        window._CHECK_BACK_URL_IS_SAFE_ &&
        window._CHECK_BACK_URL_IS_SAFE_(backUrl)
      ) {
        redirectUrl = backUrl;
      } else {
        redirectUrl = addLangToPath('/account');
        // 注册成功跳到资产页，资产页消费该标志，在kucoin-main-web中
        storage.setItem('showRegisterBeginnerGuide', true);
      }
      if (blockID) {
        redirectUrl = addSpmIntoQuery(redirectUrl, [blockID, '1']);
      }
      trackFbRegister(data);
      uet_report_conversion();
      yandexRegister();
      gtag_report_conversion();
      window.location.href = redirectUrl;
    },
    [backUrl, trackFbRegister, uet_report_conversion, yandexRegister]
  );

  const initAccount = useMemo(() => {
    const signupData = storage.getItem('signup.account') || {};
    // 如果缓存中的类型是手机号，则注册默认值为 手机区号 + 手机号
    if (signupData && signupData.type === 'phone') {
      const initPhoneCode = storage.getItem('signup.phoneCode') || '';
      return { initPhone: signupData.value, initPhoneCode };
    } else {
      // 缓存中的类型是邮箱，注册默认值为邮箱
      return { initEmail: signupData.value };
    }
  }, []);

  useLoginJump();

  useEffect(() => {
    // 在 App 中，打开 App 原生注册页面，App 注册完成直接跳转到 KYC页面了，不会再到当前 Webview
    if (JsBridge.isApp()) {
      sentryReport({
        level: 'warning',
        message: `signup page open in app. referrer url: ${document.referrer}, backUrl: ${backUrl}`,
        tags: {
          errorType: 'signup_in_app',
        },
      });
      JsBridge.open(
        {
          type: 'jump',
          params: { url: '/user/register' },
        },
        () => {
          JsBridge.open({
            type: 'func',
            params: { name: 'exit' },
          });
        }
      );
    }
  }, [backUrl]);

  return (
    <div data-inspector="signup_page" className={styles.page}>
      <div className={styles.formContainer}>
        <ErrorBoundary scene={SCENE_MAP.signup.signupLayout}>
          <SignupLayout
            showMktContent={showMktContent}
            initPhone={initAccount?.initPhone}
            initEmail={initAccount?.initEmail}
            initPhoneCode={initAccount?.initPhoneCode} // 注册页完成三方登录授权跳往登录页
            onChange={handleChange}
            onThirdPartyLoginAuthorizeComplete={() => {
              // 提前切换到账号登录（二维码登录流程会有异常）
              storage.removeItem('login_key');
              router?.push(`/ucenter/signin${getUrlSearch()}`);
            }}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
}

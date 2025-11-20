/**
 * Owner: willen@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { useMktVisible } from '@kucoin-biz/hooks';
import { Box, isPropValid, styled, useTheme } from '@kux/mui';
import loadable from '@loadable/component';
import ErrorBoundary, { SCENE_MAP } from 'components/common/ErrorBoundary';
import { useNewcomerBannerBackground, useQueryParams } from 'components/Entrance/hookTool';
import LottieProvider from 'components/LottieProvider';
import { Link, withRouter } from 'components/Router';
import { tenantConfig } from 'config/tenant';
import { gtag_report_conversion } from 'helper';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import storage from 'src/utils/storage';
import bonusDark from 'static/ucenter/signUp/bonus_dark.png';
import bonus from 'static/ucenter/signUp/bonus_light.png';
import { addLangToPath, _t, _tHTML } from 'tools/i18n';
import { sentryReport } from 'tools/sentry';
import { addSpmIntoQuery, trackClick } from 'utils/ga';
import { push } from 'utils/router';
import { SIGN_UP_BTN_TEXT_KEY } from './config';

const SignUpLayout = loadable(() => import('./SignUpLayout'));

const SignupFormContainer = styled.div`
  height: 100%;
`;

function getUrlSearch() {
  return window.location.search || '';
}

const RightHeaderRoot = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ theme }) => {
  return {
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '130%',
    '& .fastText': {
      color: theme.colors.text60,
      marginBottom: 0,
      '& a': {
        color: theme.colors.text,
        fontWeight: 700,
        textDecoration: 'underline',
        cursor: 'pointer',
      },
    },
  };
});

const SignupBox = styled(Box)`
  // 翻转图标和文案的位置
  .KuxBox-root .KuxButton-root {
    flex-direction: row-reverse;
  }
`;

const BonusImg = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 4px;
`;

const ExLottieProvider = styled(LottieProvider)`
  width: 24px;
  height: 24px;
  margin-right: 4px;
`;

export default withRouter()((props) => {
  const { showMktContent } = useMktVisible();
  useNewcomerBannerBackground(); // 修改注册页面的banner
  const { backUrl, signUpType, ignoreKycCheck } = useQueryParams();

  const theme = useTheme();

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

  useLocale();
  const dispatch = useDispatch();

  const agreeJSX = useMemo(() => _tHTML('term.user.agree'), []);
  const handleClickLogin = () => {
    trackClick(['LogIn', '1'], {
      before_click_element_value: '',
      after_click_element_value: 'Log in',
    });
  };

  const forgetLeft = useMemo(
    () => (
      <RightHeaderRoot>
        <Link
          data-inspector="signup_had_account_btn"
          className="fastText"
          to={`/ucenter/signin${getUrlSearch()}`}
          onClick={handleClickLogin}
        >
          {_tHTML('already.had.account')}
        </Link>
      </RightHeaderRoot>
    ),
    [],
  );

  useEffect(() => {
    //初始化校验类型
    dispatch({ type: 'security_new/sec_init', payload: { bizType: 'REGISTER' } });
  }, []);

  const trackFbRegister = useCallback((options) => {
    if (typeof window.fbq === 'function') {
      const _data = typeof options === 'object' ? options : {};
      const { uid } = _data;
      window.fbq('track', 'CompleteRegistration', {
        content_nam: uid,
      });
    }
  }, []);

  const uet_report_conversion = useCallback(() => {
    window.uetq = window.uetq || [];
    window.uetq.push('event', 'signup', { event_category: 'register' });
  }, []);

  const yandexRegister = useCallback(() => {
    if (typeof window.ym === 'function') {
      window.ym(84577030, 'reachGoal', 'registration');
    }
  }, []);

  const singUpBtnText = useMemo(() => {
    let _text = null;
    if (tenantConfig.signup.isBtnUseDefaultText) {
      return _t('69e2446aaf9e4000a105'); // 本地站都用素文案
    }
    if (signUpType) {
      const _key = SIGN_UP_BTN_TEXT_KEY[signUpType];
      if (_key) {
        _text = typeof _key === 'function' ? _key() : _key; // 自定义文案
      }
    } else {
      if (!showMktContent) {
        _text = _t('69e2446aaf9e4000a105');
      }
    }
    return _text;
  }, [signUpType, showMktContent]);

  const handleChange = useCallback(
    (data) => {
      let blockID = '';
      if (data && data.$$blockID) {
        blockID = data.$$blockID;
      }
      let redirectUrl = '';
      if (window._CHECK_BACK_URL_IS_SAFE_(backUrl)) {
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
    [backUrl, trackFbRegister, uet_report_conversion, yandexRegister],
  );

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
        },
      );
    }
  }, [backUrl]);

  return (
    <SignupBox width="100%" height="100%">
      <SignupFormContainer>
        <ErrorBoundary scene={SCENE_MAP.signup.signupLayout}>
          <SignUpLayout
            singUpBtnText={singUpBtnText}
            ignoreKycCheck={ignoreKycCheck}
            agreeJSX={agreeJSX}
            forgetLeft={forgetLeft}
            onChange={handleChange}
            bonusImg={
              showMktContent && tenantConfig.signup.isShowMktContent ? (
                <BonusImg alt="bonus" src={theme.currentTheme === 'light' ? bonus : bonusDark} />
              ) : null
            }
            initPhone={initAccount?.initPhone}
            initEmail={initAccount?.initEmail}
            initPhoneCode={initAccount?.initPhoneCode}
            showMktContent={showMktContent}
            // 注册页完成三方登录授权跳往登录页
            onThirdPartyLoginAuthorizeComplete={() => {
              // 提前切换到账号登录（二维码登录流程会有异常）
              storage.removeItem('login_key');
              push(`/ucenter/signin${getUrlSearch()}`);
            }}
            rcode={props.query.rcode}
          />
        </ErrorBoundary>
      </SignupFormContainer>
    </SignupBox>
  );
});

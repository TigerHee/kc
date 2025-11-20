/**
 * Owner: willen@kupotech.com
 */
import { Spin, styled, useTheme } from '@kux/mui';
import { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useOauthLogin from '@hooks/useOauthLogin';
import { kcsensorsManualTrack } from '@utils/sensors';
import login_telegram_icon from '../../../static/login_telegram.svg';
import login_google_icon from '../../../static/login_google.svg';
import login_apple_icon from '../../../static/login_apple.svg';
import login_apple_dark_icon from '../../../static/login_apple_dark.svg';
import { NAMESPACE, THIRD_PARTY_LOGIN_PLATFORM } from '../../Login/constants';
import { useLang } from '../../hookTool';

const ThirdPartyLoginWrapper = styled.div`
  margin-top: 20px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 16px;
  }
`;

const LoginTitle = styled.div`
  height: 32px;
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text40};
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  span {
    padding: 0 12px;
  }
  &::before {
    content: '';
    height: 1px;
    flex: 1;
    background-color: ${({ theme }) => theme.colors.cover12};
  }
  &::after {
    content: '';
    height: 1px;
    flex: 1;
    background-color: ${({ theme }) => theme.colors.cover12};
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    height: 18px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  ${(props) => props.theme.breakpoints.down('sm')} {
    gap: 12px;
  }
`;
const LoginButton = styled.div`
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 34px;
  border: 1px solid ${({ theme }) => theme.colors.cover12};
  flex: 1;
  padding: 0 30px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  img {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
  span {
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    height: 40px;
  }
`;

const GoogleLoginBox = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0.001;
  width: 100%;
  overflow: hidden;
  transform: scale(1.3);
`;

const ThirdPartyLogin = ({ onSuccess, onAuthorizeComplete, multiSiteConfig, showTitle = true }) => {
  const dispatch = useDispatch();
  const googleLoginButtonRef = useRef(null);
  const oauthLogin = useOauthLogin('TELEGRAM,GOOGLE,APPLE');
  const loginLoading = useSelector((state) => state[NAMESPACE].loginLoading);
  const { t } = useLang();
  const { currentTheme } = useTheme();

  const supportTelegram = multiSiteConfig?.accountConfig?.supportExtAccounts?.includes('telegram');
  const supportGoole = multiSiteConfig?.accountConfig?.supportExtAccounts?.includes('google');
  const supportApple = multiSiteConfig?.accountConfig?.supportExtAccounts?.includes('apple');
  const hasThirdParty = supportTelegram || supportGoole || supportApple;

  // extInfo: 第三方返回的完整对象
  // extPlatform: 第三方平台标识，如：TELEGRAM、APPLE、GOOGLE
  const submitLoginInfo = (extInfo, extPlatform) => {
    kcsensorsManualTrack({ spm: ['thirdAuthorizationResult', extPlatform] });
    // 三方授权通过的自定义埋点
    kcsensorsManualTrack(
      {
        spm: ['thirdAccount', '1'],
        data: { accountType: extPlatform, authorityResult: 'success' },
      },
      'thirdAccountLogin',
    );
    onAuthorizeComplete?.();
    dispatch({
      // 新的三方注册流程
      type: `${NAMESPACE}/thirdPartyLoginSubmit`,
      payload: { extInfo, extPlatform },
      onSuccess: (data) => {
        kcsensorsManualTrack(
          { spm: ['thirdAccount', '1'], data: { accountType: extPlatform, '2faCheck': 'success' } },
          'thirdAccountLogin',
        );
        // 三方账号直接登录成功
        kcsensorsManualTrack(
          {
            spm: ['thirdAccount', '1'],
            data: {
              accountType: extPlatform,
              whichProcess1: 'login',
              loginResult: 'success',
              loginType: 'thirdAccount',
            },
          },
          'thirdAccountLogin',
        );
        onSuccess?.(data);
      },
    });
  };
  const submitLoginInfoRef = useRef(submitLoginInfo);
  submitLoginInfoRef.current = submitLoginInfo;

  // Telegram 三方登陆点击
  const telegramHandle = async () => {
    // 防止重复点击
    if (loginLoading) return;
    kcsensorsManualTrack({ spm: ['thirdAccount', 'TELEGRAM'] }, 'page_click');
    kcsensorsManualTrack(
      {
        spm: ['thirdAccount', 'telegram'],
        data: {
          before_click_element_value: '',
          after_click_element_value: 'Telegram',
          is_login: false,
        },
      },
      'page_click',
    );

    try {
      const { data } = await oauthLogin.TELEGRAM?.login();
      submitLoginInfoRef.current(data, 'TELEGRAM');
    } catch (e) {
      kcsensorsManualTrack(
        {
          spm: ['thirdAccount', '1'],
          data: { accountType: 'TELEGRAM', authorityResult: e?.msg || 'fail' },
        },
        'thirdAccountLogin',
      );
    }
  };

  // Google 三方登陆点击
  const googleHandle = () => {
    kcsensorsManualTrack(
      {
        spm: ['thirdAccount', 'google'],
        data: {
          before_click_element_value: '',
          after_click_element_value: 'Google',
          is_login: false,
        },
      },
      'page_click',
    );
    kcsensorsManualTrack({ spm: ['thirdAccount', 'GOOGLE'] }, 'page_click');
  };

  // apple 三方登陆点击
  const appleHanle = async () => {
    // 防止重复点击
    if (loginLoading) return;
    kcsensorsManualTrack(
      {
        spm: ['thirdAccount', 'apple'],
        data: {
          before_click_element_value: '',
          after_click_element_value: 'Apple',
          is_login: false,
        },
      },
      'page_click',
    );
    kcsensorsManualTrack({ spm: ['thirdAccount', 'APPLE'] }, 'page_click');

    try {
      const { data } = await oauthLogin.APPLE?.login();
      // format一下数据
      submitLoginInfoRef.current(
        {
          via: 'web',
          identityToken: data?.authorization?.id_token,
          authorizationCode: data?.authorization?.code,
        },
        'APPLE',
      );
    } catch (e) {
      kcsensorsManualTrack(
        {
          spm: ['thirdAccount', '1'],
          data: { accountType: 'APPLE', authorityResult: e?.msg || 'fail' },
        },
        'thirdAccountLogin',
      );
    }
  };

  useEffect(() => {
    if (oauthLogin?.TELEGRAM?.ready) {
      // 电报登录按钮曝光
      kcsensorsManualTrack({ spm: ['thirdAccount', 'TELEGRAM'] });
    }
  }, [oauthLogin?.TELEGRAM?.ready]);

  useEffect(() => {
    if (oauthLogin?.APPLE?.ready) {
      // 苹果登录按钮曝光
      kcsensorsManualTrack({ spm: ['thirdAccount', 'APPLE'] });
    }
  }, [oauthLogin?.APPLE?.ready]);

  // 绑定谷歌登录按钮到页面dom
  useEffect(() => {
    (async () => {
      if (oauthLogin?.GOOGLE?.ready) {
        // 谷歌登录按钮曝光
        kcsensorsManualTrack({ spm: ['thirdAccount', 'GOOGLE'] });
        try {
          await oauthLogin.GOOGLE.bind({
            renderButtonDom: googleLoginButtonRef.current,
            callback: (data) => {
              if (data?.data) {
                submitLoginInfoRef.current(data.data, 'GOOGLE');
              }
            },
          });
        } catch (e) {
          kcsensorsManualTrack(
            {
              spm: ['thirdAccount', '1'],
              data: { accountType: 'GOOGLE', authorityResult: e?.msg || 'fail' },
            },
            'thirdAccountLogin',
          );
        }
      }
    })();
  }, [oauthLogin.GOOGLE?.ready]);

  const isShowThirdPartyLogin = useMemo(() => {
    return ['telegram_domain', 'google_domain', 'apple_domain'].some(
      (domain) => oauthLogin?.oauthConfig?.[domain] === window.location.host,
    );
  }, [oauthLogin]);

  return isShowThirdPartyLogin ? (
    <ThirdPartyLoginWrapper>
      {showTitle && hasThirdParty && isShowThirdPartyLogin && (
        <LoginTitle>
          <span>{t('jbpawp11pFKgMF2sqfVata')}</span>
        </LoginTitle>
      )}
      <Spin spinning={oauthLogin.sdkLoading} size="small" type="normal">
        <ButtonGroup
          onClick={(e) => {
            e.stopPropagation();
            e.nativeEvent.stopPropagation();
          }}
        >
          {oauthLogin?.TELEGRAM?.ready && supportTelegram ? (
            <LoginButton id="login_telegram_btn" onClick={telegramHandle}>
              <img src={login_telegram_icon} alt="telegram_login" />
              <span>{THIRD_PARTY_LOGIN_PLATFORM(t).TELEGRAM.labelLocale}</span>
            </LoginButton>
          ) : null}
          {oauthLogin?.GOOGLE?.ready && supportGoole ? (
            <LoginButton id="login_google_btn" onClick={googleHandle}>
              <img src={login_google_icon} alt="google_login" />
              <span>{THIRD_PARTY_LOGIN_PLATFORM(t).GOOGLE.labelLocale}</span>
              <GoogleLoginBox ref={googleLoginButtonRef} />
            </LoginButton>
          ) : null}
          {oauthLogin?.APPLE?.ready && supportApple ? (
            <LoginButton id="login_apple_btn" onClick={appleHanle}>
              <img
                src={currentTheme === 'light' ? login_apple_icon : login_apple_dark_icon}
                alt="apple_login"
              />
              <span>{THIRD_PARTY_LOGIN_PLATFORM(t).APPLE.labelLocale}</span>
            </LoginButton>
          ) : null}
        </ButtonGroup>
      </Spin>
    </ThirdPartyLoginWrapper>
  ) : null;
};

export default ThirdPartyLogin;

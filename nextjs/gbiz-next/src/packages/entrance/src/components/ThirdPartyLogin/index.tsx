/**
 * Owner: sean.shi@kupotech.com
 */
import React, { useEffect, useMemo, useRef } from 'react';
import { Spin, useTheme } from '@kux/mui';
import { useOauthLogin } from 'hooks';
import { kcsensorsManualTrack } from 'tools/sensors';
import login_telegram_icon from '../../../static/login_telegram.svg';
import login_google_icon from '../../../static/login_google.svg';
import login_apple_icon from '../../../static/login_apple.svg';
import login_apple_dark_icon from '../../../static/login_apple_dark.svg';
import { THIRD_PARTY_LOGIN_PLATFORM } from '../../Login/constants';
import { useLang } from '../../hookTool';
import { useLoginStore, type IThirdPartyState } from '../../Login/model'; // 假设你的 zustand store 路径
import styles from './index.module.scss';

interface ThirdPartyLoginProps {
  onSuccess?: (data: any) => void;
  onAuthorizeComplete?: () => void;
  multiSiteConfig?: any;
  showTitle?: boolean;
}

const ThirdPartyLogin: React.FC<ThirdPartyLoginProps> = ({
  onSuccess,
  onAuthorizeComplete,
  multiSiteConfig,
  showTitle = true,
}) => {
  // zustand 获取 loginLoading
  const loginLoading = useLoginStore(state => state.loginLoading);
  const thirdPartyLoginSubmit = useLoginStore(state => state.thirdPartyLoginSubmit);

  const googleLoginButtonRef = useRef<HTMLDivElement>(null);
  const oauthLogin = useOauthLogin('TELEGRAM,GOOGLE,APPLE');
  const { t } = useLang();
  const { currentTheme } = useTheme();

  const supportTelegram = multiSiteConfig?.accountConfig?.supportExtAccounts?.includes('telegram');
  const supportGoole = multiSiteConfig?.accountConfig?.supportExtAccounts?.includes('google');
  const supportApple = multiSiteConfig?.accountConfig?.supportExtAccounts?.includes('apple');
  const hasThirdParty = supportTelegram || supportGoole || supportApple;

  // extInfo: 第三方返回的完整对象
  // extPlatform: 第三方平台标识，如：TELEGRAM、APPLE、GOOGLE
  const submitLoginInfo = (extInfo: any, extPlatform: IThirdPartyState['thirdPartyPlatform']) => {
    kcsensorsManualTrack({ spm: ['thirdAuthorizationResult', extPlatform] });
    kcsensorsManualTrack(
      {
        spm: ['thirdAccount', '1'],
        data: { accountType: extPlatform, authorityResult: 'success' },
      },
      'thirdAccountLogin'
    );
    onAuthorizeComplete?.();
    // 这里建议直接调用 zustand 的 thirdPartyLoginSubmit action
    thirdPartyLoginSubmit?.({
      payload: {
        extInfo,
        extPlatform,
      },
      onSuccess: (data: any) => {
        kcsensorsManualTrack(
          { spm: ['thirdAccount', '1'], data: { accountType: extPlatform, '2faCheck': 'success' } },
          'thirdAccountLogin'
        );
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
          'thirdAccountLogin'
        );
        onSuccess?.(data);
      },
    });
  };
  const submitLoginInfoRef = useRef(submitLoginInfo);
  submitLoginInfoRef.current = submitLoginInfo;

  // Telegram 三方登陆点击
  const telegramHandle = async () => {
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
      'page_click'
    );
    try {
      if (oauthLogin.TELEGRAM) {
        const { data } = await oauthLogin.TELEGRAM.login();
        submitLoginInfoRef.current(data, 'TELEGRAM');
      }
    } catch (e: any) {
      kcsensorsManualTrack(
        {
          spm: ['thirdAccount', '1'],
          data: { accountType: 'TELEGRAM', authorityResult: e?.msg || 'fail' },
        },
        'thirdAccountLogin'
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
      'page_click'
    );
    kcsensorsManualTrack({ spm: ['thirdAccount', 'GOOGLE'] }, 'page_click');
  };

  // apple 三方登陆点击
  const appleHanle = async () => {
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
      'page_click'
    );
    kcsensorsManualTrack({ spm: ['thirdAccount', 'APPLE'] }, 'page_click');
    try {
      if (oauthLogin.APPLE) {
        const { data } = await oauthLogin.APPLE.login();
        submitLoginInfoRef.current(
          {
            via: 'web',
            identityToken: data?.authorization?.id_token,
            authorizationCode: data?.authorization?.code,
          },
          'APPLE'
        );
      }
    } catch (e: any) {
      kcsensorsManualTrack(
        {
          spm: ['thirdAccount', '1'],
          data: { accountType: 'APPLE', authorityResult: e?.msg || 'fail' },
        },
        'thirdAccountLogin'
      );
    }
  };

  useEffect(() => {
    if (oauthLogin?.TELEGRAM?.ready) {
      kcsensorsManualTrack({ spm: ['thirdAccount', 'TELEGRAM'] });
    }
  }, [oauthLogin?.TELEGRAM?.ready]);

  useEffect(() => {
    if (oauthLogin?.APPLE?.ready) {
      kcsensorsManualTrack({ spm: ['thirdAccount', 'APPLE'] });
    }
  }, [oauthLogin?.APPLE?.ready]);

  useEffect(() => {
    (async () => {
      if (oauthLogin?.GOOGLE?.ready) {
        kcsensorsManualTrack({ spm: ['thirdAccount', 'GOOGLE'] });
        try {
          await oauthLogin.GOOGLE.bind({
            renderButtonDom: googleLoginButtonRef.current,
            callback: (data: any) => {
              if (data?.data) {
                submitLoginInfoRef.current(data.data, 'GOOGLE');
              }
            },
          });
        } catch (e: any) {
          kcsensorsManualTrack(
            {
              spm: ['thirdAccount', '1'],
              data: { accountType: 'GOOGLE', authorityResult: e?.msg || 'fail' },
            },
            'thirdAccountLogin'
          );
        }
      }
    })();
  }, [oauthLogin.GOOGLE?.ready]);

  const isShowThirdPartyLogin = useMemo(() => {
    return ['telegram_domain', 'google_domain', 'apple_domain'].some(
      domain => oauthLogin?.oauthConfig?.[domain] === (typeof window !== 'undefined' ? window.location.host : '')
    );
  }, [oauthLogin]);


  return isShowThirdPartyLogin ? (
    <div className={styles.thirdPartyLoginWrapper}>
      {showTitle && hasThirdParty && isShowThirdPartyLogin && (
        <div className={styles.loginTitle}>
          <span>{t('jbpawp11pFKgMF2sqfVata')}</span>
        </div>
      )}
      <Spin spinning={oauthLogin.sdkLoading} size="small" type="normal">
        <div
          className={styles.buttonGroup}
          onClick={e => {
            e.stopPropagation();
            e.nativeEvent.stopPropagation();
          }}
        >
          {oauthLogin?.TELEGRAM?.ready && supportTelegram ? (
            <div className={styles.loginButton} id="login_telegram_btn" onClick={telegramHandle}>
              <img src={login_telegram_icon} alt="telegram_login" />
              <span>{THIRD_PARTY_LOGIN_PLATFORM(t).TELEGRAM.labelLocale}</span>
            </div>
          ) : null}
          {oauthLogin?.GOOGLE?.ready && supportGoole ? (
            <div className={styles.loginButton} id="login_google_btn" onClick={googleHandle}>
              <img src={login_google_icon} alt="google_login" />
              <span>{THIRD_PARTY_LOGIN_PLATFORM(t).GOOGLE.labelLocale}</span>
              <div className={styles.googleLoginBox} ref={googleLoginButtonRef} />
            </div>
          ) : null}
          {oauthLogin?.APPLE?.ready && supportApple ? (
            <div className={styles.loginButton} id="login_apple_btn" onClick={appleHanle}>
              <img src={currentTheme === 'light' ? login_apple_icon : login_apple_dark_icon} alt="apple_login" />
              <span>{THIRD_PARTY_LOGIN_PLATFORM(t).APPLE.labelLocale}</span>
            </div>
          ) : null}
        </div>
      </Spin>
    </div>
  ) : null;
};

export default ThirdPartyLogin;

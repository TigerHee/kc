/**
 * Owner: sean.shi@kupotech.com
 */
import JsBridge from 'gbiz-next/bridge';
import { IS_SERVER_ENV } from 'kc-next/env';
import { useLocale } from 'hooks/useLocale';
import { Button, useTheme } from '@kux/design';
import { useInitialProps } from 'gbiz-next/InitialProvider';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AppIntro from 'src/components/common/AppIntro/index.js';
import { isIOS } from 'src/helper';
import g2faDarkIcon from 'static/account/security/g2fa_dark.png';
import g2faLightIcon from 'static/account/security/g2fa_light.png';
import { _t } from 'tools/i18n';
import { securityGoBack } from 'utils/router';
import BindAndModify from './BindAndModify';
import * as styles from './index.module.scss';

const STEPS = {
  AppIntro: 1,
  BindAndModify: 2,
};

const G2FAPage = () => {
  useLocale();
  const isLight = useTheme() === 'light';
  const [step, setStep] = useState(STEPS.AppIntro);
  const isUpdateG2fa = useSelector((state) => state.user.securtyStatus.GOOGLE2FA);
  const initialProps = useInitialProps();
  const isInApp = IS_SERVER_ENV ? initialProps?.['_platform'] === 'app' : JsBridge.isApp();

  const gotoBindAndModify = () => {
    setStep(STEPS.BindAndModify);
  };

  const handleBack = () => {
    // 绑定的时候也是回退到介绍页面
    if (JsBridge.isApp() || !isUpdateG2fa) {
      setStep(STEPS.AppIntro);
    } else {
      securityGoBack();
    }
  };

  const jump = (url) => {
    if (JsBridge.isApp()) {
      JsBridge.open({
        type: 'jump',
        params: {
          url: isIOS()
            ? `/external/link?url=${encodeURIComponent(url)}`
            : `/link?url=${encodeURIComponent(url)}`,
        },
      });
    } else {
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    if (JsBridge.isApp()) {
      /** 关闭 app loading 蒙层 */
      JsBridge.open({
        type: 'func',
        params: {
          name: 'onPageMount',
          dclTime: window.DCLTIME,
          pageType: window._useSSG ? 'SSG' : 'CSR', //'SSR|SSG|ISR|CSR'
        },
      });
    }
  }, []);

  useEffect(() => {
    // 在 App 中，或者是绑定谷歌验证，都不进入修改页面中
    if (!isInApp && isUpdateG2fa) {
      setStep(STEPS.BindAndModify);
    }
  }, [isInApp, isUpdateG2fa]);

  return (
    <>
      {step === STEPS.AppIntro && (
        <AppIntro
          account={isUpdateG2fa}
          pageTitle={_t('bf972e0460b74800a3e9')}
          icon={isLight ? g2faLightIcon : g2faDarkIcon}
          bindIntroInfo={{
            title: _t('4ace38ad1e4f4800aeec'),
            desc: _t('2841a12203e64000a4c0'),
            btnText: _t('a3bc45e407874800af99'),
            onBind: gotoBindAndModify,
            extra: (
              <>
                {isInApp ? (
                  isIOS() ? (
                    <Button
                      fullWidth
                      type="text"
                      className={`${styles.downloadApp} ${styles.downloadLink}`}
                      onClick={() => {
                        jump('itms-apps://itunes.apple.com/cn/app/id388497605?mt=8');
                      }}
                    >
                      {_t('c4fdf423965d4800a3ae')}
                    </Button>
                  ) : (
                    <>
                      <Button
                        fullWidth
                        type="text"
                        className={`${styles.downloadApp} ${styles.downloadLink}`}
                      >
                        <a
                          href="https://assets2.staticimg.com/apps/google/google_authenticator_v5.10.apk"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {_t('c4fdf423965d4800a3ae')}
                        </a>
                      </Button>
                      <Button
                        fullWidth
                        type="text"
                        className={styles.downloadLink}
                        onClick={() => {
                          jump(
                            'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2',
                          );
                        }}
                      >
                        {_t('7a7530d6b17a4800ade5')}
                      </Button>
                    </>
                  )
                ) : null}
              </>
            ),
          }}
          editIntroInfo={{
            title: _t('c4a05963f8514800a08e'),
            list: [{ title: _t('041a60cc08464800a9d7'), onClick: gotoBindAndModify }],
          }}
        />
      )}
      {step === STEPS.BindAndModify && <BindAndModify onBack={handleBack} />}
    </>
  );
};

export default G2FAPage;

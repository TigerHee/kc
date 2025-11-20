/**
 * Owner: sean.shi@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { useTheme } from '@kux/design';
import AppIntro from 'components/common/AppIntro/index.js';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { SecurityTipModal } from 'src/components/common/Modal';
import loginpasswordDarkIcon from 'static/account/security/loginpassword_dark.png';
import loginpasswordLightIcon from 'static/account/security/loginpassword_light.png';
import loginpasswordVerifyDarkIcon from 'static/account/security/loginpassword_verify_dark.png';
import loginpasswordVerifyLightIcon from 'static/account/security/loginpassword_verify_light.png';
import { _t } from 'tools/i18n';
import { securityGoBack } from 'utils/router';
import BindAndModify from './BindAndModify';
import * as styles from './index.module.scss';

const STEPS = {
  AppIntro: 1,
  BindAndModify: 2,
};

const PasswordPage = () => {
  useLocale();
  const isLight = useTheme() === 'light';
  const isInApp = JsBridge.isApp();
  const existLoginPsd = useSelector((state) => state.user.user.existLoginPsd);
  const isPullUserLoading = useSelector((state) => state.loading.effects['user/pullUser']);
  const initRef = useRef(true);
  const [step, setStep] = useState(isInApp ? STEPS.AppIntro : STEPS.BindAndModify);
  const [tipModalOpen, setTipModalOpen] = useState(false);
  const handleBack = () => {
    // 在 App 中，如果是修改登录密码，则直接返回介绍页面
    if (isInApp && existLoginPsd) {
      setStep(STEPS.AppIntro);
    } else {
      // 如果是设置密码，则直接退出
      securityGoBack();
    }
  };

  // 提示弹窗的取消按钮
  const handleTipModalCancel = () => {
    setTipModalOpen(false);
  };

  // 提示弹窗的确认按钮
  const handleTipModalOk = () => {
    setTipModalOpen(false);
    setStep(STEPS.BindAndModify);
  };

  const gotoModify = () => {
    setTipModalOpen(true);
  };

  useEffect(() => {
    // 如果已经弹出过一次，不再弹出
    if (!initRef.current) {
      return;
    }
    if (!isPullUserLoading) {
      initRef.current = false;
      // app 中设置登陆密码，直接到设置页面
      if (!existLoginPsd && isInApp) {
        setStep(STEPS.BindAndModify);
      }
    }
  }, [existLoginPsd, isInApp, isPullUserLoading]);

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

  return (
    <>
      {step === STEPS.AppIntro && (
        <AppIntro
          className={styles.appIntro}
          account={true}
          pageTitle={_t('login.password')}
          icon={isLight ? loginpasswordLightIcon : loginpasswordDarkIcon}
          editIntroInfo={{
            title: _t('c087bcad96eb4000a155'),
            list: [{ title: _t('176a9f44184d4000a328'), onClick: gotoModify }],
          }}
        />
      )}
      {step === STEPS.BindAndModify && <BindAndModify onBack={handleBack} />}
      <SecurityTipModal
        isOpen={tipModalOpen}
        iconUrl={isLight ? loginpasswordVerifyLightIcon : loginpasswordVerifyDarkIcon}
        onClose={handleTipModalCancel}
        onOk={handleTipModalOk}
        title={_t('2d2dbc2baf0e4000a270')}
        content={[<div key="1">{_t('7c96c965a1f04800a4ae')}</div>]}
      />
    </>
  );
};

export default PasswordPage;

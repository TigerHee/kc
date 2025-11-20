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
import tradepasswordDarkIcon from 'static/account/security/tradepassword_dark.png';
import tradepasswordLightIcon from 'static/account/security/tradepassword_light.png';
import tradepasswordVerifyDarkIcon from 'static/account/security/tradepassword_verify_dark.png';
import tradepasswordVerifyLightIcon from 'static/account/security/tradepassword_verify_light.png';
import { _t } from 'tools/i18n';
import { securityGoBack } from 'utils/router';
import BindAndModify from './BindAndModify';
import * as styles from './index.module.scss';

const STEPS = {
  AppIntro: 1,
  BindAndModify: 2,
};

const TradePasswordPage = () => {
  useLocale();
  const isLight = useTheme() === 'light';
  const isInApp = JsBridge.isApp();
  const existLoginPsd = useSelector((state) => state.user.user.existLoginPsd);
  const isPullUserLoading = useSelector((state) => state.loading.effects['user/pullUser']);
  const isPullSecurtyMethods = useSelector(
    (state) => state.loading.effects['user/pullSecurtyMethods'],
  );
  const isUpdateTradePassword = useSelector((state) => state.user.securtyStatus.WITHDRAW_PASSWORD);
  const initRef = useRef(true);
  const [step, setStep] = useState(isInApp ? STEPS.AppIntro : STEPS.BindAndModify);
  const [tipModalOpen, setTipModalOpen] = useState(false);

  const handleBack = () => {
    // 在 App 中，如果是修改交易密码，则直接返回介绍页面
    if (isInApp && isUpdateTradePassword) {
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
    if (!isPullUserLoading && !isPullSecurtyMethods) {
      initRef.current = false;
      // app 中设置交易密码，直接到设置页面
      if (!isUpdateTradePassword && isInApp) {
        setStep(STEPS.BindAndModify);
      }
    }
  }, [existLoginPsd, isInApp, isPullSecurtyMethods, isPullUserLoading, isUpdateTradePassword]);

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
          pageTitle={_t('trade.code')}
          icon={isLight ? tradepasswordLightIcon : tradepasswordDarkIcon}
          editIntroInfo={{
            title: _t('6f0da39b36e84800a6d3'),
            list: [{ title: _t('efd9e11420f94000a91e'), onClick: gotoModify }],
          }}
        />
      )}
      {step === STEPS.BindAndModify && <BindAndModify onBack={handleBack} />}
      <SecurityTipModal
        isOpen={tipModalOpen}
        iconUrl={isLight ? tradepasswordVerifyLightIcon : tradepasswordVerifyDarkIcon}
        onClose={handleTipModalCancel}
        onOk={handleTipModalOk}
        title={_t('b38a53c7a0f64000a151')}
        content={[<div key="1">{_t('f89ab5205d6a4000adcd')}</div>]}
      />
    </>
  );
};

export default TradePasswordPage;

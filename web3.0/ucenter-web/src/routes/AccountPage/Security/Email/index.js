/**
 * Owner: sean.shi@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { useTheme } from '@kux/design';
import AppIntro from 'components/common/AppIntro/index.js';
import { SecurityTipModal } from 'components/common/Modal';
import { tenantConfig } from 'config/tenant';
import { searchToJson } from 'helper';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import emailDarkIcon from 'static/account/security/email_dark.png';
import emailLightIcon from 'static/account/security/email_light.png';
import emailVerifyDarkIcon from 'static/account/security/email_verify_dark.png';
import emailVerifyLightIcon from 'static/account/security/email_verify_light.png';
import { _t } from 'tools/i18n';
import { push, securityGoBack } from 'utils/router';
import BindAndModify from './BindAndModify';

const STEPS = {
  AppIntro: 1,
  BindAndModify: 2,
};

const EmailPage = () => {
  useLocale();
  const isLight = useTheme() === 'light';
  const query = searchToJson();
  const isInApp = JsBridge.isApp();
  // 如果是手机中，直接从解绑跳转过来，就直接展示绑定内容页面
  const [step, setStep] = useState(isInApp ? STEPS.AppIntro : STEPS.BindAndModify);
  const [tipModalOpen, setTipModalOpen] = useState(query?.from === 'unbind');
  const user = useSelector((state) => state.user.user);

  // 提示弹窗的取消按钮
  const handleTipModalCancel = () => {
    setTipModalOpen(false);
  };

  // 提示弹窗的确认按钮
  const handleTipModalOk = () => {
    setTipModalOpen(false);
    setStep(STEPS.BindAndModify);
  };

  const gotoBind = () => {
    setStep(STEPS.BindAndModify);
  };
  const gotoModify = () => {
    setTipModalOpen(true);
  };

  const gotoUnbind = () => {
    push('/account/security/unbind-email?from=bind');
  };

  const handleBack = () => {
    if (isInApp) {
      setStep(STEPS.AppIntro);
    } else {
      securityGoBack();
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

  return (
    <>
      {step === STEPS.AppIntro && (
        <AppIntro
          account={user?.email}
          pageTitle={_t('email')}
          icon={isLight ? emailLightIcon : emailDarkIcon}
          bindIntroInfo={{
            title: _t('a16b1a2bae464000ae4e'),
            desc: _t('5a9765982a8c4800a9bb'),
            btnText: _t('uitERyPxPehqK9cbPo5Q8p'),
            onBind: gotoBind,
          }}
          editIntroInfo={{
            title: _t('9e75d8ed372f4000a1e1'),
            list: tenantConfig.account.showUnbindEmail
              ? [
                  { title: _t('pJ2h4eUnRuTzJ8CFM42zPa'), onClick: gotoModify },
                  { title: _t('aadEGFLFUT46uXHQaw4jPX'), onClick: gotoUnbind },
                ]
              : [{ title: _t('pJ2h4eUnRuTzJ8CFM42zPa'), onClick: gotoModify }],
          }}
        />
      )}
      {step === STEPS.BindAndModify && <BindAndModify onBack={handleBack} />}
      <SecurityTipModal
        isOpen={tipModalOpen}
        iconUrl={isLight ? emailVerifyLightIcon : emailVerifyDarkIcon}
        onClose={handleTipModalCancel}
        onOk={handleTipModalOk}
        title={_t('beb73bb4ca1f4800a260')}
        content={[
          <div key="1">
            1.&nbsp;
            {_t('bf7ca459e88b4800a090')}
          </div>,
          <div key="2">
            2.&nbsp;
            {_t('4bd521f4f8b14000a674')}
          </div>,
        ]}
      />
    </>
  );
};

export default EmailPage;

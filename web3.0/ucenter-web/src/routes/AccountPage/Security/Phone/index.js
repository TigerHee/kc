/**
 * Owner: sean.shi@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { useTheme } from '@kux/design';
import AppIntro from 'components/common/AppIntro/index.js';
import ErrorBoundary, { SCENE_MAP } from 'components/common/ErrorBoundary';
import { tenantConfig } from 'config/tenant';
import { searchToJson } from 'helper';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { SecurityTipModal } from 'src/components/common/Modal';
import phoneDarkIcon from 'static/account/security/phone_dark.png';
import phoneLightIcon from 'static/account/security/phone_light.png';
import phoneVerifyDarkIcon from 'static/account/security/phone_verify_dark.png';
import phoneVerifyLightIcon from 'static/account/security/phone_verify_light.png';
import { _t } from 'tools/i18n';
import { push, securityGoBack } from 'utils/router';
import BindAndModify from './BindAndModify';

const STEPS = {
  AppIntro: 1,
  BindAndModify: 2,
};

const PhonePage = () => {
  useLocale();
  const isLight = useTheme() === 'light';
  const query = searchToJson();
  const isInApp = JsBridge.isApp();
  // 如果是手机中，直接从解绑跳转过来，就直接展示绑定内容页面
  const [step, setStep] = useState(
    isInApp && query?.from !== 'unbind' ? STEPS.AppIntro : STEPS.BindAndModify,
  );
  const [tipModalOpen, setTipModalOpen] = useState(false);
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
    push('/account/security/unbind-phone?from=bind');
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
        <ErrorBoundary scene={SCENE_MAP.accountSecurity.phone.appIntro}>
          <AppIntro
            account={user?.phone}
            pageTitle={_t('phone')}
            icon={isLight ? phoneLightIcon : phoneDarkIcon}
            bindIntroInfo={{
              title: _t('a16b1a2bae464000ae4e'),
              desc: _t('0802d6e2c09b4000a1ab'),
              btnText: _t('mZXdwGfzr8y1CdgbFSDJBg'),
              onBind: gotoBind,
            }}
            editIntroInfo={{
              title: _t('9e75d8ed372f4000a1e1'),
              list: tenantConfig.account.showUnbindPhone
                ? [
                    { title: _t('437KygCfkQmF89XXDeduKr'), onClick: gotoModify },
                    { title: _t('soXJ7Z5jrJVDSe2TAB5SYP'), onClick: gotoUnbind },
                  ]
                : [{ title: _t('437KygCfkQmF89XXDeduKr'), onClick: gotoModify }],
            }}
          />
        </ErrorBoundary>
      )}
      {step === STEPS.BindAndModify && (
        <ErrorBoundary>
          <BindAndModify
            scene={SCENE_MAP.accountSecurity.phone.bindAndModify}
            onBack={handleBack}
          />
        </ErrorBoundary>
      )}
      <SecurityTipModal
        isOpen={tipModalOpen}
        iconUrl={isLight ? phoneVerifyLightIcon : phoneVerifyDarkIcon}
        onClose={handleTipModalCancel}
        onOk={handleTipModalOk}
        title={_t('87f1387d12b04000a804')}
        content={[
          <div key="1">1.&nbsp;{_t('2197e7056b704000a567')}</div>,
          <div key="2">2.&nbsp;{_t('2141e95f64ba4800ac4d')}</div>,
        ]}
      />
    </>
  );
};

export default PhonePage;

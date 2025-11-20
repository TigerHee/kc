/**
 * Owner: sean.shi@kupotech.com
 */
import JsBridge from 'gbiz-next/bridge';
import { useLocale } from 'hooks/useLocale';
import { goVerify } from 'gbiz-next/verification';
import { toast, useTheme } from '@kux/design';
import cls from 'classnames';
import AppIntro from 'components/common/AppIntro/index.js';
import { SecurityTipModal, SecurityUnbindTipModal, SuccessModal } from 'components/common/Modal';
import { searchToJson } from 'helper';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { tenantConfig } from 'src/config/tenant';
import emailDarkIcon from 'static/account/security/email_dark.png';
import emailLightIcon from 'static/account/security/email_light.png';
import emailSuccessDarkIcon from 'static/account/security/email_success_dark.png';
import emailSuccessLightIcon from 'static/account/security/email_success_light.png';
import emailVerifyDarkIcon from 'static/account/security/email_verify_dark.png';
import emailVerifyLightIcon from 'static/account/security/email_verify_light.png';
import { _t } from 'tools/i18n';
import { push, securityGoBack, securitySuccessKickout } from 'utils/router';
import { logoutAppWithoutSwitchSite } from 'utils/runInApp';
import * as styles from './index.module.scss';
import useResponsiveSSR from '@/hooks/useResponsiveSSR';

const STEPS = {
  AppIntro: 1,
  Unbind: 2,
};

const UnBind = ({
  onBack,
  gotoBindPhone,
  unbindTipModalOpen,
  setUnbindTipModalOpen,
  tipModalOpen,
  setTipModalOpen,
}) => {
  useLocale();
  const isLight = useTheme() === 'light';
  const rv = useResponsiveSSR();
  const isH5 = !rv?.sm;

  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const dispatch = useDispatch();

  const handleBack = () => {
    setTipModalOpen(false);
    onBack?.();
  };

  const handleUnbind = () => {
    setTipModalOpen(false);
    try {
      goVerify({
        bizType: 'RV_UNBIND_EMAIL',
        businessData: {
          operateType: 'UNBIND_EMAIL',
        },
        onSuccess: (res) => {
          dispatch({
            type: 'account_security/unbindEmail',
            payload: {
              headers: res.headers,
            },
          })
            .then(async () => {
              // 在 App 中，退出登录，不切换站点
              await logoutAppWithoutSwitchSite();
              setSuccessModalOpen(true);
            })
            .catch((e) => {
              console.log('err...', e);
              handleBack();
            });
        },
        onCancel: () => {
          handleBack();
        },
      });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className={cls(styles.container, isH5 && styles.containerH5)}>
      <SecurityUnbindTipModal
        isOpen={unbindTipModalOpen}
        iconUrl={isLight ? emailVerifyLightIcon : emailVerifyDarkIcon}
        onClose={() => {
          setUnbindTipModalOpen(false);
          onBack?.();
        }}
        onOk={() => {
          setUnbindTipModalOpen(false);
          gotoBindPhone();
        }}
        title={_t('b96931ee26304000a812')}
        content={_t('58ef2da286264000a599')}
        okText={_t('mZXdwGfzr8y1CdgbFSDJBg')}
      />
      <SecurityTipModal
        isOpen={tipModalOpen}
        iconUrl={isLight ? emailVerifyLightIcon : emailVerifyDarkIcon}
        onClose={handleBack}
        onOk={handleUnbind}
        title={_t('b96931ee26304000a812')}
        content={[
          <div key="1">
            1.&nbsp;
            {_t('a3607ca5f3314000aa49')}
          </div>,
          <div key="2">2.&nbsp;{_t('5c9e07ea78ee4000a50f')}</div>,
        ]}
      />

      <SuccessModal
        isOpen={successModalOpen}
        iconUrl={isLight ? emailSuccessLightIcon : emailSuccessDarkIcon}
        onClose={() => setSuccessModalOpen(false)}
        onOk={() => {
          setSuccessModalOpen(false);
          // web 中，确保跳转到登陆页是没有登陆态的
          if (!JsBridge.isApp()) {
            dispatch({
              type: 'account_security/unbindCallback',
            });
          }
          securitySuccessKickout();
        }}
        title={_t('405b6aceef884800a18b')}
        content={_t('5ccb8a89ddd94800a77d')}
      />
    </div>
  );
};

const UnbindEmailPage = () => {
  useLocale();
  const isLight = useTheme() === 'light';
  const isInApp = JsBridge.isApp();
  const query = searchToJson();
  const [step, setStep] = useState(isInApp ? STEPS.AppIntro : STEPS.Unbind);
  // app 中 如果从解绑来的，直接展示提示弹窗，否则展示介绍页面
  // web 中直接展示弹窗
  const [unbindTipModalOpen, setUnbindTipModalOpen] = useState(false);
  const [tipModalOpen, setTipModalOpen] = useState(false);
  const isPullUserLoading = useSelector((state) => state.loading.effects['user/pullUser']);
  const userPhone = useSelector((state) => state.user.user.phone);
  const userEmail = useSelector((state) => state.user.user.email);

  const gotoUnbind = () => {
    if (!userPhone) {
      setUnbindTipModalOpen(true);
    } else {
      setTipModalOpen(true);
    }
  };

  const gotoBindPhone = () => {
    push('/account/security/phone');
  };

  const gotoModify = () => {
    push('/account/security/email?from=unbind');
  };

  const handleBack = () => {
    if (isInApp) {
      // 如果是在 App 中，则回到 App 介绍页
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

  useEffect(() => {
    if (!isPullUserLoading) {
      // 如果没有设置邮箱，进入到解绑页面，自动退出
      if (!userEmail) {
        securityGoBack();
      } else if (JsBridge.isApp()) {
        // 从绑定页面到解绑的
        if (query?.from === 'bind') {
          if (!userPhone) {
            setUnbindTipModalOpen(true);
          } else {
            setTipModalOpen(true);
          }
        }
      } else {
        // 没有手机号，则先弹出去绑定手机弹窗
        if (!userPhone) {
          setUnbindTipModalOpen(true);
        } else {
          // 否则弹出解绑弹窗
          setTipModalOpen(true);
        }
      }
    }
  }, [isPullUserLoading, query?.from, userEmail, userPhone]);

  return (
    <>
      {step === STEPS.AppIntro && (
        <AppIntro
          account={userEmail}
          pageTitle={_t('email')}
          icon={isLight ? emailLightIcon : emailDarkIcon}
          bindIntroInfo={{
            title: _t('9e75d8ed372f4000a1e1'),
            desc: _t('5a9765982a8c4800a9bb'),
            btnText: _t('uitERyPxPehqK9cbPo5Q8p'),
            onBind: gotoModify,
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
      <UnBind
        unbindTipModalOpen={unbindTipModalOpen}
        setUnbindTipModalOpen={setUnbindTipModalOpen}
        tipModalOpen={tipModalOpen}
        setTipModalOpen={setTipModalOpen}
        onBack={handleBack}
        gotoBindPhone={gotoBindPhone}
      />
    </>
  );
};

export default UnbindEmailPage;

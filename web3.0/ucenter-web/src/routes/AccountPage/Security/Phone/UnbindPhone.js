/**
 * Owner: sean.shi@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { goVerify } from '@kucoin-gbiz-next/verification';
import { toast, useIsMobile, useTheme } from '@kux/design';
import cls from 'classnames';
import { tenantConfig } from 'config/tenant';
import { searchToJson } from 'helper';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppIntro from 'src/components/common/AppIntro/index.js';
import {
  SecurityTipModal,
  SecurityUnbindTipModal,
  SuccessModal,
} from 'src/components/common/Modal';
import phoneDarkIcon from 'static/account/security/phone_dark.png';
import phoneLightIcon from 'static/account/security/phone_light.png';
import phoneSuccessDarkIcon from 'static/account/security/phone_success_dark.png';
import phoneSuccessLightIcon from 'static/account/security/phone_success_light.png';
import phoneVerifyDarkIcon from 'static/account/security/phone_verify_dark.png';
import phoneVerifyLightIcon from 'static/account/security/phone_verify_light.png';
import { _t } from 'tools/i18n';
import { push, securityGoBack, securitySuccessKickout } from 'utils/router';
import { logoutAppWithoutSwitchSite } from 'utils/runInApp';
import * as styles from './index.module.scss';

const STEPS = {
  AppIntro: 1,
  Unbind: 2,
};

const UnBind = ({
  onBack,
  gotoBindEmail,
  unbindTipModalOpen,
  setUnbindTipModalOpen,
  tipModalOpen,
  setTipModalOpen,
}) => {
  useLocale();
  const isLight = useTheme() === 'light';
  const isH5 = useIsMobile();

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
        bizType: 'RV_UNBIND_PHONE',
        businessData: {
          operateType: 'UNBIND_PHONE',
        },
        onSuccess: (res) => {
          dispatch({
            type: 'account_security/unbindPhone',
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
        iconUrl={isLight ? phoneVerifyLightIcon : phoneVerifyDarkIcon}
        onClose={() => {
          setUnbindTipModalOpen(false);
          onBack?.();
        }}
        onOk={() => {
          setUnbindTipModalOpen(false);
          gotoBindEmail();
        }}
        title={_t('526da82d4e434000a2f5')}
        content={_t('d9dd67170d1e4800a747')}
        okText={_t('uitERyPxPehqK9cbPo5Q8p')}
      />

      <SecurityTipModal
        isOpen={tipModalOpen}
        iconUrl={isLight ? phoneVerifyLightIcon : phoneVerifyDarkIcon}
        onClose={handleBack}
        onOk={handleUnbind}
        title={_t('526da82d4e434000a2f5')}
        content={[
          <div key="1">
            1.&nbsp;
            {_t('bdf0e03580cb4000a46b')}
          </div>,
          <div key="2">2.&nbsp;{_t('c3c5cb905d764800aef3')}</div>,
        ]}
      />

      <SuccessModal
        isOpen={successModalOpen}
        iconUrl={isLight ? phoneSuccessLightIcon : phoneSuccessDarkIcon}
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
        title={_t('f658735a1c824800af43')}
        content={_t('1a6d9ec8e3804800ac35')}
      />
    </div>
  );
};

const UnbindPhonePage = () => {
  useLocale();
  const isInApp = JsBridge.isApp();
  const isLight = useTheme() === 'light';
  const query = searchToJson();
  const [step, setStep] = useState(isInApp ? STEPS.AppIntro : STEPS.Unbind);
  // app 中 如果从绑定来的，直接展示提示弹窗，否则展示介绍页面
  // web 中直接展示弹窗
  const [unbindTipModalOpen, setUnbindTipModalOpen] = useState(false);
  const [tipModalOpen, setTipModalOpen] = useState(false);
  const isPullUserLoading = useSelector((state) => state.loading.effects['user/pullUser']);
  const userPhone = useSelector((state) => state.user.user.phone);
  const userEmail = useSelector((state) => state.user.user.email);

  const gotoUnbind = () => {
    if (!userEmail) {
      setUnbindTipModalOpen(true);
    } else {
      setTipModalOpen(true);
    }
  };

  const gotoBindEmail = () => {
    push('/account/security/email');
  };

  const gotoModify = () => {
    push('/account/security/phone?from=unbind');
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
      // 如果没有设置手机号，进入到解绑页面，自动退出
      if (!userPhone) {
        securityGoBack();
      } else if (JsBridge.isApp()) {
        // 从绑定页面到解绑的
        if (query?.from === 'bind') {
          if (!userEmail) {
            setUnbindTipModalOpen(true);
          } else {
            setTipModalOpen(true);
          }
        }
      } else {
        // 没有邮箱，则先弹出去绑定邮箱弹窗
        if (!userEmail) {
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
          account={userPhone}
          pageTitle={_t('phone')}
          icon={isLight ? phoneLightIcon : phoneDarkIcon}
          bindIntroInfo={{
            title: _t('9e75d8ed372f4000a1e1'),
            desc: _t('0802d6e2c09b4000a1ab'),
            btnText: _t('mZXdwGfzr8y1CdgbFSDJBg'),
            onBind: gotoModify,
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
      )}
      <UnBind
        unbindTipModalOpen={unbindTipModalOpen}
        setUnbindTipModalOpen={setUnbindTipModalOpen}
        tipModalOpen={tipModalOpen}
        setTipModalOpen={setTipModalOpen}
        onBack={handleBack}
        gotoBindEmail={gotoBindEmail}
      />
    </>
  );
};

export default UnbindPhonePage;

/**
 * Owner: sean.shi@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { goVerify } from '@kucoin-gbiz-next/verification';
import { toast, useIsMobile, useTheme } from '@kux/design';
import cls from 'classnames';
import { Phone } from 'components/Account/Security/Phone';
import ErrorBoundary, { SCENE_MAP } from 'components/common/ErrorBoundary';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Back } from 'src/components/Account/Security/Back';
import { SecurityTipModal, SuccessModal } from 'src/components/common/Modal';
import phoneSuccessDarkIcon from 'static/account/security/phone_success_dark.png';
import phoneSuccessLightIcon from 'static/account/security/phone_success_light.png';
import phoneVerifyDarkIcon from 'static/account/security/phone_verify_dark.png';
import phoneVerifyLightIcon from 'static/account/security/phone_verify_light.png';
import { _t } from 'tools/i18n';
import { securitySuccessKickout, securitySuccessToBack } from 'utils/router';
import { asyncRefreshAppUser, logoutAppWithoutSwitchSite } from 'utils/runInApp';
import * as styles from './index.module.scss';

const BindAndModifyPhone = ({
  onBack, // 修改或者绑定完成的回调，给父组件使用
}) => {
  useLocale();
  const isLight = useTheme() === 'light';
  const dispatch = useDispatch();
  const isH5 = useIsMobile();
  const initRef = useRef(true);
  const userPhone = useSelector((state) => state.user.user.phone);
  const userCountryCode = useSelector((state) => state.user.user.countryCode);
  const isPullUserLoading = useSelector((state) => state.loading.effects['user/pullUser']);
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;
  const [verifyResult, setVerifyResult] = useState({
    headers: {},
    data: {
      isNeedLiveVerify: false,
      isNeedSelfService: false,
    },
  });

  const [tipModalOpen, setTipModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const handleTipModalCancel = () => {
    setTipModalOpen(false);
    onBackRef.current?.();
  };

  // 提示弹窗的确认按钮
  const handleTipModalOk = () => {
    setTipModalOpen(false);
    try {
      goVerify({
        bizType: 'RV_UPDATE_PHONE',
        onSuccess: (res) => {
          setVerifyResult(res);
        },
        onCancel: () => {
          onBackRef.current?.();
        },
      });
    } catch (err) {
      toast.error(err.message);
    }
  };
  const handleTipModalOkRef = useRef(handleTipModalOk);
  handleTipModalOkRef.current = handleTipModalOk;

  const handleSubmit = async (values) => {
    try {
      const effect = !userPhone ? 'account_security/bindPhone' : 'account_security/updatePhoneV2';
      await dispatch({
        type: effect,
        payload: {
          params: {
            ...values,
            headers: verifyResult.headers,
          },
        },
      });

      if (!userPhone) {
        // 在 App 中，刷新 App 用户信息
        await asyncRefreshAppUser();
        // 绑定手机号，直接返回
        await securitySuccessToBack();
      } else {
        // 在 App 中，退出登录，不切换站点
        await logoutAppWithoutSwitchSite();
        // 其他的，都是弹出成功弹窗
        setSuccessModalOpen(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // 如果已经弹出过一次，不再弹出
    if (!initRef.current) {
      return;
    }
    try {
      // 绑定邮箱，先弹出安全验证组件
      if (!isPullUserLoading) {
        initRef.current = false;
        if (!userPhone) {
          goVerify({
            bizType: 'RV_BIND_PHONE',
            businessData: {
              operateType: 'BIND_PHONE',
            },
            onSuccess: (res) => {
              setVerifyResult(res);
            },
            onCancel: () => {
              onBackRef.current?.();
            },
          });
        } else {
          if (JsBridge.isApp()) {
            handleTipModalOkRef.current();
          } else {
            // 如果不是绑定，都要先弹出提示弹窗
            setTipModalOpen(true);
          }
        }
      }
    } catch (err) {
      toast.error(err.message);
    }
  }, [userPhone, userCountryCode, isPullUserLoading]);

  return (
    <div className={cls(styles.container, isH5 && styles.containerH5)}>
      <Back showBot />
      <div className={styles.title}>
        {!userPhone ? _t('phone.bind') : _t('437KygCfkQmF89XXDeduKr')}
      </div>
      <ErrorBoundary scene={SCENE_MAP.accountSecurity.phone.phoneComponent}>
        <Phone isBind={!userPhone} onSubmit={handleSubmit} />
      </ErrorBoundary>
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
        title={_t('f096801aeea44800a7bf')}
        content={_t('e26342b7b8a64800a2a2')}
      />
    </div>
  );
};

export default BindAndModifyPhone;

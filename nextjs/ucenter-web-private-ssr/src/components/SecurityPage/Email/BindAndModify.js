/**
 * Owner: sean.shi@kupotech.com
 */
import JsBridge from 'gbiz-next/bridge';
import { useLocale } from 'hooks/useLocale';
import { goVerify } from 'gbiz-next/verification';
import { toast, useIsMobile, useTheme } from '@kux/design';
import cls from 'classnames';
import { Back } from 'components/Account/Security/Back';
import { Email } from 'components/Account/Security/Email';
import { SecurityTipModal, SuccessModal } from 'components/common/Modal';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import emailSuccessDarkIcon from 'static/account/security/email_success_dark.png';
import emailSuccessLightIcon from 'static/account/security/email_success_light.png';
import emailVerifyDarkIcon from 'static/account/security/email_verify_dark.png';
import emailVerifyLightIcon from 'static/account/security/email_verify_light.png';
import { _t } from 'tools/i18n';
import { securitySuccessKickout, securitySuccessToBack } from 'utils/router';
import { asyncRefreshAppUser, logoutAppWithoutSwitchSite } from 'utils/runInApp';
import * as styles from './index.module.scss';

const BindAndModifyEmail = ({ onBack }) => {
  useLocale();
  const isLight = useTheme() === 'light';
  const dispatch = useDispatch();
  const isH5 = useIsMobile();
  const initRef = useRef(true);
  const [verifyResult, setVerifyResult] = useState({
    headers: {},
    data: {
      isNeedLiveVerify: false,
      isNeedSelfService: false,
    },
  });
  const userEmail = useSelector((state) => state.user.user.email);
  const isPullUserLoading = useSelector((state) => state.loading.effects['user/pullUser']);

  const [tipModalOpen, setTipModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  // 提示弹窗的取消按钮
  const handleTipModalCancel = () => {
    setTipModalOpen(false);
    onBackRef.current?.();
  };

  // 提示弹窗的确认按钮
  const handleTipModalOk = () => {
    setTipModalOpen(false);
    try {
      goVerify({
        bizType: 'RV_UPDATE_EMAIL',
        businessData: {
          operateType: 'UPDATE_EMAIL',
        },
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
      const effect = !userEmail ? 'account_security/bindEmail' : 'account_security/updateEmail';
      await dispatch({
        type: effect,
        payload: {
          params: {
            ...values,
            headers: verifyResult.headers,
          },
        },
      });

      // 如果有传入 onSubmit 回调，则调用
      if (!userEmail) {
        // 在 App 中，刷新 App 用户信息
        await asyncRefreshAppUser();
        // 绑定邮箱，直接返回
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
        if (!userEmail) {
          goVerify({
            bizType: 'RV_BIND_EMAIL',
            businessData: {
              operateType: 'BIND_EMAIL',
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
  }, [isPullUserLoading, userEmail]);

  return (
    <div className={cls(styles.container, isH5 && styles.containerH5)}>
      <Back showBot />
      <div className={styles.title}>
        {!userEmail ? _t('email.bind') : _t('pJ2h4eUnRuTzJ8CFM42zPa')}
      </div>
      <Email isBind={!userEmail} onSubmit={handleSubmit} />
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
        title={_t('aa7b9e2318474000a1ec')}
        content={_t('4c974e5a3b484800a0d4')}
      />
    </div>
  );
};

export default BindAndModifyEmail;

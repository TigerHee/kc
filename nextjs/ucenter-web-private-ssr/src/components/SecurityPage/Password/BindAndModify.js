/**
 * Owner: sean.shi@kupotech.com
 */
import JsBridge from 'gbiz-next/bridge';
import { useLocale } from 'hooks/useLocale';
import { goVerify } from 'gbiz-next/verification';
import { toast, useIsMobile, useTheme } from '@kux/design';
import cls from 'classnames';
import { Password } from 'components/Account/Security/Password';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Back } from 'src/components/Account/Security/Back';
import { SecurityTipModal, SuccessModal } from 'src/components/common/Modal';
import loginpasswordSuccessDarkIcon from 'static/account/security/loginpassword_success_dark.png';
import loginpasswordSuccessLightIcon from 'static/account/security/loginpassword_success_light.png';
import loginpasswordVerifyDarkIcon from 'static/account/security/loginpassword_verify_dark.png';
import loginpasswordVerifyLightIcon from 'static/account/security/loginpassword_verify_light.png';
import { _t } from 'tools/i18n';
import { securitySuccessKickout, securitySuccessToBack } from 'utils/router';
import { asyncRefreshAppUser, logoutAppWithoutSwitchSite } from 'utils/runInApp';
import * as styles from './index.module.scss';

const PasswordPage = ({
  onBack, // 修改或者绑定完成的回调，给父组件使用
}) => {
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
  const user = useSelector((state) => state.user.user) || {};
  const existLoginPsd = user?.existLoginPsd;
  const isPullUserLoading = useSelector((state) => state.loading.effects['user/pullUser']);

  const [tipModalOpen, setTipModalOpen] = useState(existLoginPsd);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  const handleTipModalCancel = () => {
    setTipModalOpen(false);
    onBackRef.current?.();
  };

  // 提示弹窗的确认按钮
  const handleTipModalOk = () => {
    setTipModalOpen(false);
    try {
      goVerify({
        bizType: 'RV_UPDATE_LP',
        businessData: {
          operateType: 'UPDATE_LP',
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
      // 如果没有登陆密码，就是设置新密码流程
      if (!existLoginPsd) {
        await dispatch({
          type: 'account_security/setLoginPwd',
          payload: {
            ...values,
            headers: verifyResult.headers,
          },
        });
      } else {
        // 原先的更新密码
        await dispatch({
          type: 'account_security/updateLP',
          payload: {
            ...values,
            headers: verifyResult.headers,
          },
        });
      }
      if (!existLoginPsd) {
        // 在 App 中，刷新 App 用户信息
        await asyncRefreshAppUser();
        // 绑定登录密码，直接返回
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
      if (!isPullUserLoading) {
        initRef.current = false;
        // 绑定先弹出安全验证组件
        if (!existLoginPsd) {
          goVerify({
            bizType: 'RV_LOGIN_PWD_SET',
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
  }, [onBack, existLoginPsd, isPullUserLoading]);

  return (
    <div className={cls(styles.container, isH5 && styles.containerH5)}>
      <Back showBot />
      <div className={styles.title}>
        {existLoginPsd ? _t('password.change') : _t('8ec8652b42e14000a0ab')}
      </div>
      <Password isBind={!existLoginPsd} onSubmit={handleSubmit} />

      <SecurityTipModal
        isOpen={tipModalOpen}
        iconUrl={isLight ? loginpasswordVerifyLightIcon : loginpasswordVerifyDarkIcon}
        onClose={handleTipModalCancel}
        onOk={handleTipModalOk}
        title={_t('2d2dbc2baf0e4000a270')}
        content={[<div key="1">{_t('7c96c965a1f04800a4ae')}</div>]}
      />

      <SuccessModal
        isOpen={successModalOpen}
        iconUrl={isLight ? loginpasswordSuccessLightIcon : loginpasswordSuccessDarkIcon}
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
        title={_t('db2beed389484000a0f4')}
        content={_t('e0c76f4d005f4000a8ae')}
      />
    </div>
  );
};

export default PasswordPage;

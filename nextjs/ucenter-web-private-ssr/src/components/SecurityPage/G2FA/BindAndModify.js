/**
 * Owner: sean.shi@kupotech.com
 */
import { useLocale } from 'hooks/useLocale';
import { goVerify } from 'gbiz-next/verification';
import { toast, useIsMobile, useTheme } from '@kux/design';
import cls from 'classnames';
import { Back } from 'components/Account/Security/Back';
import { G2FA } from 'components/Account/Security/G2FA';
import { SecurityTipModal } from 'components/common/Modal';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import g2faVerifyDarkIcon from 'static/account/security/g2fa_verify_dark.png';
import g2faVerifyLightIcon from 'static/account/security/g2fa_verify_light.png';
import { _t } from 'tools/i18n';
import { securitySuccessToBack } from 'utils/router';
import { asyncRefreshAppUser } from 'utils/runInApp';
import * as styles from './index.module.scss';

const BindAndModifyPhoneG2FA = ({
  onBack, // 修改或者绑定完成的回调，给父组件使用
}) => {
  useLocale();
  const isLight = useTheme() === 'light';
  const dispatch = useDispatch();
  const isH5 = useIsMobile();
  const initRef = useRef(true);
  const isPullUserLoading = useSelector((state) => state.loading.effects['user/pullUser']);
  const email = useSelector((state) => state.user.user.email);
  const phone = useSelector((state) => state.user.user.phone);
  const userCountryCode = useSelector((state) => state.user.user.countryCode);
  const isUpdateG2fa = useSelector((state) => state.user.securtyStatus.GOOGLE2FA);

  const [verifyResult, setVerifyResult] = useState({
    headers: {},
    data: {
      isNeedLiveVerify: false,
      isNeedSelfService: false,
    },
  });
  const [tipModalOpen, setTipModalOpen] = useState(false);
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
        bizType: 'RV_UPDATE_2FA',
        businessData: {
          operateType: 'UPDATE_2FA',
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

  const handleSubmit = async (values) => {
    try {
      await dispatch({
        type: 'account_security/bindG2AF',
        payload: {
          ...values,
          isUpdate: isUpdateG2fa,
          headers: verifyResult.headers,
        },
      });
      // 在 App 中，刷新 App 用户信息
      await asyncRefreshAppUser();
      // 直接返回
      await securitySuccessToBack();
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
      // 绑定G2FA，先弹出安全验证组件
      if (!isPullUserLoading) {
        initRef.current = false;
        if (!isUpdateG2fa) {
          goVerify({
            bizType: 'RV_BIND_2FA',
            businessData: {
              operateType: 'BIND_2FA',
            },
            onSuccess: (res) => {
              setVerifyResult(res);
            },
            onCancel: () => {
              onBackRef.current?.();
            },
          });
        } else {
          setTipModalOpen(true);
        }
      }
    } catch (err) {
      toast.error(err.message);
    }
  }, [isUpdateG2fa, email, phone, userCountryCode, isPullUserLoading]);

  return (
    <div className={cls(styles.container, isH5 && styles.containerH5)}>
      <Back showBot />
      <div className={styles.title}>{isUpdateG2fa ? _t('change.g2fa') : _t('set.g2fa')}</div>
      <G2FA email={email} phone={phone} isBind={!isUpdateG2fa} onSubmit={handleSubmit} />

      <SecurityTipModal
        isOpen={tipModalOpen}
        iconUrl={isLight ? g2faVerifyLightIcon : g2faVerifyDarkIcon}
        onClose={handleTipModalCancel}
        onOk={handleTipModalOk}
        title={_t('ba78e4c65c284800af8c')}
        content={[<div key="1">{_t('3c9d55b6bf134000a2f3')}</div>]}
      />
    </div>
  );
};

export default BindAndModifyPhoneG2FA;

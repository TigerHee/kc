/**
 * Owner: sean.shi@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { goVerify } from '@kucoin-gbiz-next/verification';
import { Form, toast, useIsMobile, useTheme } from '@kux/design';
import cls from 'classnames';
import { TradePassword } from 'components/Account/Security/TradePassword';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Back } from 'src/components/Account/Security/Back';
import { SecurityTipModal } from 'src/components/common/Modal';
import tradepasswordVerifyDarkIcon from 'static/account/security/tradepassword_verify_dark.png';
import tradepasswordVerifyLightIcon from 'static/account/security/tradepassword_verify_light.png';
import { _t } from 'tools/i18n';
import { securitySuccessToBack } from 'utils/router';
import { asyncRefreshAppUser } from 'utils/runInApp';
import * as styles from './index.module.scss';

const { useForm } = Form;

const PasswordPage = ({ onBack }) => {
  useLocale();
  const isLight = useTheme() === 'light';
  const [form] = useForm();
  const dispatch = useDispatch();
  const isH5 = useIsMobile();
  const initRef = useRef(true);
  const isPullUserLoading = useSelector((state) => state.loading.effects['user/pullUser']);
  const isPullSecurtyMethods = useSelector(
    (state) => state.loading.effects['user/pullSecurtyMethods'],
  );
  const isUpdateTradePassword = useSelector((state) => state.user.securtyStatus.WITHDRAW_PASSWORD);
  const [tipModalOpen, setTipModalOpen] = useState(false);
  const [verifyResult, setVerifyResult] = useState({
    headers: {},
    data: {
      isNeedLiveVerify: false,
      isNeedSelfService: false,
    },
  });
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
        bizType: 'RV_UPDATE_TP',
        businessData: {
          operateType: 'UPDATE_TP',
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
      await form.validateFields();
      await dispatch({
        type: 'account_security/modifyWithdrawPassword',
        payload: {
          ...values,
          headers: verifyResult.headers,
        },
      });
      // 在 App 中，刷新 App 用户信息
      await asyncRefreshAppUser();
      // 绑定交易密码，直接返回
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
      if (!isPullUserLoading && !isPullSecurtyMethods) {
        initRef.current = false;
        if (!isUpdateTradePassword) {
          goVerify({
            bizType: 'RV_BIND_TP',
            businessData: {
              operateType: 'BIND_TP',
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
  }, [isUpdateTradePassword, isPullUserLoading, isPullSecurtyMethods]);

  return (
    <div className={cls(styles.container, isH5 && styles.containerH5)}>
      <Back showBot />
      <div className={styles.title}>
        {isUpdateTradePassword ? _t('trade.code.modify') : _t('a0fa65c7b4554000ac51')}
      </div>
      <TradePassword isBind={!isUpdateTradePassword} onSubmit={handleSubmit} />

      <SecurityTipModal
        isOpen={tipModalOpen}
        iconUrl={isLight ? tradepasswordVerifyLightIcon : tradepasswordVerifyDarkIcon}
        onClose={handleTipModalCancel}
        onOk={handleTipModalOk}
        title={_t('b38a53c7a0f64000a151')}
        content={[<div key="1">{_t('f89ab5205d6a4000adcd')}</div>]}
      />
    </div>
  );
};

export default PasswordPage;

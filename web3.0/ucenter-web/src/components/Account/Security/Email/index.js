/**
 * Owner: sean.shi@kupotech.com
 */
import { EmailInput, EmailVerifyInput } from '@kucoin-gbiz-next/entrance';
import { Alert, Button } from '@kux/design';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { _t } from 'tools/i18n';
import * as styles from './index.module.scss';

export const Email = ({
  // 是否是绑定
  isBind,
  hiddenAlert,
  customSendRequest,
  // 提交回调
  onSubmit,
  addressLabel,
}) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState({ value: '', error: true });
  const [emailCode, setEmailCode] = useState({ value: '', error: true });
  const [retryAfterSeconds, setRetryAfterSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);

  const handleEmailChange = (changeValue = { value: '', error: true }) => {
    setEmail(changeValue);
  };
  const handleEmailCodeChange = (changeValue = { value: '', error: true }) => {
    setEmailCode(changeValue);
  };

  const handleSendCode = () => {
    setLoadingEmail(true);
    const request = customSendRequest
      ? customSendRequest({ email: email.value })
      : dispatch({
          type: 'account_security/sendBindCode',
          payload: {
            type: 'email',
            params: {
              bizType: isBind ? 'BIND_EMAIL_V2' : 'UPDATE_EMAIL_V2',
              email: email.value,
            },
          },
        });
    request
      .then(({ retryAfterSeconds: retrySeconds }) => {
        setRetryAfterSeconds(new Date().getTime() + retrySeconds * 1000);
      })
      .finally(() => {
        setLoadingEmail(false);
      });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSubmit({
        email: email.value,
        code: emailCode.value,
      });
    } catch (err) {
      console.log('err..', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {!isBind && !hiddenAlert && (
        <div className={styles.alertWrapper}>
          <Alert
            className={styles.alert}
            type="warning"
            duration={0}
            message={_t('bf7ca459e88b4800a090')}
          />
        </div>
      )}
      <EmailInput
        className={styles.phoneFormItem}
        onChange={handleEmailChange}
        label={addressLabel}
        prefix={''}
      />
      <EmailVerifyInput
        allowClear={false}
        value={email.value}
        showPhoneInfo={false}
        isAutoSendCode={false}
        sendCodeBtnDisabled={email.error || !email.value}
        showEmailInfo={false}
        onChange={handleEmailCodeChange}
        extra={{
          emailRetryAfterSeconds: {
            time: 0,
            deadline: retryAfterSeconds,
          },
          email: email.value,
          loadingEmail,
          onFinish: () => {
            setRetryAfterSeconds(0);
          },
          onSendCode: () => {
            if (loadingEmail) return;
            handleSendCode();
          },
        }}
      />

      <Button
        type="primary"
        size="large"
        fullWidth
        loading={loading}
        className={styles.submitButton}
        disabled={emailCode.error || !emailCode.value || email.error || !email.value}
        onClick={handleSubmit}
      >
        {isBind ? _t('active') : _t('submit')}
      </Button>
    </div>
  );
};

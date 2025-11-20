/**
 * Owner: sean.shi@kupotech.com
 */
import { GFAVerifyInput } from '@kucoin-gbiz-next/entrance';
import { Alert, Button, toast, useTheme } from '@kux/design';
import QRCode from 'qrcode.react';
import { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useDispatch, useSelector } from 'react-redux';
import { _t } from 'tools/i18n';
import * as styles from './index.module.scss';

export const G2FA = ({ email, phone, g2faKey: externalG2faKey, isBind, onSubmit, hiddenAlert }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const _g2faKey = useSelector((state) => state.account_security.g2faKey);
  const g2faKey = externalG2faKey || _g2faKey;
  const [code, setCode] = useState({ value: '', error: true });

  const createQRValue = () => {
    const isSandBox = IS_SANDBOX || window.location.hostname.indexOf('sandbox') > -1;
    if (isSandBox) {
      return `otpauth://totp/KuCoin-${email || phone}?issuer=KuCoinSandBox&secret=${g2faKey}`;
    }
    return `otpauth://totp/KuCoin-${email || phone}?issuer=KuCoin&secret=${g2faKey}`;
  };

  const handleCopy = () => {
    toast.success(_t('copy.succeed'));
  };

  const handleCodeChange = (changeValue = { value: '', error: true }) => {
    setCode(changeValue);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSubmit({
        code: code.value,
        key: g2faKey,
      });
    } catch (err) {
      console.log('err..', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 外部没有传入 key 才请求
    !externalG2faKey &&
      dispatch({
        type: 'account_security/getG2FAKey',
      });
  }, [externalG2faKey, dispatch]);

  return (
    <>
      {!isBind && !hiddenAlert && (
        <div className={styles.alertWrapper}>
          <Alert
            className={styles.alert}
            type="warning"
            duration={0}
            message={_t('3c9d55b6bf134000a2f3')}
          />
        </div>
      )}

      <div className={styles.g2faDesc}>{_t('fe77a975f69a4800a7b7')}</div>

      <div className={styles.g2faQrcode}>
        <div
          className={`${styles.g2faQrcodeWrapper} ${
            theme === 'dark' ? styles.g2faQrcodeWrapperDark : ''
          }`}
        >
          <QRCode value={createQRValue()} size={144} level="M" />
        </div>
      </div>
      <div className={styles.g2faKey} data-inspector="bind-g2fa-form-code">
        {g2faKey}
      </div>
      <div className={styles.g2faKeyCopy}>
        <CopyToClipboard text={g2faKey} onCopy={handleCopy}>
          <Button data-inspector="bind-g2fa-form-copy">{_t('copy')}</Button>
        </CopyToClipboard>
      </div>

      <div className={styles.g2faDesc}>{_t('928993ec26814000adca')}</div>

      <GFAVerifyInput className={styles.g2faForm} onChange={handleCodeChange} />

      <Button
        type="primary"
        size="large"
        data-inspector="bind-g2fa-confirm"
        fullWidth
        loading={loading}
        className={styles.submitButton}
        disabled={!code.value || code.error}
        onClick={handleSubmit}
      >
        {_t('submit')}
      </Button>
    </>
  );
};

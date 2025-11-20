import React, { useRef, useState } from 'react';
import { Box, Portal, Spin } from '@kux/mui-next';
import noop from 'lodash-es/noop';
import useScript from 'react-script-hook';
import Recaptcha from 'react-recaptcha';
import { useTranslation } from 'tools/i18n';
import styles from './styles.module.scss';

interface GoogleCaptchaProps {
  sitekey: string;
  src?: string;
  onSuccess?: (token: string) => void;
  onClose?: () => void;
  visible: boolean;
}

const GoogleCaptcha: React.FC<GoogleCaptchaProps> = ({
  sitekey,
  src = 'https://www.recaptcha.net/recaptcha/api.js?render=explicit',
  onSuccess = noop,
  onClose = noop,
  visible,
}) => {
  const googleRef = useRef<Recaptcha | null>(null);
  const [loading, error] = useScript({ src });
  const [loadingShow, setLoadingShow] = useState(true);
  const { i18n } = useTranslation('captcha');
  const { language: currentLang } = i18n || {};

  if (error) return null;

  const handleClose = () => onClose?.();

  const verifyCallback = (res: string) => {
    if (res) {
      onSuccess?.(res);
      googleRef.current?.reset?.();
      handleClose();
    }
  };

  const onloadCallback = () => setLoadingShow(false);
  const expiredCallback = () => {};

  return visible ? (
    <Portal>
      <div className={styles.BgWrapper} onClick={handleClose}>
        {!loading && (
          <div className={styles.RecaptchaWrapper}>
            <Recaptcha
              ref={(el) => (googleRef.current = el)}
              elementID="recaptcha"
              sitekey={sitekey}
              render="explicit"
              hl={currentLang || 'en'}
              verifyCallback={verifyCallback}
              onloadCallback={onloadCallback}
              expiredCallback={expiredCallback}
            />
          </div>
        )}
        {loadingShow && (
          <Box width={352} padding={8} className={styles.LoadingBox}>
            <Spin />
          </Box>
        )}
      </div>
    </Portal>
  ) : null;
};

export default GoogleCaptcha;

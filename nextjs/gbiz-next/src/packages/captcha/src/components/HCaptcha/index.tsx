/**
 * Owner: tiger@kupotech.com
 */
import React, { useState, useEffect } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Portal, Box, Spin } from '@kux/mui-next';
import noop from 'lodash-es/noop';
import storage from 'tools/storage';
import { type CaptchaInitType } from '../../model';
import styles from './styles.module.scss';

const storageKey = 'gbiz_hcaptcha_load';

interface HCaptchaProps {
  onVerify?: (token: string, eKey?: string) => void;
  onClose?: () => void;
  captchaInit?: CaptchaInitType;
}

const HCaptchaWrapper: React.FC<HCaptchaProps> = ({
  onVerify = noop,
  onClose = noop,
  captchaInit = { apiKey: '' },
}) => {
  const { apiKey, locale } = captchaInit;
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (storage.getItem(storageKey)) {
      setLoading(false);
    }
  }, []);

  const handleLoad = () => {
    setLoading(false);
    storage.setItem(storageKey, 1);
  };

  return (
    <Portal>
      <div className={styles.BgWrapper} onClick={onClose}>
        <div className={styles.ContentWrapper}>
          <HCaptcha
            sitekey={apiKey}
            onVerify={onVerify}
            onLoad={handleLoad}
            languageOverride={locale}
            reCaptchaCompat={false}
          />
        </div>
        {isLoading && (
          <Box className={styles.LoadingBox}>
            <Spin />
          </Box>
        )}
      </div>
    </Portal>
  );
};

export default HCaptchaWrapper;

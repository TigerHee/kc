/**
 * Owner: brick.fan@kupotech.com
 */

import { ICWaitOutlined } from '@kux/icons';
import { Dialog, ThemeProvider, Button, CacheProvider, Empty } from '@kux/mui-next';
import React, { useEffect, useState, useRef } from 'react';
// import logoDark from '../asset/warning-dark.svg';
// import logo from '../asset/warning.svg';
import StatusInfoLight from '@kux/icons/static/status-info-light.png';
import StatusInfoDark from '@kux/icons/static/status-info-dark.png';
import { getSiteName } from '../utils';
import { Trans, useTranslation } from 'tools/i18n';
import styles from './styles.module.scss';
import useLang from 'hooks/useLang';
// import { Empty } from '@kux/design';

export default ({ theme, onOpen }) => {
  const [show, setShow] = useState(false);
  const [site, setSite] = useState('');
  const [timer, setTimer] = useState(5);
  const { isRTL } = useLang();

  const { t } = useTranslation('siteRedirect');

  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;

  useEffect(() => {
    window.onKYCSiteChange?.(s => {
      setSite(s);
      setShow(true);
      onOpenRef.current?.();
    });
  }, []);

  const siteName = getSiteName(site, t);

  useEffect(() => {
    if (!show) return;
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          window?._SWITCH_SITE_?.(site);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [show, site]);

  return (
    <CacheProvider isRTL={isRTL}>
      <ThemeProvider theme={theme || 'light'}>
        <Dialog open={show} showCloseX={false} header={null} footer={null} className={styles.kycRedirectDialog}>
          <div className={styles.kycRedirectWrapper}>
            <img src={theme === 'dark' ? StatusInfoDark : StatusInfoLight} alt="logo" />
            <div className={styles.kycRedirectTitle}>{t('3705a22def0d4800a1b9')}</div>
            <div className={styles.kycRedirectContent}>
              <Trans
                i18nKey="5db2931fb7474800a935"
                ns="siteRedirect"
                values={{ site: siteName }}
                components={{ span: <span /> }}
              />
            </div>
            <Button
              onClick={() => {
                window?._SWITCH_SITE_(site);
              }}
              fullWidth
            >
              {t('0e69c213ac414800a71a') || ''}
            </Button>
            <div className={styles.kycRedirectTimer}>
              <ICWaitOutlined />
              <Trans
                i18nKey="2441224b3dbb4000a184"
                ns="siteRedirect"
                values={{ time: timer }}
                components={{ span: <span /> }}
              />
            </div>
          </div>
        </Dialog>
      </ThemeProvider>
    </CacheProvider>
  );
};

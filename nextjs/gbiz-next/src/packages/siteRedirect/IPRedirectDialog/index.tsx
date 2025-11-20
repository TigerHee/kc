/**
 * Owner: brick.fan@kupotech.com
 */

import { Dialog, ThemeProvider, CacheProvider, Empty } from '@kux/mui-next';
import React, { useEffect, useState, useRef } from 'react';
import StatusInfoLight from '@kux/icons/static/status-info-light.png';
import StatusInfoDark from '@kux/icons/static/status-info-dark.png';
import { getSiteName } from '../utils';
import { Trans, useTranslation } from 'tools/i18n';
import styles from './styles.module.scss';
import useLang from 'hooks/useLang';

export default ({ theme, onOpen }) => {
  const [show, setShow] = useState(false);
  const [site, setSite] = useState('');
  const { isRTL } = useLang();

  const { t } = useTranslation('siteRedirect');
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;

  useEffect(() => {
    window.onIPSiteChange?.(s => {
      setSite(s);
      setShow(true);
      onOpenRef.current?.();
    });
  }, []);

  const siteName = getSiteName(site, t);

  return (
    <CacheProvider isRTL={isRTL}>
      <ThemeProvider theme={theme || 'light'}>
        <Dialog
          open={show}
          onCancel={() => {
            setShow(false);
          }}
          onOk={() => {
            window?._SWITCH_SITE_(site);
          }}
          centeredFooterButton
          okText={t('f8f20fdb54ed4800a803')}
          cancelText={t('1282a9de05204000a42e')}
          cancelButtonProps={{
            style: {
              marginInlineEnd: 12,
            },
          }}
        >
          <div className={styles.ipRedirectWrapper}>
            {/* <Empty name="no-record" size="small" className={styles.promptIcon} /> */}
            <img src={theme === 'dark' ? StatusInfoDark : StatusInfoLight} alt="logo" />
            <div className={styles.ipRedirectTitle}>{t('a4d911c5beb74000aa50')}</div>
            <div className={styles.ipRedirectContent}>
              <Trans
                i18nKey="50184c5b65814800ab6a"
                ns="siteRedirect"
                values={{ site: siteName }}
                components={{ span: <span /> }}
              />
            </div>
          </div>
        </Dialog>
      </ThemeProvider>
    </CacheProvider>
  );
};

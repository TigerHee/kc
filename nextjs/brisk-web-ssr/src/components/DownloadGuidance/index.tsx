import AnimatedContent from '@/components/CommonComponents/Animations/AnimatedContent';
import useTranslation from '@/hooks/useTranslation';

import sensors from 'gbiz-next/sensors';
import React, { memo, useEffect, useState } from 'react';

import styles from './index.module.scss';

import LazyImg from '@/components/CommonComponents/LazyImg';
import useTheme from '@/hooks/useTheme';
import { addLangToPath } from '@/tools/i18n';
import DownloadQrCode from '../CommonComponents/DownloadQrCode';
import { getTenantConfig } from '@/tenant';

const DownloadGuidance: React.FC = () => {
  const { t } = useTranslation();
  const [src, setSrc] = useState('');
  const { theme } = useTheme();
  const tenantConfig = getTenantConfig();

  const handleViewMore = () => {
    sensors.trackClick(['headDownload', '1'], { actionType: 'click' });
  };

  const handleImgSrc = async (theme, tenantConfig) => {
    const { darkImg, lightImg } = tenantConfig.guidanceImg;
    let source: any = {};
    if (theme === 'light') {
      source = await lightImg();
    } else {
      source = await darkImg();
    }
    setSrc(source?.default || '');
  };

  useEffect(() => {
    handleImgSrc(theme, tenantConfig);
  }, [theme, tenantConfig]);

  return (
    <section className={styles.downloadGuidance}>
      <div className={styles.innerContent}>
        <div className={styles.contentWrapper}>
          <AnimatedContent delay={0.2}>
            <h2 className={styles.mainTitle}>{t('823a3e258ddb4000afc9')}</h2>
          </AnimatedContent>

          <AnimatedContent delay={0.3}>
            <div className={styles.subtitle}>
              {t('863974db7e604800ad11')}&nbsp;
              <a href={addLangToPath('/download')} className={styles.viewMoreLink} onClick={handleViewMore}>
                {t('2YyXGzmRgscwyygscEYUgi')}
              </a>
            </div>
          </AnimatedContent>
          <AnimatedContent delay={0.5}>
            <div className={styles.qrCodeBox}>
              <DownloadQrCode />
            </div>
          </AnimatedContent>
          <AnimatedContent delay={0.6}>
            <div className={styles.scanQrCodeTips}>{t('d4133ebd5e134000acdb')}</div>
          </AnimatedContent>
        </div>
        <AnimatedContent delay={0.7} className={styles.appShowcase}>
          <LazyImg src={src} alt={t('1065cac6d59d4000a360')} />
        </AnimatedContent>
      </div>
      {/* 底部背光 */}
      <div className={styles.shimmerBackground} />
    </section>
  );
};

export default memo(DownloadGuidance);

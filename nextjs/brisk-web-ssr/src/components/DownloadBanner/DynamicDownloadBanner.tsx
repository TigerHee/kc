import { getSceneDownloadLinks } from '@/hooks/useCountryInfo';
import { useAppStore } from '@/store/app';
import { Button } from '@kux/design';
import { CloseIcon, ReceivedIcon } from '@kux/iconpack';
import sensors from 'gbiz-next/sensors';
import { bootConfig } from 'kc-next/boot';
import { useEffect } from 'react';
import useTranslation from '@/hooks/useTranslation';
import styles from './styles.module.scss';

const DownloadBanner = () => {
  const { t } = useTranslation();
  const countryInfo = useAppStore(state => state.countryInfo);
  const illegalGpList = useAppStore(state => state.illegalGpList);
  const downloadAppUrlMap = getSceneDownloadLinks(countryInfo, illegalGpList);
  const downloadAppUrl = downloadAppUrlMap.Banner;

  useEffect(() => {
    sensors.track(['topGuideButton', '1'], {
      postType:'newRatings',
    });
  }, []);

  const handleDownload = () => {
    sensors.trackClick(['topGuideButton', '1'], {
      postType:'newRatings',
      position: '',
      clickPosition: 'download',
    });
  };

  const handleClose = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    useAppStore.getState().setShowDownloadBanner(false);

    sensors.trackClick(['topGuideButton', '1'], {
      postType:'newRatings',
      position: '',
      clickPosition: 'close',
    });
  };

  return (
    <a className={styles.container} href={downloadAppUrl} target="_blank" rel="nofollow" onClick={handleDownload}>
      <img className={styles.logo} src={bootConfig._BRAND_LOGO_MINI_} alt="downloadApp" />
      <div className={styles.content}>
        <div className={styles.title}>{bootConfig._BRAND_NAME_} App</div>
        <div className={styles.description}>{t('wLAfc8MZvoHbeNragecB4Z')}</div>
      </div>
      <Button className={styles.button} type="primary" size="mini" aria-label="download">
        <ReceivedIcon />
      </Button>

      <CloseIcon className={styles.close} onClick={handleClose} />
    </a>
  );
};

export default DownloadBanner;

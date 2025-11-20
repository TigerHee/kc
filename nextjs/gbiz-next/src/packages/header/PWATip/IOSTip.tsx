import { useEffect } from 'react';
import PWAlogo from '../static/pwa/pwalogo.svg';
import ShareSvg from '../static/pwa/share.svg';
import { useTranslation } from 'tools/i18n';
import { kcsensorsManualTrack, kcsensorsClick } from '../common/tools';
import { CloseIcon } from '@kux/iconpack';
import styles from './styles.module.scss';

export default function SafariTip({ onClose }) {
  const { t } = useTranslation('header');

  useEffect(() => {
    kcsensorsManualTrack(['pwaAlert', '1']);
  }, []);

  const handleClose = () => {
    kcsensorsClick(['pwaClose', '2']);
    onClose && onClose();
  };

  return (
    <div className={styles.IOSWrapper} data-theme="dark">
      <div className={styles.InfoWrapper}>
        <img className={styles.Logo} src={PWAlogo} alt="KuCoin" width="36" height="36" />
        <div className={styles.InfoDes}>
          <div className={styles.InfoTitle}>
            {t('d7BNkE6kbkdBWwS6ZdkdCo')}
            <img className={styles.ShareImg} src={ShareSvg} alt="share" width="20" height="20" />
          </div>
          <div className={styles.InfoTitle}>{t('vLPrfybJ9B942VX1iPp4bz')}</div>
        </div>
      </div>
      <CloseIcon className={styles.Close} onClick={handleClose} width={8} height={8} color='var(--kux-text)' />
    </div>
  );
}

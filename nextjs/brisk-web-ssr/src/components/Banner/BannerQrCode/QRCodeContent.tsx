import DownloadQrCode from '@/components/CommonComponents/DownloadQrCode';
import useTranslation from '@/hooks/useTranslation';
import styles from './index.module.scss';

const QRCodeContent: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.qrCodeWrapper}>
      <DownloadQrCode />
      <div className={styles.tooltipText}>{t('d4133ebd5e134000acdb')}</div>
    </div>
  );
};

export default QRCodeContent;

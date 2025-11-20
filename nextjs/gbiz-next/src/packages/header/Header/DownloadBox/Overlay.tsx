/**
 * Owner: iron@kupotech.com
 */
import React, { FC } from 'react';
import { ArrowRight2Icon } from '@kux/iconpack';
import clsx from 'clsx';
import { composeSpmAndSave, kcsensorsClick } from '../../common/tools';
import Link from '../../components/Link';
import { useTenantConfig } from '../../tenantConfig';
import { useTranslation } from 'tools/i18n';
import styles from './styles.module.scss';
import DownloadQrCode from '../../components/DownloadQrcode';

interface OverlayProps {
  currentLang: string;
  inTrade: boolean;
  KUCOIN_HOST_CHINA: string;
  KUCOIN_HOST: string;
}

const Overlay: FC<OverlayProps> = ({ currentLang, inTrade, KUCOIN_HOST_CHINA, KUCOIN_HOST }) => {
  const { t } = useTranslation('header');
  const tenantConfig = useTenantConfig();
  const apkUrl = `${currentLang === 'zh_CN' ? KUCOIN_HOST_CHINA : KUCOIN_HOST}/download?lang=${currentLang}`;
  const downloadLink = tenantConfig.downloadQrOneLinkUrl || apkUrl;

  return (
    <div className={clsx(styles.overlayWrapper, inTrade && styles.overlayWrapperInTrade)}>
      <div className={styles.title}>{t('newhomepage.down.title.2')}</div>
      <div className={styles.QRCode}>
        <div className={styles.QRCodeBox}>
          <DownloadQrCode downloadLink={downloadLink} />
        </div>
      </div>
      <Link
        href={`${KUCOIN_HOST}/download`}
        className={styles.more}
        data-modid="appDowload"
        lang={currentLang}
        onClick={() => {
          kcsensorsClick(['navigationDownloadPopup', '1'], {
            pagecate: 'navigationDownloadPopup',
          });
          composeSpmAndSave(`${KUCOIN_HOST}/download`, ['appDowload', '1'], currentLang);
        }}
      >
        {t('newhomepage.down.more')}
        <ArrowRight2Icon size={16} color='var(--kux-brandGreen)' className={styles.exICArrowRight2Outlined} />
      </Link>
    </div>
  );
};

export default Overlay;

import { ReactComponent as QrCode } from '@/static/banner/qrcode.svg';
import { ReactComponent as QrCodeDark } from '@/static/banner/qrcode_dark.svg';
import { addLangToPath } from '@/tools/i18n';
import { Tooltip } from '@kux/design';
import { useCompliantShowWithInit } from 'gbiz-next/compliantCenter';
import React from 'react';
import styles from './index.module.scss';
import QRCodeContent from './QRCodeContent';
import useTheme from '@/hooks/useTheme';

const DownloadQrCode: React.FC = () => {
  const {show: showDownload, init: showDownloadInit} = useCompliantShowWithInit('compliance.homepage.rightBanner.download');

  const {theme} = useTheme();

  // 如果初始化完成，但是没有显示，则不显示
  if(showDownloadInit && !showDownload){
    return null;
  }

  return (
    <Tooltip
      className={styles.downloadTooltipsContainer}
      placement="top"
      content={<QRCodeContent />}
      showArrow={false}
      trigger="hover"
      mobileTransform={false}
      forceRender={true}
      destroyOnHidden={false}
    >
      <div
        className={styles.qrCodeBox}
        onClick={() => {
          window.location.href = addLangToPath('/download');
        }}
      >
        {theme === 'dark' ? <QrCode className={styles.qrCode} /> : <QrCodeDark className={styles.qrCode} />}
      </div>
    </Tooltip>
  );
};

export default DownloadQrCode;

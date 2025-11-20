import { useIsLegalGp } from '@/hooks/useCountryInfo';
import { useConfigStore } from '@/store/config';
import QRCodeStyling, { type Options as QRCodeOptions } from 'qr-code-styling';
import React, { memo, useEffect, useRef } from 'react';
import { DEFAULT_QRCODE_COFIG } from './constants';
import styles from './index.module.scss';

const DownloadQrCode: React.FC<QRCodeOptions> = props => {
  const showGp = useIsLegalGp();
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const qrCodeInstanceRef = useRef<QRCodeStyling | null>(null);
  const configItems = useConfigStore(store => store.configItems);

  const linkA = configItems?.webHomepageDownload?.value;
  const linkB = configItems?.webHomepageDownload?.backupValues.planB;

  const value = showGp ? linkA : linkB;

  // 创建二维码实例
  const createQRCode = () => {
    const config = { ...DEFAULT_QRCODE_COFIG, data: value , ...props };
    if (qrCodeRef.current && !qrCodeInstanceRef.current) {
      qrCodeInstanceRef.current = new QRCodeStyling(config);
      // 渲染二维码
      qrCodeInstanceRef.current.append(qrCodeRef.current);
    }
  };

  // 清理二维码
  const cleanupQRCode = () => {
    if (qrCodeRef.current) {
      qrCodeRef.current.innerHTML = '';
    }
    if (qrCodeInstanceRef.current) {
      qrCodeInstanceRef.current = null;
    }
  };

  // 组件卸载时清理
  useEffect(() => {
    if(!value){
      return;
    }
    createQRCode();
    return () => {
      cleanupQRCode();
    };
  }, [value]);

  return (
    <div className={styles.container}>
      <div ref={qrCodeRef} className={styles.qrCodeCanvas} />
    </div>
  );
};

export default memo(DownloadQrCode);

import QRCodeStyling, { type Options as QRCodeOptions } from 'qr-code-styling';
import React, { memo, useEffect, useRef } from 'react';
import styles from './index.module.scss';
import { bootConfig } from 'kc-next/boot';

type Props = QRCodeOptions & { downloadLink: string };

const DownloadQrCode: React.FC<Props> = ({ downloadLink, ...rest }) => {
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const qrCodeInstanceRef = useRef<QRCodeStyling | null>(null);

  // 创建二维码实例
  const createQRCode = () => {
    const config = {
      width: 172,
      height: 172,
      image: bootConfig._BRAND_FAVICON_,
      type: 'svg', // 这里必须用 svg，不然在 safari 上经常出现中间的图片看不见的问题
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.3,
        margin: 2,
      },
      dotsOptions: {
        type: 'dots',
      },
      cornersSquareOptions: {
        type: 'dot',
      },
      cornersDotOptions: {
        type: 'dot',
      },
      qrOptions: {
        typeNumber: 6,
        errorCorrectionLevel: 'H',
        mode: 'Byte',
      },
      data: downloadLink,
      ...rest,
    } as QRCodeOptions;

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
    if (!downloadLink) {
      return;
    }
    createQRCode();
    return () => {
      cleanupQRCode();
    };
  }, [downloadLink]);

  return (
    <div className={styles.container}>
      <div ref={qrCodeRef} className={styles.qrCodeCanvas} />
    </div>
  );
};

export default memo(DownloadQrCode);

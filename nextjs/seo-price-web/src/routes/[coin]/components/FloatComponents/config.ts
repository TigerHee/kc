/**
 * Owner: mcqueen@kupotech.com
 */
import compareVersion from '@/tools/compareVersion';
import bridge from 'gbiz-next/bridge';

// 支持多海报分享的首个版本
export const supportGallery = (appVersion) => {
  if (appVersion) {
    return compareVersion(appVersion, '3.45.0') >= 0;
  }
  return false;
};

// 分享海报
export const sharePoster = (supportGallery: boolean, galleryLink: string, imgPath?: string) => {
  // 新app版本的多张海报分享
  if (supportGallery) {
    bridge.open({
      type: 'func',
      params: {
        name: 'share',
        category: 'gallery',
        data: JSON.stringify({
          galleryType: 'CUSTOMER_INVITE',
          galleryLink,
          needQrCode: true,
        }),
      },
    });
    return;
  }
  // 低版本的默认分享
  bridge.open({
    type: 'func',
    params: {
      name: 'share',
      category: 'img',
      pic: imgPath,
    },
  });
};

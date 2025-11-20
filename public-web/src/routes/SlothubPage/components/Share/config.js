/**
 * Owner: mcqueen@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { compareVersion } from 'helper';

// 支持多海报分享的首个版本
export const supportGallery = (appVersion) => {
  if (appVersion) {
    return compareVersion(appVersion, '3.45.0') >= 0;
  }
  return false;
};

// 分享海报
export const sharePoster = (imgPath, inviteCode, inviteLink) => {
  // 低版本的默认分享
  JsBridge.open({
    type: 'func',
    params: {
      name: 'share',
      category: 'img',
      pic: imgPath,
      needQrCode: true,
      rcode: inviteCode,
      qrCodeUrl: inviteLink, // 可选,默认分享注册链接
      linkUrl: inviteLink, // 可选,默认分享注册链接
      utmSource: 'gemslot',
    },
  });
};

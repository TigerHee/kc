/*
 * @Date: 2024-06-12 14:26:58
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-26 17:08:39
 */
/**
 * Owner: iron@kupotech.com
 */
function _mime(option, value) {
  const { mimeTypes } = navigator;
  for (const mt in mimeTypes) {
    if (mimeTypes[mt][option] === value) {
      return true;
    }
  }
  return false;
}

// 判断360 搜狗浏览器
function isInMime() {
  const is360 = _mime('type', 'application/vnd.chromium.remoting-viewer');
  const isSogou = _mime('type', 'application/sogou-native-widget-plugin');

  return is360 || isSogou;
}
// 判断是否chrome浏览器
export default function judgeChrome() {
  const ua = navigator.userAgent.toLowerCase();
  const isChrome = ua.match(/chrome/) !== null && !isInMime();
  return isChrome;
}

export const isChrome = judgeChrome();

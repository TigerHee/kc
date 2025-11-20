/*
 * @Owner: Melon@kupotech.com
 * @Author: Melon Melon@kupotech.com
 * @Date: 2025-06-12 11:27:51
 * @LastEditors: Melon Melon@kupotech.com
 * @LastEditTime: 2025-06-12 11:43:52
 * @FilePath: /g-biz/packages/share/src/utils/image-utils.js
 * @Description: 图片处理
 *
 *
 */

/**
 * 加载图片
 * @param url 图片地址
 * @returns 图片元素本身
 */
export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * 将图片元素转换为base64编码, 图片元素的URL必须是同源或者支持跨域访问
 * @param img 图片元素
 * @returns base64编码的图片
 */
export function convertImageToBase64(img) {
  const width = img.naturalWidth;
  const height = img.naturalHeight;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2d context of canvas');
  }
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL();
}

/**
 * 将图片URL地址转换为base64编码, URL必须是同源或者支持跨域访问
 * @param url 图片地址
 * @param fallback 失败的回调函数, 默认返回空字符串
 */
export function loadImageAsBase64(url, fallback = () => '') {
  return loadImage(url)
    .then(convertImageToBase64)
    .catch((err) => fallback(url, err));
}

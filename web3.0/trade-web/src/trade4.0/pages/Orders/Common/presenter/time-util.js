/*
 * @Owner: harry.lai@kupotech.com
 * @Date: 2024-05-14 18:19:33
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-05-14 19:51:55
 * @FilePath: /trade-web/src/trade4.0/pages/Orders/Common/presenter/time-util.js
 */

/** 秒数转换成 [hours, minutes, remainingSeconds] */
export const convertSecondsToHMS = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return [hours, minutes, remainingSeconds].map((i) => `${i}`);
};

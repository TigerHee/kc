/*
 * @Date: 2024-05-27 14:36:02
 * Owner: harry.lai@kupotech.com
 * @LastEditors: harry.lai harry.lai@kupotech.com
 */
/**
 * Owner: willen@kupotech.com
 */

/**
 * 获取时间戳的日期部分
 * @param {*} timestamp
 * @returns ms
 */
export default (timestamp) => {
  const date = new Date(timestamp);
  return date.setHours(0, 0, 0, 0);
};

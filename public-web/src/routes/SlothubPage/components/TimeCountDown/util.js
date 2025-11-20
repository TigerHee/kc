/*
 * @Date: 2024-05-29 15:08:51
 * Owner: harry.lai@kupotech.com
 * @LastEditors: harry.lai harry.lai@kupotech.com
 */

export const padZero = (num) => {
  return String(num).padStart(2, '0');
};

/**
 * 根据传入倒计时配置 隐藏 天数（等） 显示
 * 秒数转换成 [days, hours, minutes, remainingSeconds] 或 [hours, minutes, remainingSeconds] 或 [minutes, remainingSeconds] */
export const convertSecondsToDHMS = (milliseconds, { needDays = true, needHours = true }) => {
  const seconds = Math.floor(milliseconds / 1000);
  const days = Math.floor(seconds / (3600 * 24));
  let remainder = seconds % (3600 * 24);
  const hours = Math.floor(remainder / 3600);
  remainder = remainder % 3600;
  const minutes = Math.floor(remainder / 60);
  const remainingSeconds = remainder % 60;

  let result = [];
  if (needDays) {
    result.push(days);
  }
  if (needHours || (!needHours && !needDays)) {
    result.push(hours);
  }
  result.push(minutes, remainingSeconds);

  return result.map((i) => padZero(i));
};

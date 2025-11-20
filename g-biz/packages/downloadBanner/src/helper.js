/**
 * Owner: iron@kupotech.com
 */
// 判断是否是IOS
export const isIOS = () => {
  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    return true;
  }
  return false;
};

export const checkIsInApp = () => {
  return window.navigator.userAgent.includes('KuCoin');
};

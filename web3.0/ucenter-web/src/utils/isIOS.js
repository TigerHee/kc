/**
 * Owner: willen@kupotech.com
 */
// 判断是否是IOS
export default () => {
  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    return true;
  }
  return false;
};

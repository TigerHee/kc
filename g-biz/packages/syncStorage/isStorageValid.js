/**
 * Owner: garuda@kupotech.com
 * 判断 storage 是否可用
 */
function isStorageValid(type) {
  try {
    return (
      typeof window[type] !== 'undefined' &&
      'setItem' in window[type] &&
      // in IE8 typeof localStorage.setItem === 'object'
      !!window[type].setItem
    );
  } catch (e) {
    return false;
  }
}
export default isStorageValid;

/**
 * Owner: willen@kupotech.com
 */
/**
 * 判断两个版本字符串的大小
 * @param  {string} v1 原始版本
 * @param  {string} v2 目标版本
 * @return {number} 如果原始版本大于目标版本，则返回大于0的数值, 如果原始小于目标版本则返回小于0的数值。
 */

const compareVersion = (v1, v2) => {
  const _v1 = v1.split('.');
  const _v2 = v2.split('.');
  const _r = _v1[0] - _v2[0];

  return _r === 0 && v1 !== v2
    ? compareVersion(_v1.splice(1).join('.'), _v2.splice(1).join('.'))
    : _r;
};

export default compareVersion;

export const compareVersion = (v1: string, v2: string) => {
  const _v1 = v1.split('.');
  const _v2 = v2.split('.');
  const _r = Number(_v1[0]) - Number(_v2[0]);

  return _r === 0 && v1 !== v2
    ? compareVersion(_v1.splice(1).join('.'), _v2.splice(1).join('.'))
    : _r;
};


/**
 * 确保是能够正确解析的JSON字符串
 */
export const safeJSONParse = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null; // 或者返回其他默认值
  }
};

/**
 * Owner: hanx.wei@kupotech.com
 */
// 一百个为一组，切分数组，不足百个的算一组
module.exports = arr => {
  const ret = [];
  const len = Math.ceil(arr.length / 100);
  for (let i = 0; i < len; i++) {
    const start = i * 100;
    ret.push(arr.slice(start, start + 100));
  }
  return ret;
};

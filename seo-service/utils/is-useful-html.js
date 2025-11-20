/**
 * Owner: hanx.wei@kupotech.com
 */
module.exports = (pageText, ssgFlag = 'powered_by_ssg') => {
  if (!pageText || typeof pageText !== 'string') return false;
  const list = [ 'id="root"', "id='root'" ];
  return list.some(text => pageText.includes(text)) && !pageText.includes(ssgFlag);
};

/**
 * Owner: victor.ren@kupotech.com
 */
// 基于根字体计算，默认16px
let DEFAULT_SIZE;

export const px2rem = (px, unit = true) => {
  if (!DEFAULT_SIZE) {
    DEFAULT_SIZE = getDefaultSize();
  }
  return px / DEFAULT_SIZE + (unit ? 'rem' : '');
};

export const getBaseFontSize = () => DEFAULT_SIZE || 16;

function getDefaultSize() {
  const htmlSize = getComputedStyle(document.documentElement)['font-size'] || '16px';
  return Number(htmlSize.match(/\d+/g).join('.'));
}

export default px2rem;

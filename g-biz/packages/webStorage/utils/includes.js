/**
 * Owner: garuda@kupotech.com
 */
const sameValue = (x, y) =>
  x === y || (typeof x === 'number' && typeof y === 'number' && Number.isNaN(x) && Number.isNaN(y));
const includes = (array, searchElement) => {
  const len = array.length;
  let i = 0;
  while (i < len) {
    if (sameValue(array[i], searchElement)) {
      return true;
    }
    i += 1;
  }
  return false;
};
export default includes;

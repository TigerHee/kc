/**
 * Owner: garuda@kupotech.com
 */
const isArray =
  Array.isArray ||
  function isArray(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
export default isArray;

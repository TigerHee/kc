/**
 * Owner: garuda@kupotech.com
 */
const hasOwnProperty = (target, key) => {
  return Object.prototype.hasOwnProperty.call(target, key);
};
export default hasOwnProperty;

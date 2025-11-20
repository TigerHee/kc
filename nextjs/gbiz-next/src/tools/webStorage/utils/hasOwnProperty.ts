/**
 * Owner: garuda@kupotech.com
 */
const hasOwnProperty = (target: any, key: PropertyKey) => {
  return Object.prototype.hasOwnProperty.call(target, key);
};
export default hasOwnProperty;

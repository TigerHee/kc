/**
 * Owner: iron@kupotech.com
 */
import Decimal from 'decimal.js';

export default (str) => {
  if (!str) return '-';
  const e = new Decimal(str);
  return e.toFixed();
};

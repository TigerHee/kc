/**
 * Owner: odan.ou@kupotech.com
 */

import { dropZero } from 'helper';

/**
 *  舍弃小数位0
 *  @param str
 */
export const dropZeroSafe = (str) => {
  try {
    if (Number.isNaN(Number(str))) return str;
    return dropZero(str);
  } catch (err) {
    return str;
  }
};

/**
 * Owner: yang@kupotech.com
 */
import { pull } from 'utils/request';

export const checkXgray = async () => {
  return pull('/_api/anonymous/coloring');
};

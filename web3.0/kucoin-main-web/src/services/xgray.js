/**
 * Owner: Chrise@kupotech.com
 */
import { pull } from 'tools/request';

export const checkXgray = async () => {
  return pull('/_api/anonymous/coloring');
};

/**
 * Owner: chrise@kupotech.com
 */

import { pull } from 'tools/request';

export const checkXgray = async () => {
  return pull('/anonymous/coloring');
};

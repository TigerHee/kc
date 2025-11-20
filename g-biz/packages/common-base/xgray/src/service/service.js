/**
 * Owner: chrise@kupotech.com
 */

import { get } from '@tools/request';

export const checkXgray = async () => {
  return get('/anonymous/coloring');
};

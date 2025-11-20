/**
 * Owner: june.lee@kupotech.com
 */
import { pull } from 'gbiz-next/request';

export const checkXgray = async () => {
  return pull('/_api/anonymous/coloring');
};

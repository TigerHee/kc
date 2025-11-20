/**
 * Owner: eli.xiang@kupotech.com
 */
import { pull } from 'tools/request';

export const getRegGuideTextApi = (params) => {
  return pull('/growth-config/get/client/config/codes', params);
};

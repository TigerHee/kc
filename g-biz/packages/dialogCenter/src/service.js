/**
 * Owner: willen@kupotech.com
 */
import { get } from '@tools/request';

// 获取注册引导弹窗文案
export const getRegGuideText = (params) => {
  return get('/growth-config/get/client/config/codes', params);
};

/**
 * Owner: terry@kupotech.com
 */
import { get } from '@tools/request';

// 获取需要屏蔽的展业中台-配置
export const getCompliantRulers = (params) => {
  return get('/compliance-biz/web/compliance/rule', params, {
    headers: {
      'X-SYSTEM': 'web',
    },
  });
};

export const getPageConfigItems = (params) => {
  return get(`/growth-config/get/client/config/codes`, params);
};

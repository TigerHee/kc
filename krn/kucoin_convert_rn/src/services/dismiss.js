/**
 * Owner: willen@kupotech.com
 */
import {pull} from 'utils/request';

// 获取dismiss数据
export const queryIpDismiss = data => {
  return pull('/user-dismiss/ip-dismiss/notice', data);
};

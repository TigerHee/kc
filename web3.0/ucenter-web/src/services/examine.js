/**
 * Owner: lena@kupotech.com
 */
import { pull } from 'tools/request';
export const queryExamine = (params) => pull('/user-dismiss/ip-dismiss/notice', params);

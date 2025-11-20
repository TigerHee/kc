/**
 * Owner: iron@kupotech.com
 */
import { post } from '@tools/request';

// 上传用户gps信息
export async function uploadGPS(params) {
  return post('/user-biz-front/user/event/gps', params, false);
}

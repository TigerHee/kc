/**
 * Owner: iron@kupotech.com
 */
import { postJson } from 'tools/request';

// 上传用户gps信息
export async function uploadGPS(params: any) {
  return postJson('/user-biz-front/user/event/gps', params);
}

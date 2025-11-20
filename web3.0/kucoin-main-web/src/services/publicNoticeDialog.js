/**
 * Owner: willen@kupotech.com
 */
import { pull, post } from 'tools/request';

// 获取消息
export async function queryNotice(data) {
  return pull('/kucoin-config/notice', data);
}

// 发送消息回执
export async function sendNoticeCallback(data) {
  return post('/kucoin-config/callback/notice', data);
}

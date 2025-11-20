/**
 * Owner: willen@kupotech.com
 */
import { pull, postJson } from 'gbiz-next/request';

// 获取消息
export async function queryNotice(data) {
  return pull('/kucoin-config/notice', data);
}


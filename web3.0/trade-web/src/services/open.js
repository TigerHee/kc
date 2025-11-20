/**
 * Owner: borden@kupotech.com
 */
import { pull } from 'utils/request';

// 获取系统可用语言列表
export async function getLangList() {
  return pull('/kucoin-config/web/international/config-list');
}

// 获取服务器时间
export async function getServerTime() {
  return pull('/timestamp');
}

/**
 * Owner: willen@kupotech.com
 */
import { pull } from 'tools/request';

const prefix = '/market-operation';

// 获取topic列表
export async function getTopicList(params) {
  return pull(`${prefix}/creators/topic/list`, params);
}

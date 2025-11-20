/**
 * Owner: willen@kupotech.com
 */
import { pull as originPull, postJson } from 'gbiz-next/request';

const pull = originPull;

const prefix = '/message-center/mc/open/letter/web';

// 查询用户场内推送历史
export async function pullEvents({
  beginSn, // 起始 sn
  isReverse, // 是否逆序，default false
  maxCount, // 最大条数，default 20
  subjects, // 业务主题，不传不限制
}) {
  return pull(`${prefix}/list`, {
    gmtCreated: beginSn,
    isReverse,
    maxCount,
    templateCodes: subjects,
  });
}

// 查询未读消息数
export async function getUnreadCount(subjects) {
  return pull(`${prefix}/unread/sum`, { templateCodes: subjects });
}


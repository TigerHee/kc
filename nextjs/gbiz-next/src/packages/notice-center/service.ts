/**
 * Owner: willen@kupotech.com
 */
import { pull, postJson } from 'tools/request';

const prefix = '/message-center/mc/open/letter/web';

// 查询用户场内推送历史
export async function pullEvents({
  beginSn, // 起始 sn
  isReverse, // 是否逆序，default false
  maxCount, // 最大条数，default 20
  subjects, // 业务主题，不传不限制
}: {
  beginSn: number;
  isReverse: boolean;
  maxCount?: number;
  subjects?: string[];
}) {
  return pull(`${prefix}/list`, {
    gmtCreated: beginSn,
    isReverse,
    maxCount,
    templateCodes: subjects,
  });
}

// 查询未读消息数
export async function getUnreadCount(subjects?: string[]) {
  return pull(`${prefix}/unread/sum`, { templateCodes: subjects });
}

// 标记已读
// mark ture=表示全部，false表示部分，用于标记全部已读。或全部删除，当eventIds优先级>mark
export async function setRead({ eventIds, mark }) {
  return postJson(
    `${prefix}/read`,
    {
      ids: eventIds,
      mark,
    },
  );
}

// 标记删除
// mark ture=表示全部，false表示部分，用于标记全部已读。或全部删除，当eventIds优先级>mark
export async function setDelete({ eventIds, mark }) {
  return postJson(
    `${prefix}/delete`,
    {
      ids: eventIds,
      mark,
    },
  );
}

export async function getUserKyc() {
  /*
  {
  "code": "string",
  "data": {
    "kyc": true,
    "kycName": "string"
  },
  "msg": "string",
  "retry": true,
  "success": true
}
  */
  return pull('/otc/user/kycInfo');
}

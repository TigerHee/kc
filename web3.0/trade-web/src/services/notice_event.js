/**
 * Owner: borden@kupotech.com
 */
import _ from 'lodash';
import { pull, post } from 'utils/request';

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

// 标记已读
// mark ture=表示全部，false表示部分，用于标记全部已读。或全部删除，当eventIds优先级>mark
export async function setRead({ eventIds, mark }) {
  return post(
    `${prefix}/read`,
    {
      ids: eventIds,
      mark,
    },
    false,
    true,
  );
}

// 标记删除
// mark ture=表示全部，false表示部分，用于标记全部已读。或全部删除，当eventIds优先级>mark
export async function setDelete({ eventIds, mark }) {
  return post(
    `${prefix}/delete`,
    {
      ids: eventIds,
      mark,
    },
    false,
    true,
  );
}

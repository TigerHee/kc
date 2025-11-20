/**
 * Owner: gavin.liu1@kupotech.com
 */
import { pullWrapper } from 'utils/pullCache';
import { pull as originPull } from 'tools/request';

const pull = pullWrapper(originPull);

// NOTE: 因为一页可能有多个组件，但数据是唯一的，我们缓存起来
const getCache = (key) => {
  const cacheGlobal = window.__gbiz_share_cache__ || {};
  if (cacheGlobal[key]) {
    return cacheGlobal[key];
  }
  return null;
};
const setCache = (key, value) => {
  const cacheGlobal = window.__gbiz_share_cache__ || {};
  cacheGlobal[key] = value;
  window.__gbiz_share_cache__ = cacheGlobal;
};

const getShareData = async () => {
  const cache = getCache('shareData');
  if (cache) {
    return Promise.resolve(cache);
  }
  try {
    const res = await pull(`/promotion/v1/invitation/share-to-friends`);
    setCache('shareData', res);
    return res;
  } catch {
    return;
  }
};
const getUserInfo = () => pull(`/ucenter/user-info`);

export const getUcenterUserInfo = async () => {
  const tasks = [getUserInfo(), getShareData()];
  const [userInfo, shareData] = await Promise.all(tasks);
  const oldRcode = userInfo?.data?.referralCode;
  const newRcode = shareData?.data?.referralCode;
  if (oldRcode?.length && newRcode?.length) {
    // FIXME: 产品要求 2.0 和 3.0 的 rcode 可以千变万化，所以我们附加旧的 rcode 。
    userInfo.data.originReferralCode = oldRcode;
    userInfo.data.referralCode = newRcode;
  }
  return userInfo;
};

/**
 * Owner: gavin.liu1@kupotech.com
 */
import { pull } from 'utils/request';

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

const getUserInfo = () => {
  return pull(`/ucenter/user-info`);
};

export const getUcenterUserInfo = async () => {
  const tasks = [getUserInfo(), getShareData()];
  const [userInfo, shareData] = await Promise.all(tasks);
  const newRcode = shareData?.data?.referralCode;
  if (userInfo?.data?.referralCode?.length && newRcode?.length) {
    userInfo.data.referralCode = newRcode;
  }
  return userInfo;
};

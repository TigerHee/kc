/**
 * Owner: jesse.shao@kupotech.com
 */
import { pull, post } from 'utils/request';

// 获取4周年配置
export const getAnniversaryConfig = () => pull(`/platform-activity/activity-post/config`);

// 获取服务器时间
export const getServerTime = () => pull(`/timestamp`);

// 获取活动帖子列表
export const getActivityPosts = params => pull('/platform-activity/activity-post/page', params);

// 我的中奖记录
export const getRewards = params => pull('/platform-activity/activity-post/reward', params);

// type 类型，1币种，2组合，3评论, 11帖子评论，10帖子
export function handleLike(itemId, type, zan, ownership, topComment = true) {
  return post(
    '/reaper/item-detail/like',
    { itemId, type, zan, ownership, topComment },
    false,
    true,
  );
}

// 获取话题帖详情
export const getTopicDetail = params => {
  return pull(`/reaper-social/api/posts/topic/get_topic_details`, params);
}


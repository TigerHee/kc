/**
 * Owner: jesse.shao@kupotech.com
 */
import { post, pull } from 'utils/request';

const prefix = '/platform-markting/user-recall';

// 获取用户在当前活动的信息
export async function getRecallInfo() {
  // return pull(`http://10.40.0.133:10001/mock/85/user-recall/info`);
  return pull(`${prefix}/info`);
}

// 获取指定recordId的活动信息
export async function getRecallInfoById({ recordId }) {
  return pull(`${prefix}/info/${recordId}`);
}

// 抽取对应阶段的奖金
export async function recallDraw(data) {
  return post(`${prefix}/bonus/generate`, data, false, true);
}

// 领取对应阶段的奖金
export async function recallReceive(data) {
  return post(`${prefix}/bonus/take`, data, false, true);
}

// 提现对应阶段的奖金
export async function recallWithdraw(data) {
  return post(`${prefix}/bonus/withdraw`, data, false, true);
}

// 获取召回推荐币种列表
export async function getRecommendCoins() {
  return pull('/platform-markting/recommend/currency/list');
}

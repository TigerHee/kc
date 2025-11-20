/**
 * Owner: tom@kupotech.com
 */
import { pull, post, postJson } from 'tools/request';

const prefix = '/listing-center';

// 项目申请入口判断
export function getSummary(data) {
  return pull(`${prefix}/project/apply/summary`, data);
}

// 项目申请保存草稿
export function saveDraft(data) {
  return postJson(`${prefix}/project/apply/draft`, data);
}

// 提交项目申请
export function applySubmit(data) {
  return postJson(`${prefix}/project/apply/submit`, data);
}

// 文件上传
export function uploadFile(data) {
  return post(`${prefix}/uploadFile`, data);
}

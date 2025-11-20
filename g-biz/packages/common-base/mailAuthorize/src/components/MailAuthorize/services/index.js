/**
 * Owner: tiger@kupotech.com
 */
import { post, get } from '@tools/request';

const prefix = '/validation-email';

// 授权前置风控校验
export async function checkRisk(params) {
  return post(`${prefix}/email/risk-check`, params, false);
}

// 重新发送授权邮件
export async function resendEmail(params) {
  return post(`${prefix}/email/resend`, params, false);
}

// 查询授权结果
export async function queryResult(params) {
  return get(`${prefix}/email/query`, params);
}

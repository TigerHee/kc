/**
 * Owner: tiger@kupotech.com
 */
import { postJson, pull as get, upload } from 'tools/request';

const prefix = '/kyc';

// 提交pan码和panCard
export async function submitPan(param) {
  return postJson(`${prefix}/web/kyc/submit/pan`, param, false, {
    timeout: 20000,
  });
}

// 获取pan状态
export async function getPanStatus(param) {
  return get(`${prefix}/web/kyc/get/pan/number/status`, param);
}

// 上传文件
export const uploadFile = params => {
  return upload(`${prefix}/web/kyc/file/upload`, {
    data: params,
    timeout: 30000,
  });
};

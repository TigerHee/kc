/**
 * Owner: tiger@kupotech.com
 */
import { post, pull } from 'tools/request';

const prefix = '/common-basis';

export const getExportRemainTimes = () => {
  return pull(`${prefix}/bill/export/generate/re-times`);
};

/**
 * 获取子账号列表
 */
export async function getSubUserList() {
  return pull(`${prefix}/bill/export/sub-user/list`);
}

// 生成账户账单
export function exportAccountStatementBill(data) {
  return post(`${prefix}/bill/export/daily-monthly/statement/generate`, data, false, true);
}

export const postExport = (params) => {
  return post(`${prefix}/bill/export/generate`, params, false, true);
};

// 查询当前账单导出排队情况
export const getExportQueue = (params) => {
  // return pull(`http://10.40.0.133:10001/mock/85/bill/export/queue-number`);
  return pull(`${prefix}/bill/export/queue-number`);
};

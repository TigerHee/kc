/**
 * Owner: willen@kupotech.com
 */
import { post, pull } from 'tools/request';

const prefix = '/download';

// 下载记录
export function getRecords(params) {
  return pull(`${prefix}/records`, params);
}

// 下载记录
export function getRecordsV2(params) {
  return pull(`${prefix}/records-multiple-downloads`, params);
}

// 新建泰国站税票下载请求
export function requestDownloadInvoice(data) {
  return post('/tax-invoice/invoice/download/create', data, false, true);
}

// 获取泰国站税票下载请求剩余次数
export function getExportRemainTimesTH(params) {
  return pull('/tax-invoice/invoice/download/remainingNumber', params);
}

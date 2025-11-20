/**
 * Owner: willen@kupotech.com
 */
import { pull, post } from 'tools/request';

const prefix = '/price-warn';

/**
 * 获取警报日志
 * @param isReverse 是否倒序
 * @param maxCount 最大记录数
 * @param templateCodes 价格预警相关：notification.risen.to、notification.fell.to
 */
export function fetchLogs(params) {
  return pull('/message-center/mc/open/letter/web/list', params);
}

/**
 * 获取价格预警
 * @param symbol
 */
export function fetch(params) {
  return pull(`${prefix}/warn/users`, params);
}

/**
 * 创建价格预警
 * @param symbol
 * @param noticeType 通知类型 0-站内 1-短信 2-邮件 （目前只有站内通知)
 * @param warnAmount 告警价格或者涨跌幅
 * @param warnType 告警类型 0-上涨至 1-下跌至 2-涨幅 3-跌幅
 */
export function create(params) {
  return post(`${prefix}/warn/create`, params);
}

/**
 * 更新价格预警
 * @param id 记录Id
 * @param symbol
 * @param noticeType 通知类型 0-站内 1-短信 2-邮件 （目前只有站内通知)
 * @param warnAmount 告警价格或者涨跌幅
 * @param warnType 告警类型 0-上涨至 1-下跌至 2-涨幅 3-跌幅
 */
export function update(params) {
  return post(`${prefix}/warn/update`, params);
}

/**
 * 删除价格预警
 * @param id 记录Id
 */
export function remove(params) {
  return post(`${prefix}/warn/delete`, params);
}

/**
 * 启用价格预警
 * @param id 记录Id
 */
export function active(params) {
  return post(`${prefix}/warn/active`, params);
}

/**
 * 暂停价格预警
 * @param id 记录Id
 */
export function stop(params) {
  return post(`${prefix}/warn/stop`, params);
}

/**
 * 增加交易对行情推送配置
 */
export function creactPriceNotify(params) {
  return post('/quotes-push/priceNotify/add', params);
}
/**
 * 修改价格预警或行情推送状态
 */
export function changeStatus(params) {
  return post('/quotes-push/priceNotify/changeStatus', params);
}
/**
 * 删除价格预警或交易对行情推送配置
 */
export function deletePriceNotify(params) {
  return post('/quotes-push/priceNotify/delete', params);
}
/**
 * 获取用户价格预警或行情推送-需要登录
 */
export function queryPriceNotifyList(params) {
  return pull('/quotes-push/priceNotify/list', params);
}

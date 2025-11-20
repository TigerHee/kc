/**
 * Owner: mike@kupotech.com
 */
import { RobotHttp } from 'Bot/utils/request';
/**
 * 获取机器人历史信息 （历史订单）
 */
export function getHistoryLists(params) {
  return RobotHttp.get('/v1/profit/own/web-page', {
    pageNo: 1,
    pageSize: 100,
    ...params,
  });
}

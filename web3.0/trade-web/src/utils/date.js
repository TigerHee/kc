/**
 * Owner: odan.ou@kupotech.com
 */
import moment from 'moment';
import { padStart } from 'lodash';

/**
 * 获取 UTC 0 的小时和分钟时间
 * @param {*} time
 * @param {{
 *  defVal?: string,
 * }} [conf]
 * @returns { [string, string]}
 */
export const getHMTime = (time, conf) => {
  const { defVal = '--' } = conf || {};
  if (!time) return [defVal, defVal];
  const timeMoment = moment(time).utcOffset(0);
  const h = timeMoment.hours();
  const m = timeMoment.minutes();
  return [padStart(h, 2, '0'), padStart(m, 2, '0')];
};

/**
 * 比较两个时间的差异
 * @param {*} oldTime
 * @param {*} newTime
 * @param {{
 *  toAbs?: boolean
 * }} conf
 */
export const getDiffTime = (oldTime, newTime, conf) => {
  if (!oldTime || !newTime) return undefined;
  const { toAbs = true } = conf || {};
  const diffVal = moment(newTime).diff(moment(oldTime));
  return toAbs ? Math.abs(diffVal) : diffVal;
};

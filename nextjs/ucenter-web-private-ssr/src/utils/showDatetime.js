/**
 * Owner: willen@kupotech.com
 */
import { toNumber } from 'lodash-es';
import moment from 'moment';

/**
 * 时间戳格式化
 * 按本地时区格式化
 * @param timestamp ms
 * @param format
 * @returns {string}
 */
export default (timestamp, format = 'YYYY/MM/DD HH:mm:ss') => {
  return moment(toNumber(timestamp)).format(format);
};

/**
 * Owner: willen@kupotech.com
 */
import moment from 'moment';
import _ from 'lodash';

/**
 * 时间戳格式化
 * 按本地时区格式化
 * @param timestamp ms
 * @param format
 * @returns {string}
 */
export default (timestamp, format = 'YYYY/MM/DD HH:mm:ss') => {
  return moment(_.toNumber(timestamp)).format(format);
};

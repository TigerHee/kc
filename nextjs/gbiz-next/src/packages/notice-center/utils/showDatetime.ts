/**
 * Owner: willen@kupotech.com
 */
import dayjs from 'dayjs';
import _ from 'lodash-es';

/**
 * 时间戳格式化
 * 按本地时区格式化
 * @param timestamp ms
 * @param format
 * @returns {string}
 */
export default (timestamp, format = 'YYYY/MM/DD HH:mm:ss') => {
  return dayjs(_.toNumber(timestamp)).format(format);
};

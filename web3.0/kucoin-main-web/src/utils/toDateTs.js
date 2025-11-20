/**
 * Owner: willen@kupotech.com
 */
import moment from 'moment';

export default function toDateTs(timestamp) {
  const date = moment(timestamp).format('YYYY-MM-DD');
  return moment(date).valueOf();
}

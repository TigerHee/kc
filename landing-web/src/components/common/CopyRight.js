/**
 * Owner: terry@kupotech.com
 */
import moment from 'moment';
import { _t } from 'src/utils/lang';

export default () => {
  return _t('legao.copy.right', { endYear: moment().year() })
}
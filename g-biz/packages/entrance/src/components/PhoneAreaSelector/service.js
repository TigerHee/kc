/**
 * Owner: tiger@kupotech.com
 */
import { debounce } from 'lodash';
import { get } from '@tools/request';

export const getUserArea = debounce(
  (param) => {
    return get('/universal-core/ip/country', param);
  },
  400,
  {
    'leading': true,
    'trailing': false,
  },
);

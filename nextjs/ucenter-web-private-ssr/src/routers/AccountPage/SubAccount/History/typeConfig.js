/**
 * Owner: tiger@kupotech.com
 */

import Login from 'routes/AccountPage/SubAccount/History/Login';
import Transfer from 'routes/AccountPage/SubAccount/History/Transfer';

export const HISTORY_TYPES = [
  {
    label: 'sRQ5mGRym4iZb4aCSVdV2u',
    key: 'transfer',
    component: (props = {}) => <Transfer {...props} />,
  },
  {
    label: 'iBuBZDTHtpkYUPrUE3vMeA',
    key: 'login',
    component: (props = {}) => <Login {...props} />,
  },
];

export const HISTORY_TYPES_MAP = HISTORY_TYPES.reduce((prevValue, currentValue) => {
  prevValue[currentValue.key] = currentValue;
  return prevValue;
}, {});

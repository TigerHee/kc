/**
 * Owner: john.zhang@kupotech.com
 */

import { _t } from 'src/tools/i18n';
import { sentryReport } from 'src/tools/sentry';
import { FAILURE, INIT, PROCESSING, ROLLBACK_SUCCESS, SUCCESS } from './constants';

export const getStatusInfo = (stauts) => {
  const map = {
    [INIT]: {
      label: _t('1934a41c92244800ab44'),
      colorType: 'complementary',
    },
    [PROCESSING]: {
      label: _t('98f99b84e34a4800aa6d'),
      colorType: 'default',
    },
    [SUCCESS]: {
      label: _t('d4ad8e4608054800a05f'),
      colorType: 'primary',
    },
    [FAILURE]: {
      label: _t('6dfee078283d4800ae77'),
      colorType: 'secondary',
    },
    [ROLLBACK_SUCCESS]: {
      label: _t('f84e78c6d9764800a9a4'),
      colorType: 'primary',
    },
  };
  return map[stauts];
};

export const reportZbxErrorToSentry = (message) => {
  sentryReport({
    level: 'warning',
    message,
    tags: {
      errorType: 'zbx_error',
    },
    fingerprint: 'zbx_error',
  });
};

/**
 * Owner: john.zhang@kupotech.com
 */

import { useSnackbar } from '@kux/mui';
import { _t } from 'src/tools/i18n';

export const useMessageErr = () => {
  const { message } = useSnackbar();
  return (err) => {
    const msg = typeof err === 'string' ? err : err?.msg || _t('792684254c054800a2a0');
    message.error(msg);
  };
};

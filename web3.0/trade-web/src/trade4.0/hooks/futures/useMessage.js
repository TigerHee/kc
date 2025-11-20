/**
 * Owner: clyne@kupotech.com
 */

import { useSnackbar } from '@kux/mui';

export const useMessage = () => {
  const { message } = useSnackbar();

  return { message };
};

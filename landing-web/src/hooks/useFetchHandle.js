/**
 * Owner: odan.ou@kupotech.com
 */
import { useCallback } from 'react';
import useSnackbar from '@kufox/mui/hooks/useSnackbar';
import { fetchHandle } from 'utils/request';

/**
 * fetchHandle 增加 message
 * import { ThemeProvider } from '@kufox/mui';
 * 最外层需要 ThemeProvider
 */
const useFetchHandle = () => {
  const { message } = useSnackbar?.() || {};
  const fn = useCallback((response, conf) => {
    return fetchHandle(response, {
      message,
      ...conf,
    })
  }, [message]);
  return fn;
};

export default useFetchHandle;
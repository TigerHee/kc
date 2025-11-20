/**
 * Owner: odan.ou@kupotech.com
 */
import { useCallback, useMemo, useRef } from 'react';
import { useSnackbar } from '@kufox/mui';
import { useRequest } from 'ahooks';
import { fetchHandle } from 'src/tools/requestHandle';
import { _t } from 'tools/i18n';
import useLoading from './useLoading';

/**
 * fetchHandle 增加 message
 * import { ThemeProvider } from '@kufox/mui';
 * 最外层需要 ThemeProvider
 */
const useFetchHandle = (initLoading = false) => {
  const { message } = useSnackbar?.() || {};
  const { loading, onLoading } = useLoading(initLoading);
  const fn = useCallback(
    (response, conf) => {
      if (!response) return Promise.resolve();
      const onLoadingEnd = onLoading();
      return fetchHandle(response, {
        message,
        ...conf,
      }).finally(onLoadingEnd);
    },
    [message],
  );
  return useMemo(() => {
    return {
      fetchHandle: fn,
      loading,
    };
  }, [loading, fn]);
};

export default useFetchHandle;

/**
 * 处理请求
 * @param {Parameters<useRequest>[0]} api
 * @param {Parameters<useRequest>[1] & {
 *  params?: Record<string, any>,
 *  initData?: any,
 *  getInitData?: (data) => boolean,
 * }} [conf]
 */
// export const useRequestHandle = (api, conf) => {
//   const { message } = useSnackbar?.() || {};
//   const { params, initData, getInitData, ...useReqConf } = conf || {};
//   const initDataRef = useRef(initData);
//   const reqHandle = useCallback(() => {
//     if (typeof api !== 'function') return Promise.reject();
//     return api(params).then((res) => res.data);
//   }, [params, api]);

//   let res = useRequest(reqHandle, {
//     onError: (e) => {
//       message?.error(String(e?.msg || e?.message || e || _t('trade.verify.init.fail')));
//     },
//     ...useReqConf,
//   });
//   if (res.data === undefined || (typeof getInitData === 'function' && getInitData(res.data))) {
//     res = {
//       ...res,
//       data: initDataRef.current,
//     };
//   }
//   return res;
// };

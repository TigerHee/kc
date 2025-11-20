/**
 * Owner: odan.ou@kupotech.com
 */
import { useSnackbar } from '@kux/mui';
import { useRequest } from 'ahooks';
import { useCallback, useRef } from 'react';
import { _t } from 'tools/i18n';

/**
 * 处理请求
 * @param {Parameters<useRequest>[0]} api
 * @param {Parameters<useRequest>[1] & {
 *  params?: Record<string, any>,
 *  initData?: any,
 *  getInitData?: (data) => boolean,
 * }} [conf]
 */
const useFetch = (api, conf) => {
  const { message } = useSnackbar?.() || {};
  const { params, initData, getInitData, ...useReqConf } = conf || {};
  const initDataRef = useRef(initData);
  const reqHandle = useCallback(
    (newParams) => {
      if (typeof api !== 'function') return Promise.reject();
      return api({ ...params, ...newParams }).then((res) => res.data);
    },
    [params, api],
  );

  let res = useRequest(reqHandle, {
    onError: (e) => {
      message?.error(String(e?.msg || e?.message || e || _t('failed')));
    },
    ...useReqConf,
  });
  if (res.data === undefined || (typeof getInitData === 'function' && getInitData(res.data))) {
    res = {
      ...res,
      data: initDataRef.current,
    };
  }
  return res;
};

export default useFetch;

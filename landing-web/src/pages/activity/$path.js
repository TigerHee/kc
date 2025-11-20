/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'dva';
import loadable from '@loadable/component'
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';

const TemplatePage = loadable(() => import('components/$/LeGoActivity/templates'));
const Loading = loadable(() => import('components/Loading'));
const LeGoActivity = ({
  match: {
    params: { path },
  },
  history,
}) => {
  const dispatch = useDispatch();
  const [isOkUrl, setIsOkUrl] = useState(false);

  const go404 = useCallback((e) => {
    if (e?.code === '110020') {
      import('@kc/sentry').then(res => {
        const sentry = res.default;
        sentry?.captureEvent?.({
          message: `landing-web 乐高2.0 数据404, code: ${e?.code}, pageUrl: ${encodeURIComponent(
            window.location.href,
          )}`,
          level: 'info',
          tags: { legoDataFailed: 'failed' },
        });
      })
      location.href = '/404';
    }
  }, []);

  useEffect(async () => {
    try {
      const { code, success } = await dispatch({
        type: 'legoActivityPage/getActivityConfig',
        online: true,
        payload: { subject: path },
      });
      if (success) {
        setIsOkUrl(true);
      } else {
        go404({ code });
      }
    } catch (e) {
      // 未配置的path 跳转至404
      go404(e);
    }
  }, []);

  if (isOkUrl) {
    return <TemplatePage />;
  }

  return <Loading />;
};

export default brandCheckHoc(React.memo(LeGoActivity), () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));

/**
 * Owner: terry@kupotech.com
 */
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'dva';
import loadable from '@loadable/component';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';
import styles from './style.less';

const Loading = loadable(() => import('components/Loading'));
const Preview = loadable(() => import('components/$/LeGoActivity/preview'));


const LeGoActivityPreview = ({
  match: {
    params: { path },
  },
  history,
}) => {
  const dispatch = useDispatch();
  const [isOkUrl, setIsOkUrl] = useState(false);

  const go404 = useCallback((e) => {
    if (e?.code === '110020') {
      history.replace('/404');
    }
  }, []);

  useEffect(async () => {
    try {
      const { code, success } = await dispatch({
        type: 'legoActivityPage/getActivityConfig',
        online: false,
        payload: { id: path },
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
    return (
      <section className={styles.preview}>
        <Preview />
      </section>
    );
  }

  return <Loading />;
};

export default brandCheckHoc(LeGoActivityPreview, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));

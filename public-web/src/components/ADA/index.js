/**
 * Owner: lori@kupotech.com
 */
import history from '@kucoin-base/history';
import { useMediaQuery } from '@kufox/mui';
import { useEffect, useState } from 'react';

import { getAdaEntraceConfig } from 'services/user';
import { useSelector } from 'src/hooks/useSelector';
import { IS_TEST_ENV, _DEV_ } from '../../utils/env';
import Ada from './RemoteAda';

export default () => {
  const isH5 = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const _pathname = history.location.pathname;
  const { user } = useSelector((state) => state.user);
  const [source, setSource] = useState();
  const [res, setRes] = useState({});

  // 获取数据
  useEffect(async () => {
    try {
      const res = await getAdaEntraceConfig();
      setRes(res);
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    const { success, data } = res || {};
    const showAda = (item) => {
      const { serviceType = 'ADA', source } = item || {};
      // default 是 app 页面中使用的
      return source !== 'default' && serviceType === 'ADA';
    };
    if (success) {
      const { open, source } =
        (data || []).find((i) => _pathname.includes(i.entryUrl) && showAda(i)) || {};
      setSource(open ? source : '');
    }
  }, [res, _pathname]);

  if (!source || isH5) {
    return null;
  }

  return <Ada userInfo={user} isDev={_DEV_ || IS_TEST_ENV} source={source} />;
};

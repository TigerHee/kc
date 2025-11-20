/**
 * Owner: lori@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'src/hooks/useSelector';
import history from '@kucoin-base/history';
import { getAdaEntraceConfig } from 'services/user';
import { useMediaQuery } from '@kufox/mui';
import Ada from './RemoteAda';
import { _DEV_, IS_TEST_ENV } from '../../utils/env';

export default () => {
  const isH5 = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const _pathname = history.location.pathname;
  const { user } = useSelector((state) => state.user);
  const [source, setSource] = useState();
  const [res, setRes] = useState({});
  const isEarnAccount = _pathname.includes('/assets/earn-account');

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
    if (success) {
      const { open, source } = (data || []).find((i) => _pathname.includes(i.entryUrl)) || {};
      setSource(open ? source : '');
    }
  }, [res, _pathname]);

  if (!source || isH5 || isEarnAccount) {
    return null;
  }

  return <Ada userInfo={user} isDev={_DEV_ || IS_TEST_ENV} source={source} />;
};

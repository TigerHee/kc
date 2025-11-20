/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-18 14:05:28
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-25 14:46:47
 */
import { isBoolean } from 'lodash';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useRequest from 'src/hooks/useRequest';
import { useSelector } from 'src/hooks/useSelector';
import { getProjectDetails } from 'src/services/slothub';
import { useStore } from '../store';

export const useInitAndPullProjectDetailFnc = () => {
  const { currency } = useParams();
  const { dispatch } = useStore();
  const isLogin = useSelector((state) => state.user.isLogin);

  const { run, refresh } = useRequest(() => getProjectDetails(currency), {
    refreshOnWindowFocus: true,
    manual: true,
    onSuccess: ({ success, data }) => {
      if (!success) return;
      dispatch({ type: 'updateProjectDetail', payload: data });
    },
  });

  // 注册刷新详情信息
  useEffect(() => {
    dispatch({ type: 'registerRefreshProjectDetail', payload: refresh });
    return () => {
      dispatch({ type: 'destroyRefreshProjectDetail' });
    };
  }, [dispatch, refresh]);

  // app内登录重新获取详情
  useEffect(() => {
    if (!currency || !isBoolean(isLogin)) return;
    run();
  }, [currency, run, isLogin]);
};

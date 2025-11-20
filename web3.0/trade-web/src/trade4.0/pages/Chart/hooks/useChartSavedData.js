/**
 * Owner: jessie@kupotech.com
 */
import { useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import { namespace } from '@/pages/Chart/config';
import storage from '@/pages/Chart/utils/index';

const { getItem, setItem } = storage;

/**
 * 用于k线存储 (服务器端和本地存储)
 * 需存储内容
 * 时间周期、K线类型、指標&策略、时间周期收藏、K线类型收藏、指標&策略收藏
 * 未登录时使用本地存储，登陆后使用服务器端
 */

// 初始化，获取k线存储信息
export const useChartSavedDataInit = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (user) {
      // 服务器端存储内容
      dispatch({ type: `${namespace}/pullKlineConf`, payload: { user } });
    }
  }, [user, dispatch]);
};

export const useChartSavedData = () => {
  const dispatch = useDispatch();

  const handleChartDataSave = useCallback(
    (key, value) => {
      dispatch({
        type: `${namespace}/updateKlineConf`,
        payload: {
          pri_dict_value: key,
          pri_data_value: JSON.stringify(value),
        },
      });
      setItem(key, value);
    },
    [dispatch],
  );

  const updateKlineConf = useCallback(debounce(handleChartDataSave, 1000), []);

  return {
    updateKlineConf,
  };
};

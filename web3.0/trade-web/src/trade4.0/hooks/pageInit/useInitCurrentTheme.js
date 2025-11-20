/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-06-20 21:32:58
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-06-20 22:06:38
 * @FilePath: /trade-web/src/trade4.0/hooks/pageInit/useInitCurrentTheme.js
 * @Description:
 */
import { useEffect } from 'react';
import { useDispatch } from 'dva';
import { useTheme } from '@emotion/react';
import storage from 'utils/storage';
import kcStorage from '@kucoin-base/kcStorage';

export default function useInitCurrentTheme() {
  const dispatch = useDispatch();
  const { setTheme } = useTheme();
  useEffect(() => {
    async function init() {
      // 防止总开关屏蔽后交易大厅切换功能失效
      const currentTheme =
        kcStorage?.getItem('theme') || storage.getItem('theme.current') || 'dark';
      dispatch({
        type: 'theme/update',
        payload: {
          current: currentTheme,
        },
      });
      setTheme(currentTheme);
    }
    init();
  }, []);
}

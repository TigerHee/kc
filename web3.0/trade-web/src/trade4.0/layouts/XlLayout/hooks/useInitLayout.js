/*
 * owner: Borden@kupotech.com
 */
import { useEffect } from 'react';
import { each, isBoolean, pickBy } from 'lodash';
import { useDispatch, useSelector } from 'dva';
import { DEFAULT_LAYOUTS, DEFAULT_LAYOUTS_MAP } from '../layout';
import { getItem, checkExpire, getCurrentLayoutFromStorage } from '../storage';

export default function useInitLayout() {
  const dispatch = useDispatch();
  const isLogin = useSelector(state => state.user.isLogin);

  useEffect(() => {
    checkExpire();
  }, []);

  useEffect(() => {
    const initCurrentLayout = getCurrentLayoutFromStorage();
    const initLayouts = {};
    each(DEFAULT_LAYOUTS, (item) => {
      const { code, name } = item;
      const layoutConfig = getItem(code);
      initLayouts[code] = {
        code,
        name,
        layoutConfig,
      };
    });
    const saveData = (a = initLayouts, b = initCurrentLayout) => {
      dispatch({
        type: 'setting/update',
        payload: {
          layouts: a,
        },
      });
      dispatch({
        type: 'setting/updateLayout',
        payload: {
          currentLayout: b,
        },
      });
    };
    if (isLogin) {
      // 拉取所有布局
      dispatch({
        type: 'setting/getLayouts',
      }).then((data) => {
        if (!data?.length) {
          saveData();
        } else {
          let _currentLayout;
          const _layouts = {};
          each([...data, ...DEFAULT_LAYOUTS], (item) => {
            const { layoutConfig, isActive, code } = item;
            if (!_layouts[code]) {
              _layouts[code] = {
                code,
                ...initLayouts[code],
                ...pickBy(item, v => (v || isBoolean(v))),
                ...code ? { isCustomize: !DEFAULT_LAYOUTS_MAP[code] } : null,
              };
              try {
                _layouts[code].layoutConfig = JSON.parse(layoutConfig);
              } catch (e) {
                console.log(`getLayouts parse ${code}`, e);
              }
              if (!_currentLayout && isActive) {
                _currentLayout = code;
              }
            }
          });
          saveData(_layouts, _currentLayout || initCurrentLayout);
        }
      }).catch((e) => {
        saveData();
        console.log('getLayouts', e);
      });
    } else if (isLogin === false) {
      saveData();
    }
  }, [isLogin]);
}

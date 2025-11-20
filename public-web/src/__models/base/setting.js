/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import base from 'common//models/base';
import extend from 'dva-model-extend';
import { filter } from 'lodash';
import { kcLocalStorage } from 'src/utils/storage';

const DARK = 'dark';
const LIGHT = 'light';
const defaultTheme = LIGHT;
// 显示黑白模式切换的路径
// const themeSwithPath = [];
const themeSwithPath = [
  '/download',
  '/pre-market',
  '/gemspace',
  '/gempool',
  '/gemvote',
  '/information',
  '/spotlight-center',
  '/spotlight_r8',
  '/user-guide',
];

const getAppTheme = (pathname, localTheme) => {
  if (!location?.href) return;

  let appTheme;
  // 以night为主，没有night参数再判断theme参数
  if (location.href.includes('night')) {
    appTheme = location.href.includes('night=true') ? DARK : LIGHT;
  } else if (location.href.includes('theme')) {
    appTheme = location.href.includes('theme=dark') ? DARK : LIGHT;
  }

  // url没带主体参数，取本地
  if (!appTheme) {
    appTheme = localTheme || defaultTheme;
  }
  // 除视频页面不区分黑白模式
  if (pathname?.indexOf('/user-guide') === -1) {
    appTheme = LIGHT;
  }

  if (localTheme !== appTheme) {
    kcLocalStorage.setItem('theme', appTheme, { isPublic: true });
  }

  return appTheme;
};

export default extend(base, {
  namespace: 'setting',
  state: {
    currentTheme: defaultTheme,
    isSupportSwithTheme: false,
  },
  reducers: {},
  effects: {
    *init({ payload: { isSupportSwithTheme, pathname } }, { put }) {
      let _currentTheme = defaultTheme;
      // 支持切换黑白模式
      if (isSupportSwithTheme) {
        const localTheme = kcLocalStorage.getItem('theme', { isPublic: true });
        _currentTheme = localTheme || defaultTheme;

        const isInApp = JsBridge.isApp();
        if (isInApp) {
          _currentTheme = getAppTheme(pathname, localTheme);
        }
      } else if (
        pathname &&
        (pathname.indexOf('/spotlight_r6') > -1 || pathname.indexOf('/spotlight7') > -1)
      ) {
        // 黑色主题页面
        _currentTheme = 'dark';
      } else if (pathname && pathname === '/kcs') {
        // kcs 路由始终保持黑色并且不能切换主题色
        _currentTheme = 'dark';
      }

      yield put({
        type: 'update',
        payload: {
          currentTheme: _currentTheme,
          isSupportSwithTheme,
        },
      });
    },
    *toggleTheme({ payload = {} }, { select, put }) {
      const { currentTheme } = yield select((state) => state.setting);
      let newTheme = currentTheme === DARK ? LIGHT : DARK;
      if (payload?.theme) {
        newTheme = payload.theme;
      }
      yield put({
        type: 'update',
        payload: { currentTheme: newTheme },
      });
    },
  },
  subscriptions: {
    setUp({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const isSupportSwithTheme = filter(
          themeSwithPath,
          (item) => pathname?.indexOf(item) > -1,
        )?.length;
        dispatch({
          type: 'init',
          payload: {
            isSupportSwithTheme: !!isSupportSwithTheme,
            pathname,
          },
        });
      });
    },
  },
});

/**
 * Owner: borden@kupotech.com
 */
import extend from 'dva-model-extend';
import { pathToRegexp } from 'path-to-regexp';
import storage from 'utils/storage';
import kcStorage from '@kucoin-base/kcStorage';
import base from 'common/models/base';

const DARK = 'dark';
const LIGHT = 'light';
const defaultTheme = DARK;

const SHOW_ASSETS = 'showAssets';
const SHOW_NEWS = 'showNews';
const SHOW_GUIDE = 'showGuide';

const getInitConfig = (key, defaultValue = true) => {
  if (!defaultValue) {
    return storage.getItem(key) === !defaultValue;
  }
  return storage.getItem(key) !== !defaultValue;
};

export { DARK, LIGHT };

export default extend(base, {
  namespace: 'theme',
  state: {
    current: defaultTheme,
    visible: true,
    showNews: false,
    showAssets: true,
    showGuide: false, // 展示新手引导
    guideIndex: 0,
  },
  effects: {
    *init({ payload: { pathname } }, { put }) {
      const showAssets = getInitConfig(SHOW_ASSETS);
      const showNews = getInitConfig(SHOW_NEWS, false);
      const showGuide = getInitConfig(SHOW_GUIDE);
      const current =
        kcStorage?.getItem('theme') || storage.getItem('theme.current') || defaultTheme;

      yield put({
        type: 'update',
        payload: { current, showAssets, showNews, showGuide },
      });
    },
    *toggle(action, { select, put }) {
      const { current } = yield select((state) => state.theme);
      const newTheme = current === DARK ? LIGHT : DARK;
      yield put({
        type: 'update',
        payload: { current: newTheme },
      });
      storage.setItem('theme.current', newTheme);
    },
    *toggleNews(action, { select, put }) {
      const { showNews } = yield select((state) => state.theme);
      const nextShowNews = !showNews;
      yield put({
        type: 'update',
        payload: { showNews: nextShowNews },
      });
      storage.setItem(SHOW_NEWS, nextShowNews);
    },
    *toggleShowAssets(action, { select, put }) {
      const { showAssets } = yield select((state) => state.theme);
      const nextShowAssets = !showAssets;
      yield put({
        type: 'update',
        payload: { showAssets: nextShowAssets },
      });
      storage.setItem(SHOW_ASSETS, nextShowAssets);
    },
    *changeShowGuide({ payload = {} }, { put }) {
      const showGuide = !!payload.showGuide;
      yield put({
        type: 'update',
        payload: {
          showGuide,
          guideIndex: 0,
        },
      });
      storage.setItem(SHOW_GUIDE, showGuide);
    },
  },
  subscriptions: {
    setUpTheme({ dispatch, history }) {
      history.listen(({ pathname }) => {
        dispatch({
          type: 'init',
          payload: { pathname },
        });
      });

      window._kc_toggleTheme = () => {
        dispatch({ type: 'toggle' });
      };
    },
  },
});

/**
 * Owner: borden@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import { isEmpty, isEqual } from 'lodash';
import { DEFAULT_LAYOUTS_MAP } from '@/layouts/XlLayout/layout';
import { setItem, setLayoutConfig } from '@/layouts/XlLayout/storage';
import {
  SOUND_STORAGE_KEY,
} from '@/pages/InfoBar/SettingsToolbar/TradeSetting/SoundReminder/config';
import {
  addLayout,
  deleteLayout,
  getLayouts,
  updateLayout as _updateLayout,
} from '@/services/layoutSetting';
import storage from 'utils/storage.js';
import kcStorage from '@kucoin-base/kcStorage';
import {
  RECOMMEND_BAR_POSITION_KEY,
  QUICK_ORDER_VISIBLE_KEY,
} from '@/storageKey/chart';

const { getItem } = storage;

const DARK = 'dark';
const LIGHT = 'light';
const defaultTheme = DARK;

export default extend(base, {
  namespace: 'setting',
  state: {
    currentTheme: defaultTheme,
    showAssets: true,
    openLayoutSetting: false,
    inLayoutIdMap: null, // 模块在布局中的显隐状态。undefined:不在布局中  0:在布局中，但不是活跃的  1:在布局中，是活跃的
    currentLayout: '',
    recommendbarPosition: getItem(RECOMMEND_BAR_POSITION_KEY) || 'bottom',
    quickOrderVisible: getItem(QUICK_ORDER_VISIBLE_KEY) !== false,
    isDragging: false, // 组件是否正在拖动ing
    infoBarMediaFlag: 5,
    verifyError: '', // 交易密码校验错误信息
    layoutIntroductionVisible: false, // 布局介绍弹窗
    soundReminderSettings: null,
    timeCheck: false, // 停留时间检测
    moveCheck: false, // 交互检测
  },
  reducers: {
    updateInLayoutIdMap(state, { payload, override }) {
      const nextInLayoutIdMap = {
        ...(override ? null : state.inLayoutIdMap),
        ...payload,
      };
      const hasChanged = !isEqual(state.inLayoutIdMap, nextInLayoutIdMap);
      return {
        ...state,
        inLayoutIdMap: hasChanged ? nextInLayoutIdMap : state.inLayoutIdMap,
      };
    },
    updateLayout(state, { payload }) {
      if (payload.currentLayout) {
        setLayoutConfig({ currentLayout: payload.currentLayout });
      }
      return {
        ...state,
        ...payload,
      };
    },
    updateLayouts(state, { payload: { code, ...other } }) {
      let payload = null;
      if (code) {
        payload = {
          layouts: { ...state.layouts },
        };
        if (DEFAULT_LAYOUTS_MAP[code] && other.layoutConfig) {
          setItem(other.layoutConfig, code);
        }
        if (isEmpty(other)) {
          // 删
          delete payload.layouts[code];
        } else if (payload.layouts?.[code]) {
          // 改
          payload.layouts[code] = { ...payload.layouts[code], ...other };
        } else {
          // 增
          payload.layouts[code] = { code, ...other };
        }
      }
      return {
        ...state,
        ...payload,
      };
    },
    updateSoundReminderSettings(state, { payload }) {
      const currentSetting = state.soundReminderSettings;
      const nextValues = { ...currentSetting || null, ...payload };
      const currentIsMuted = currentSetting?.muted === true;
      if (currentIsMuted && payload?.volume === 0) {
        return state;
      }
      storage.setItem(SOUND_STORAGE_KEY, nextValues);
      return {
        ...state,
        soundReminderSettings: nextValues,
      };
    },
  },
  effects: {
    *getLayouts(_, { call }) {
      const { data } = yield call(getLayouts);
      return data;
    },
    *addLayout({ payload }, { call }) {
      const res = yield call(addLayout, payload);
      return res;
    },
    *deleteLayout({ payload }, { call }) {
      const res = yield call(deleteLayout, payload);
      return res;
    },
    *editLayout({ payload }, { call, put, select }) {
      const { isLogin } = yield select((state) => state.user);
      const { code, layoutConfig } = payload || {};
      if (layoutConfig) {
        payload.layoutConfig = JSON.stringify(layoutConfig);
        yield put({
          type: 'updateLayouts',
          payload: { code, layoutConfig },
        });
      }
      if (!isLogin) return null;
      const res = yield call(_updateLayout, payload);
      return res;
    },
    *initTheme({ payload: { pathname } }, { put }) {
      const cache = storage.getItem('showAssets');
      const showAssets = cache === null ? true : cache;
      const currentTheme =
        kcStorage?.getItem('theme') || storage.getItem('theme.current') || defaultTheme;

      yield put({
        type: 'update',
        payload: { currentTheme, showAssets },
      });
    },
    *toggleShowAssets(action, { select, put }) {
      const { showAssets } = yield select((state) => state.setting);
      const nextShowAssets = !showAssets;
      yield put({
        type: 'update',
        payload: { showAssets: nextShowAssets },
      });
      storage.setItem('showAssets', nextShowAssets);
    },
    *toggleTheme(action, { select, put }) {
      const { currentTheme } = yield select((state) => state.setting);
      const newTheme = currentTheme === DARK ? LIGHT : DARK;
      yield put({
        type: 'update',
        payload: { currentTheme: newTheme },
      });
      storage.setItem('theme.current', newTheme);
    },
  },
  subscriptions: {
    setUpTheme({ dispatch, history }) {
      history.listen(({ pathname }) => {
        dispatch({
          type: 'initTheme',
          payload: { pathname },
        });
      });
    },
  },
});

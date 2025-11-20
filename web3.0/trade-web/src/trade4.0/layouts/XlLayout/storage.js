/*
 * owner: Borden@kupotech.com
 */
import { isArray, isObject, findIndex, forEach, isEmpty } from 'lodash';
import storage from 'utils/storage';
import { getStateFromStore } from '@/utils/stateGetter';
import { DEFAULT_LAYOUTS_MAP, DEFAULT_LAYOUTS, DEFAULT_LAYOUT } from './layout';

// 如果要手动让缓存失效，请更新此版本
const version = '1';

// 过期配置最大存储时间(1天)
const MAX_EXPIRE_TIME = 1 * 24 * 60 * 60 * 1000;
// 布局配置储存的key
const LAYOUT_CONFIG_STORAGE_KEY = 'layout_config';
// 设置存储节流时间(1s)
export const SET_STORAGE_INTERVAL = 1000;

export const genModelKey = (v) => `layout_xl_${v}_v${version}`;
export const genCreatedModuleIdsKey = ({ user, currentLayout }) => {
  const userFlag = user?.uid ? `_${user.uid}` : '';
  return `xl_${currentLayout}${userFlag}_createdModuleIds`;
};

/**
 * 将布局配置放入storage
 * @param {*} updateConfig
 */
export const setLayoutConfig = (updateConfig) => {
  try {
    let layoutConfig = storage.getItem(LAYOUT_CONFIG_STORAGE_KEY);
    layoutConfig = { ...layoutConfig || null, ...updateConfig };
    storage.setItem(LAYOUT_CONFIG_STORAGE_KEY, layoutConfig);
  } catch (e) {
    console.log('setLayoutConfig', e);
  }
};

/**
 * 将布局配置从storage中取出
 * @param {*} key 不传返回全部布局配置
 */
export const getLayoutConfig = (key) => {
  let result;
  try {
    const layoutConfig = storage.getItem(LAYOUT_CONFIG_STORAGE_KEY);
    result = key ? layoutConfig[key] : layoutConfig;
  } catch (e) {
    console.log('getLayoutConfig', e);
    result = null;
  }
  return result;
};

/**
 * 检查storage过期的配置
 */
export const checkExpire = () => {
  const expireConfig = getLayoutConfig('_expire');
  if (!isArray(expireConfig) || !expireConfig.length) return;
  let nextExpireConfig = [...expireConfig];
  const layoutConfig = getLayoutConfig();
  forEach(expireConfig, (item) => {
    const { key, value } = item;
    const index = findIndex(nextExpireConfig, (v) => v.key === key);
    if (!value && key !== version) {
      nextExpireConfig[index].value = Date.now();
    } else if (key === version) {
      nextExpireConfig[index].value = undefined;
    } else if (Date.now() - value > MAX_EXPIRE_TIME) {
      // 版本过期，清理掉该版本的缓存
      forEach(DEFAULT_LAYOUTS, ({ code }) => {
        layoutConfig[genModelKey(code)] = undefined;
      });
      nextExpireConfig = nextExpireConfig.filter((v) => v.key !== key);
    }
  });
  layoutConfig._expire = nextExpireConfig.length ? nextExpireConfig : undefined;
  storage.setItem(LAYOUT_CONFIG_STORAGE_KEY, layoutConfig);
};

/**
 * 获取storage保存的当前布局
 */
export const getCurrentLayoutFromStorage = () => {
  const currentLayoutFromStorage = getLayoutConfig('currentLayout');
  return DEFAULT_LAYOUTS_MAP[currentLayoutFromStorage]
    ? currentLayoutFromStorage
    : DEFAULT_LAYOUT;
};

/**
 * 将布局放入storage里的布局配置中
 */
export const setItem = (value, layout) => {
  if (!isObject(value)) return;
  const _layout = layout || getCurrentLayoutFromStorage();
  const key = genModelKey(_layout);
  const expireConfig = getLayoutConfig('_expire');
  const updateConfig = { [key]: value };
  const index = findIndex(expireConfig, (v) => v.key === version);
  if (index < 0) {
    updateConfig._expire = [
      { key: version },
      ...(isArray(expireConfig) ? expireConfig : []),
    ];
  }
  setLayoutConfig(updateConfig);
};

/**
 * 将布局从torage里的布局配置中取出
 */
export const getItem = (layout) => {
  const _layout = layout || getCurrentLayoutFromStorage();
  const key = genModelKey(_layout);
  return getLayoutConfig(key) || DEFAULT_LAYOUTS_MAP[_layout]?.defaultLayout;
};

/**
 * 设置是否添加过新模块信息，此存储不参与布局设置版本过期逻辑，因为添加新版本会在默认初始布局中添加
 */
export const setCreatedModuleIds = (key, updateConfig) => {
  if (isEmpty(updateConfig)) return;
  const currentConfig = getLayoutConfig(key);
  setLayoutConfig({
    [key]: {
      ...currentConfig,
      ...updateConfig,
    },
  });
};

/**
 * 获取是否添加过新模块信息
 */
export const getCreatedModuleIds = (key) => {
  return getLayoutConfig(key);
};

/**
 * 从缓存中移除添加模块的流程信息
 */
export const removeCreatedModuleId = (id) => {
  const { user } = getStateFromStore(state => state.user);
  const { currentLayout } = getStateFromStore(state => state.setting);
  const key = genCreatedModuleIdsKey({ user, currentLayout });
  const currentConfig = getLayoutConfig();
  if (currentConfig?.[key]?.[id]) {
    delete currentConfig[key][id];
    if (isEmpty(currentConfig[key])) {
      delete currentConfig[key];
    }
  }
  storage.setItem(LAYOUT_CONFIG_STORAGE_KEY, currentConfig);
};

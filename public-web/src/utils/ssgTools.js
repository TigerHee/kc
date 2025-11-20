/**
 * Owner: willen@kupotech.com
 */
import { get } from 'lodash';
import { useState } from 'react';

/**
 * 将state 暴露给ssg，用于初始化页面时注入
 *
 * @param   {[type]}  fn  [fn description]
 *
 * @return  {[type]}      [return description]
 */
export const exposePageStateForSSG = (fn) => {
  window.getCurPageState = () => {
    const dvaApp = window.getDvaApp();
    const dvaState = dvaApp?._store?.getState() || {};
    const models = dvaApp?._models || [];
    return fn(dvaState, models);
  };
};

let initState = {};
// 合并state
export const exposePageStateWithOutStoreForSSG = (state = {}) => {
  // SSG 生成界面阶段进行此操作
  // 能够确保在组建中，只在DidMount阶段执行一次，也能保证push路由在update阶段执行。
  if (navigator.userAgent.indexOf('SSG_ENV') === -1) {
    return;
  }
  const { pathname } = window.location;
  //检查namespace是否存在重复
  if (pathname in initState) {
    let merged = false;
    Object.entries(state).forEach(([nameSpace, data]) => {
      if (nameSpace in initState[pathname]) {
        Object.entries(data).forEach(([dataKey, dataVal]) => {
          if (dataKey in initState[pathname][nameSpace]) {
            // 已经存在namespace
            console.warn(`nameSpace: ${nameSpace}下的变量名：${dataKey} 存在重复`);
          }
        });
        // 相同的 nameSpace 不同的data属性名
        Object.assign(initState[pathname][nameSpace], data);
        merged = true;
      }
    });
    if (!merged) {
      // 相同路由下面的
      Object.assign(initState[pathname], state);
    }
  } else {
    // state值 ： {pathname: {nameSpace: {} } }
    Object.assign(initState, { [pathname]: state });
  }
};

window.getCurPageStateWithOutStore = () => {
  // 返回清空initState的函数。
  return {
    initState: initState,
    clearInitSate: () => {
      initState = {};
    },
  };
};

export const getPageStateByNameSpaceFromSSG = (namespace) => {
  if (window.g_initialPageState) {
    const { pathname } = window.location;
    if (window.g_initialPageState[pathname]) {
      return window.g_initialPageState[pathname][namespace] || {};
    }
  }
  return {};
};

export const useStateFromSSGInitState = (stateNamespace, key, defaultValue) => {
  const data = getPageStateByNameSpaceFromSSG(stateNamespace);
  const initData = data[key] || defaultValue;
  const res = useState(initData);
  return res;
};

export const getPageStateByNameSpaceAndKeyFromSSG = (stateNamespace, key, defaultValue) => {
  const data = getPageStateByNameSpaceFromSSG(stateNamespace);
  return get(data, key, defaultValue);
};

// 判断 SSG 环境
export const IS_SSG_ENV = navigator.userAgent.indexOf('SSG_ENV') > -1;
// 判断 SSG mobile puppeteer 运行环境
export const IS_MOBILE_SSG_ENV = navigator.userAgent.indexOf('SSG_MOBILE_ENV') > -1;

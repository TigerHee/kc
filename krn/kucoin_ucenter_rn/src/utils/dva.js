import React from 'react';
import {Provider} from 'react-redux';
import {create} from 'dva-core';

// 写法参考: https://github.com/dvajs/dva/blob/master/packages/dva/src/index.js
export const dva = options => {
  // 利用create来创造dva实例
  const $Dva = create(options);

  // 挂载modal
  if (options.models) {
    options.models.forEach(model => $Dva.model(model));
  }

  // 挂载plugins
  if (options.plugins) {
    options.plugins.forEach(plugin => $Dva.use(plugin));
  }

  // 启动应用(在dva里对start方法返回的实例做了一些插件方面的判断，我们这边不对相关的配置)
  $Dva.start();

  // 重新挂载start方法
  $Dva.start = start;

  return $Dva;

  function start(container) {
    const store = $Dva._store;
    return () => <Provider store={store}>{container}</Provider>;
  }
};

export {Provider};

// model基础模块
export const baseModel = {
  reducers: {
    update(state, {payload}) {
      return {...state, ...payload};
    },
  },
};

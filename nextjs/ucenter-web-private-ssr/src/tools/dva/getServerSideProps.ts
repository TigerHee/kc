/**
 * 这个文件仅用于 getServerSideProps 里初始化 DVA
 */

import showError from '@/plugins/showError';
import { create, DvaInstance, DvaOption, Model, Store } from 'dva-core';
import createLoading from 'dva-loading';
// 声明 Webpack 的 require.context 类型

// import appModel from '@/__models/base/app';
import userModel from '@/__models/base/user';

// ==============================
// 类型定义
// ==============================
export type AppInstance = DvaInstance & { _store: Store; _models: Model[] };

export function initServerDvaApp(options: DvaOption = {}): AppInstance {
  console.log('[DVA] Creating app with options:', options);
  const app = create({
    ...options,
  }) as AppInstance;

  app.use(createLoading());
  app.use({ onError: showError });

  // app.model(appModel);
  app.model(userModel);

  app.start(); // 初始化 store

  return app;
}

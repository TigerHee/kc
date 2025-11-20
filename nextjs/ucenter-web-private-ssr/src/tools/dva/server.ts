import showError from '@/plugins/showError';
import { create, DvaInstance, DvaOption, Model, Store } from 'dva-core';
import createLoading from 'dva-loading';

// ==============================
// 类型定义
// ==============================
type AppInstance = DvaInstance & { _store: Store; _models: Model[] };

export function initDvaApp(options: DvaOption = {}): AppInstance {
  console.log('[DVA] Creating app with options:', options);
  const app = create({
    ...options,
  }) as AppInstance;

  app.use(createLoading());
  app.use({ onError: showError });

  // 这里 insert 所有的 model，在 babel 中会被替换为具体的 model 列表
  initModels(app);

  app.start(); // 初始化 store
  return app;
}

const initModels = (app: AppInstance) => {
  // BABEL_INSERT_MODELS
};

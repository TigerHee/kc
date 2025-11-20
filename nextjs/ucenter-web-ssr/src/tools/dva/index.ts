import { create, DvaOption, DvaInstance, Store, Model } from 'dva-core';
import createLoading from 'dva-loading';
// 声明 Webpack 的 require.context 类型

declare const require: {
  context: (directory: string, useSubdirectories?: boolean, regExp?: RegExp) => {
    keys: () => string[];
    <T = any>(id: string): T;
  };
};

// ==============================
// 类型定义
// ==============================
type AppInstance = DvaInstance & { _store: Store; _models: Model[] };

let app: AppInstance | null = null;
const registeredModels = new Set<string>();

// ==============================
// 创建与获取 DVA 实例
// ==============================
export function getDvaApp(options: DvaOption = {}): AppInstance {
  if (!app) {
    app = create({
      ...options,
    }) as AppInstance;

    app.use(createLoading());
    app.start(); // 初始化 store

    console.log('[DVA] App created');
  }
  return app;
}

export function getStore() {
  return getDvaApp()._store;
}

// ==============================
// Model 注册与卸载
// ==============================
export function registerModel(model: Model | any) {
  if (!model || !model.namespace) return;
  const ns = model.namespace;
  if (registeredModels.has(ns)) return;
  const a = getDvaApp();
  // additional safety: check app._models
  if (a._models && a._models.some((m: any) => m.namespace === ns)) {
    registeredModels.add(ns);
    return;
  }
  a.model(model);
  registeredModels.add(ns);
}

export function unregisterModel(namespace: string) {
  if (!registeredModels.has(namespace)) return;
  const a = getDvaApp();
  if (a.unmodel) a.unmodel(namespace);
  registeredModels.delete(namespace);
}

// ==============================
// 自动加载 Base Models (__models/base)
// ==============================
// export function initBaseModels(app: AppInstance) {
//   if (typeof window === 'undefined') {
//     // SSR 阶段不自动加载 base model，可在 _app.tsx 初始化时执行
//     return;
//   }

//   try {
//     // Webpack 的 require.context 用于构建时静态分析
//     // 加载 __models/base/* 目录下的所有 .ts/.tsx/.js/.jsx 文件
//     const context_base = require.context('@/__models/base', false, /\.(t|j)sx?$/);
//     context_base.keys().forEach((key) => {
//       const mod = context_base(key);
//       const model = mod.default || mod;
//       if (model?.namespace && !app._models.find((m) => m.namespace === model.namespace)) {
//         app.model(model);
//         console.log(`[DVA] Base model loaded: ${model.namespace}`);
//       }
//     });

//     // 记载 __models/* 目录下的所有 .ts/.tsx/.js/.jsx 文件
//     const context_root = require.context('@/__models', false, /\.(t|j)sx?$/);
//     context_root.keys().forEach((key) => {
//       const mod = context_root(key);
//       const model = mod.default || mod;
//       if (model?.namespace && !app._models.find((m) => m.namespace === model.namespace)) {
//         app.model(model);
//         console.log(`[DVA] Root model loaded: ${model.namespace}`);
//       }
//     });
//   } catch (err) {
//     console.error('[DVA] Failed to load base models:', err);
//   }
// }

// ==============================
// 按页面按需加载 Models (__models/pages)
// ==============================
// export async function loadPageModels(route: string | undefined) {
//   console.log('loadPageModels.route', route);
//   if (typeof window === 'undefined') {
//     // SSR 阶段不自动加载 page model，可在页面初始化时执行
//     return null;
//   }
//   if (!route) return null;
//   const app = getDvaApp();

//   // 统一去掉前导和尾部斜杠，例如 "/index/" => "index"
//   const filename = route.replace(/^\/+/, '').replace(/\/$/, '') || 'index';

//   console.log('loadPageModels.filename', filename);

//   // 匹配对应的页面 model，例如 pages/index.tsx 对应 __models/pages/index.ts
//   try {
//     const modelModule = await import(`@/__models/pages/${filename}`);
//     const model = modelModule.default;
//     if (model) {
//       registerModel(model);
//     }
//   } catch (err: any) {
//     if (process.env.NODE_ENV === 'development') {
//       console.warn(`[DVA] No page model found for route "${filename}"`, err.message);
//     }
//   }
//   return app;
// }

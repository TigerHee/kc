/**
 * Owner: garuda@kupotech.com
 * 用来注册 models
 */
import { getDvaApp } from '@kucoin-base/dva';

class SingletonRegisterModel {
  static instance = null;

  constructor() {
    // 单例
    if (!SingletonRegisterModel.instance) {
      SingletonRegisterModel.instance = this;
    }
    this.initialProps = window.g_initialProps || {};

    return SingletonRegisterModel.instance;
  }

  modelsBuffer = [];

  _registerModel(models, app) {
    models.forEach((model) => {
      if (model) {
        const modelIndex = app._models.findIndex((m) => m.namespace === model.namespace);
        if (modelIndex === -1) {
          if (Object.keys(this.initialProps).includes(model.namespace)) {
            Object.assign(model.state, this.initialProps[model.namespace]);
          }
          app.model(model);
        }
      }
    });
  }

  add(models) {
    console.log('SingletonRegisterModel add --->', models);
    if (Array.isArray(models)) {
      const app = getDvaApp();
      const _models = models.map((m) => m.default);
      if (app) {
        // 如果dva实例已经生成直接注册模型
        this._registerModel(_models, app);
      } else {
        // 将模型缓存到 buffer 中
        _models.forEach((m) => {
          if (typeof m === 'object') {
            if (!this.modelsBuffer.some((item) => item.namespace === m.namespace)) {
              this.modelsBuffer.push(m);
            }
          }
        });
      }
    }
  }

  register() {
    // 注册模型
    const app = getDvaApp();

    if (app) {
      this._registerModel(this.modelsBuffer, app);
    }
  }
}

export default SingletonRegisterModel;

// SingletonRegisterModel.test.js
import SingletonRegisterModel from 'src/tools/SingletonRegisterModel';
import { getDvaApp } from '@kucoin-base/dva';

jest.mock('@kucoin-base/dva', () => ({
  getDvaApp: jest.fn(),
}));

const mockModel = (namespace, state = {}) => ({
  namespace,
  state,
  default: { namespace, state },
});

describe('SingletonRegisterModel', () => {
  let registerModel;

  beforeEach(() => {
    // 重置实例
    registerModel = new SingletonRegisterModel();
    SingletonRegisterModel.instance = null;
    registerModel.modelsBuffer = [];
    window.g_initialProps = {};
    jest.clearAllMocks();
  });

  it('should create a singleton instance', () => {
    const instance1 = new SingletonRegisterModel();
    const instance2 = new SingletonRegisterModel();

    expect(instance1).toBe(instance2); // 单例测试
  });

  it('should add models to buffer when DVA app is not ready', () => {
    getDvaApp.mockReturnValue(null); // 模拟 DVA app 未生成

    const models = [
      mockModel('modelA'),
      mockModel('modelB'),
    ];

    registerModel.add(models);

    expect(registerModel.modelsBuffer).toEqual([
      models[0].default,
      models[1].default,
    ]);
  });

  it('should register models directly when DVA app is ready', () => {
    const mockApp = {
      _models: [],
      model: jest.fn(),
    };
    getDvaApp.mockReturnValue(mockApp); // 模拟 DVA app 已生成

    const models = [
      mockModel('modelA'),
      mockModel('modelB'),
    ];

    registerModel.add(models);

    expect(mockApp.model).toHaveBeenCalledTimes(2); // 确保直接注册
    expect(mockApp.model).toHaveBeenCalledWith(models[0].default);
    expect(mockApp.model).toHaveBeenCalledWith(models[1].default);
  });

  it('should not register duplicate models', () => {
    const mockApp = {
      _models: [{ namespace: 'modelA' }],
      model: jest.fn(),
    };
    getDvaApp.mockReturnValue(mockApp); // 模拟 DVA app 已生成

    const models = [
      mockModel('modelA'), // 重复模型
      mockModel('modelB'),
    ];

    registerModel.add(models);

    expect(mockApp.model).toHaveBeenCalledTimes(1);
    expect(mockApp.model).toHaveBeenCalledWith(models[1].default); // 只注册未存在的模型
  });

  it('should register models from buffer when calling register()', () => {
    const mockApp = {
      _models: [],
      model: jest.fn(),
    };
    getDvaApp.mockReturnValue(mockApp); // 模拟 DVA app 已生成

    const models = [
      mockModel('modelA'),
      mockModel('modelB'),
    ];

    registerModel.modelsBuffer = [
      models[0].default,
      models[1].default,
    ];

    registerModel.register();

    expect(mockApp.model).toHaveBeenCalledTimes(2);
    expect(mockApp.model).toHaveBeenCalledWith(models[0].default);
    expect(mockApp.model).toHaveBeenCalledWith(models[1].default);
  });

  it('should do nothing in register() if DVA app is not ready', () => {
    getDvaApp.mockReturnValue(null); // 模拟 DVA app 未生成

    const models = [
      mockModel('modelA'),
      mockModel('modelB'),
    ];

    registerModel.modelsBuffer = [
      models[0].default,
      models[1].default,
    ];

    registerModel.register();

    expect(registerModel.modelsBuffer).toEqual([
      models[0].default,
      models[1].default,
    ]);
  });
});

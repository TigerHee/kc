import { default as kcSensorsInit, KcSensorsLogin, getSensorsABResult, PAGE_AB_CONFIG } from "src/utils/kcsensorsConf.js";

jest.mock('@kucoin-base/sensors', () => ({
    __esModule: true, // this property makes it work
    default: {
        init: () => {}
    },
}));
describe("kcsensorsConf", () => {
    it("does not call initHandler if window.$KcSensors does not exist", () => {
      // 创建一个mock函数来代替initHandler
      const mockInitHandler = jest.fn();
      // 将initHandler添加到global对象中
      global.initHandler = mockInitHandler;
      // 将sensors设置为undefined
      global.sensors = undefined;
      kcSensorsInit();
      // 断言initHandler没有被调用
      expect(mockInitHandler).not.toHaveBeenCalled();
      // 清理mock
      delete global.initHandler;
      delete global.sensors;
    });
});

describe("KcSensorsLogin", () => {
    it("calls $KcSensors.login if window.$KcSensors exists", () => {
      // 创建一个mock函数来代替$KcSensors.login
      const mockLogin = jest.fn();
      // 初始化$KcSensors为一个包含login方法的对象
      Object.defineProperty(global, '$KcSensors', {
          value: { login: mockLogin },
          writable: true,
      });
      // 调用你的函数
      KcSensorsLogin('testUid', 'testUserLevel');
      // 断言login被调用了，并且使用了正确的参数
      expect(mockLogin).toHaveBeenCalledWith('testUid', 'testUserLevel');
      // 清理mock
      delete global.$KcSensors;
    });
    it("does not call $KcSensors.login if window.$KcSensors does not exist", () => {
      // 创建一个mock函数来代替$KcSensors.login
      const mockLogin = jest.fn();
      // 将$KcSensors设置为undefined
      global.$KcSensors = undefined;
      // 调用你的函数
      KcSensorsLogin('testUid', 'testUserLevel');
      // 断言login没有被调用
      expect(mockLogin).not.toHaveBeenCalled();
    });
});
  
describe("getSensorsABResult", () => {
    it("returns a Promise that resolves to _config.default_value if sensors.fastFetchABTest does not exist", async () => {
      // 将sensors设置为undefined
      global.sensors = undefined;
      // 调用你的函数
      const result = await getSensorsABResult({ default_value: 'defaultValue' });
      // 断言结果是_config.default_value
      expect(result).toBe('defaultValue');
    });
});

describe("PAGE_AB_CONFIG", () => {
    it("returns an object with the correct properties", () => {
      // 调用你的函数
      const result = PAGE_AB_CONFIG('testParamName');
      // 断言返回的对象的属性值
      expect(result).toEqual({
        param_name: 'testParamName',
        value_type: 'String',
        default_value: 'old',
      });
    });
});
  
    
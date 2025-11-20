import JsBridge from '@knb/native-bridge';
import { hideAppHeader, resetAppHeader } from 'src/routes/AccountPage/Transfer/utils/app';

// 模拟原生桥接模块
jest.mock('@knb/native-bridge', () => ({
  isApp: jest.fn(),
  open: jest.fn(),
}));

describe('App Header Control', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // 重置所有mock的调用记录
  });

  describe('resetAppHeader', () => {
    const expectedParams = {
      type: 'event',
      params: {
        name: 'updateHeader',
        visible: true,
      },
    };

    test('should call JsBridge.open when in app environment', () => {
      // 模拟应用环境
      JsBridge.isApp.mockReturnValue(true);

      resetAppHeader();

      expect(JsBridge.isApp).toHaveBeenCalledTimes(1);
      expect(JsBridge.open).toHaveBeenCalledWith(expectedParams);
    });

    test('should not call JsBridge.open in non-app environment', () => {
      // 模拟非应用环境
      JsBridge.isApp.mockReturnValue(false);

      resetAppHeader();

      expect(JsBridge.isApp).toHaveBeenCalled();
      expect(JsBridge.open).not.toHaveBeenCalled();
    });
  });

  describe('hideAppHeader', () => {
    const baseParams = {
      type: 'event',
      params: {
        name: 'updateHeader',
        visible: false,
      },
    };

    test('should call JsBridge.open with minimal params when in app environment', () => {
      JsBridge.isApp.mockReturnValue(true);

      hideAppHeader();

      expect(JsBridge.open).toHaveBeenCalledWith(baseParams);
    });

    test('should not call JsBridge.open in non-app environment', () => {
      JsBridge.isApp.mockReturnValue(false);

      hideAppHeader();

      expect(JsBridge.open).not.toHaveBeenCalled();
    });

    test('should pass optional parameters when uncommented', () => {
      // 如果未来取消注释参数，可以添加对应的测试
      // 当前版本不需要测试注释掉的参数
    });
  });
});

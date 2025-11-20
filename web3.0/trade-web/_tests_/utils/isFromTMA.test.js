/**
 * Owner: jessie@kupotech.com
 */
import { isFromTMA } from 'utils/tma/isFromTMA';

describe('test isFromTMA', () => {
  test('isFromTMA with ab is true and isTMA is true', () => {
    // 初始化$KcSensors为一个包含login方法的对象
    Object.defineProperty(global, 'parent', {
      value: {
        bridge: {
          isTMA: true,
        },
      },
      writable: true,
    });
    expect(isFromTMA()).toBe(true);
    // 清理mock
    delete global.parent;
  });
});

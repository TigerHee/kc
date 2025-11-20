/*
 * Owner: melon@kupotech.com
 */
import { getSensorsABResult } from 'src/utils/abTest';

// 模拟@kc/sensors
jest.mock('@kc/sensors', () => ({
  __esModule: true,
  default: null,
  fastFetchABTest: jest.fn(() => 'new'),
}));

describe('test getSensorsABResult', () => {
  // it('test ok', async () => {
  //   // 模拟@kc/sensors
  //   jest.mock('@kc/sensors', () => ({
  //     __esModule: true,
  //     fastFetchABTest: jest.fn(() => 'new'),
  //   }));

  //   const result = await getSensorsABResult({ param_name: 'test', default_value: 'default' });
  //   expect(result).toBe('new');
  // });

  // 内部存在 dynamic import，只能测试异常情况
  it('test error', async () => {
    // // 模拟@kc/sensors
    // jest.mock('@kc/sensors', () => ({
    //   __esModule: true,
    //   fastFetchABTest: jest.fn(() => Promise.reject()),
    // }));

    const result = await getSensorsABResult({ param_name: 'test', default_value: 'default' });
    expect(result).toBe('default');
  });
});

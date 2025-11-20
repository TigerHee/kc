import checkAvailable from '../src/utils/checkAvailable';
import { getAvailable } from '../src/services';

jest.mock('../src/services', () => ({
  __esModule: true,
  getAvailable: jest.fn(),
}));

describe('测试 checkAvailable api:', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  afterEach(() => {
    getAvailable.mockRestore();
  });
  afterAll(() => {
    console.error.mockRestore();
  });
  it('功能可用', async () => {
    getAvailable.mockResolvedValue({
      code: '200',
      data: {
        permitted: true
      }
    });
    const res = await checkAvailable('RV_UPDATE_PHONE');
    expect(res).toBe(true);
    expect(getAvailable).toHaveBeenCalledTimes(1);
  });
  it('功能不可用', async () => {
    getAvailable.mockResolvedValue({
      code: '200',
      data: {
        permitted: false
      }
    });
    const res = await checkAvailable('RV_UPDATE_PHONE');
    expect(res).toBe(false);
    expect(getAvailable).toHaveBeenCalledTimes(1);
  });

  it('请求失败，支持重试', async () => {
    getAvailable.mockRejectedValue({
      code: '400xx',
    });
    const res = await checkAvailable('RV_UPDATE_PHONE');
    expect(res).toBe(false);
    expect(getAvailable).toHaveBeenCalledTimes(3); // 有3次重试
  })
});
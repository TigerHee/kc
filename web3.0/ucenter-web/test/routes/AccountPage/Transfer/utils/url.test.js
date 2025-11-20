// i18nUtils.test.js
import {
  checkIsAppMigrationContainer,
  getValidAppTransferLink,
} from 'src/routes/AccountPage/Transfer/utils/url';
import { addLangToPath } from 'src/tools/i18n';

// 模拟依赖模块
jest.mock('src/tools/i18n', () => ({
  addLangToPath: jest.fn((path) => `${path}?lang=en`),
}));

jest.mock('src/utils/siteConfig', () => ({
  __esModule: true,
  default: {
    KUCOIN_HOST: 'https://www.kucoin.com',
  },
}));

// 保存原始 location 对象
const originalLocation = global.location;

beforeAll(() => {
  delete global.location;
  global.location = { href: 'https://www.kucoin.com/' };
});

afterAll(() => {
  global.location = originalLocation;
});

describe('getValidAppTransferLink', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.location.href = 'https://www.kucoin.com/'; // 重置 location
  });

  test('应该直接返回HTTP/HTTPS链接并添加语言参数', () => {
    const url = 'https://api.example.com/login';
    const result = getValidAppTransferLink(url);
    expect(addLangToPath).toHaveBeenCalledWith(url);
    expect(result).toBe(`${url}?lang=en`);
  });

  test('应该为指定路径添加goBackUrl参数（无原始参数）', () => {
    const path = 'account/asset';
    const expected = `${path}?goBackUrl=${encodeURIComponent(
      'https://www.kucoin.com/account/transfer?appNeedLang=true?lang=en',
    )}`;

    expect(getValidAppTransferLink(path)).toBe(expected);
  });

  test('应该为指定路径添加goBackUrl参数（已有参数）', () => {
    const path = '/trade?symbol=BTC-USDT';
    const expected = `${path}&goBackUrl=${encodeURIComponent(
      'https://www.kucoin.com/account/transfer?appNeedLang=true?lang=en',
    )}`;

    expect(getValidAppTransferLink(path)).toBe(expected);
  });

  test('应该在迁移容器中添加额外参数', () => {
    global.location.href = 'https://www.kucoin.com/?isMigrationContainer=true';
    const path = '/account/asset';
    const expected = `${path}?goBackUrl=${encodeURIComponent(
      'https://www.kucoin.com/account/transfer?appNeedLang=true?lang=en&isMigrationContainer=true',
    )}`;

    expect(getValidAppTransferLink(path)).toBe(expected);
  });

  test('应该返回原始路径当不需要处理时', () => {
    const path = '/market/BTC-USDT';
    expect(getValidAppTransferLink(path)).toBe(path);
  });

  test('应该处理空路径输入', () => {
    expect(getValidAppTransferLink()).toBe('');
  });
});

describe('checkIsAppMigrationContainer', () => {
  test('应该正确检测迁移容器参数存在', () => {
    global.location.href = 'https://www.kucoin.com/?isMigrationContainer=true';
    expect(checkIsAppMigrationContainer()).toBe(true);
  });

  test('应该正确检测迁移容器参数不存在', () => {
    global.location.href = 'https://www.kucoin.com/';
    expect(checkIsAppMigrationContainer()).toBe(false);
  });

  test('应该处理URL中的哈希参数', () => {
    global.location.href = 'https://www.kucoin.com/#/trade?isMigrationContainer=true';
    expect(checkIsAppMigrationContainer()).toBe(true);
  });
});

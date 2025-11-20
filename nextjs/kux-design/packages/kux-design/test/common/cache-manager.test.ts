import { cacheManager } from '@/common/cache-manager';

describe('cacheManager', () => {
  afterEach(() => {
    cacheManager.clear();
    jest.clearAllMocks();
  });

  it('basic functionality', () => {
    // 基本增删改查操作
    cacheManager.add('foo', 123);
    expect(cacheManager.get('foo')).toBe(123);
    cacheManager.remove('foo');
    expect(cacheManager.get('foo')).toBeUndefined();

    // 清空操作
    cacheManager.add('a', 1);
    cacheManager.add('b', 2);
    cacheManager.clear();
    expect(cacheManager.get('a')).toBeUndefined();
    expect(cacheManager.get('b')).toBeUndefined();
  });

  it('expiration logic', () => {
    // TTL 未过期
    jest.spyOn(Date, 'now').mockReturnValue(1000);
    cacheManager.add('ttl', 'val', 500);
    jest.spyOn(Date, 'now').mockReturnValue(1200);
    expect(cacheManager.get('ttl')).toBe('val');

    // TTL 已过期
    jest.spyOn(Date, 'now').mockReturnValue(2000);
    cacheManager.add('ttl2', 'val2', 500);
    jest.spyOn(Date, 'now').mockReturnValue(2600);
    expect(cacheManager.get('ttl2')).toBeUndefined();
  });

  it('tryGetCache branch', () => {
    // 缓存命中
    cacheManager.add('try', 42);

    expect(cacheManager.tryGetCache('try', () => 99)).toBe(42);

    const getValue = jest.fn(() => 'abc');
    expect(cacheManager.tryGetCache('new', getValue)).toBe('abc');
    expect(getValue).toHaveBeenCalled();
    expect(cacheManager.get('new')).toBe('abc');

    // TTL 过期
    jest.spyOn(Date, 'now').mockReturnValue(1000);
    const getValue2 = jest.fn(() => 'ttlval');
    cacheManager.tryGetCache('ttlkey', getValue2, 500);
    jest.spyOn(Date, 'now').mockReturnValue(1600);
    expect(cacheManager.get('ttlkey')).toBeUndefined();
  });
});

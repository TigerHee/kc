import showDatetime from 'src/trade4.0/utils/showDatetime.js';

describe('showDatetime 时间戳格式化 函数', () => {
  test('没有参数时返回Invalid date', () => {
    expect(showDatetime()).toBe('Invalid date');
  });

  it('参数非数字时返回Invalid date', () => {
    const timestamp = 'not a number';
    const result = showDatetime(timestamp);
    expect(result).toBe('Invalid date');
  });

  test('正确的时间戳，没有format参数', () => {
    expect(typeof showDatetime(1673419900690)).toBe('string');
  });

  test('正确的时间戳，有format参数', () => {
    expect(typeof showDatetime(1673419900690, 'YYYY-MM-DD')).toBe('string');
  });
});
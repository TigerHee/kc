import timeSelectionUtil from 'src/utils/getCurrentTime';

jest.useFakeTimers();

describe('timeSelectionUtil', () => {
  // 测试当没有提供服务器时间或请求本地时间时的行为
  test('should return current local time when no serverTime or requestedLocalTime is provided', () => {
    const mockDateNow = 1600000000000;
    jest.spyOn(Date, 'now').mockReturnValue(mockDateNow);

    expect(timeSelectionUtil()).toBe(mockDateNow);
    expect(timeSelectionUtil({ serverTime: -1 })).toBe(mockDateNow);
    expect(timeSelectionUtil({ requestedLocalTime: -1 })).toBe(mockDateNow);
    expect(timeSelectionUtil({ serverTime: -1, requestedLocalTime: -1 })).toBe(mockDateNow);

    Date.now.mockRestore();
  });

  // 测试当服务器时间与当前本地时间的差值在允许范围内时的行为
  test('should return current local time when serverTime is within MAX_OVER_TIME', () => {
    const requestedLocalTime = 1600000000000;
    const serverTime = 1600000010000; // 服务器时间比请求时间晚10秒
    const currentLocalTime = requestedLocalTime + 15000; // 当前本地时间比请求时间晚15秒
    const expectedServerTime = serverTime + 15000; // 调整后的服务器时间

    jest.spyOn(Date, 'now').mockReturnValue(currentLocalTime);

    // 调整后的服务器时间与当前本地时间的差值为10秒（在允许的20秒内）
    expect(timeSelectionUtil({ serverTime, requestedLocalTime })).toBe(currentLocalTime);

    Date.now.mockRestore();
  });

  // 测试当服务器时间与当前本地时间的差值超出允许范围时的行为
  test('should return adjusted serverTime when serverTime is outside MAX_OVER_TIME', () => {
    const requestedLocalTime = 1600000030000;
    const serverTime = 1600000010000; // 服务器时间比请求时间晚10秒
    const currentLocalTime = requestedLocalTime + 30000; // 当前本地时间比请求时间晚30秒
    const expectedServerTime = serverTime + 30000; // 调整后的服务器时间

    jest.spyOn(Date, 'now').mockReturnValue(currentLocalTime);

    // 调整后的服务器时间与当前本地时间的差值为10秒（超出允许的20秒）
    expect(timeSelectionUtil({ serverTime, requestedLocalTime })).toBe(expectedServerTime);

    Date.now.mockRestore();
  });

  // 测试当服务器时间与当前本地时间的差值刚好等于允许范围时的行为
  test('should return current local time when difference equals MAX_OVER_TIME', () => {
    const requestedLocalTime = 1600000040000;
    const serverTime = 1600000040000; // 服务器时间比请求时间晚20秒
    const currentLocalTime = requestedLocalTime + 20000; // 当前本地时间比请求时间晚20秒

    jest.spyOn(Date, 'now').mockReturnValue(currentLocalTime);

    // 调整后的服务器时间与当前本地时间的差值为20秒（等于允许的20秒）
    expect(timeSelectionUtil({ serverTime, requestedLocalTime })).toBe(currentLocalTime);

    Date.now.mockRestore();
  });

  // 测试当服务器时间早于请求时间时的行为
  test('should handle serverTime earlier than requestedLocalTime', () => {
    const requestedLocalTime = 1600000000000;
    const serverTime = 1600000000000 - 5000; // 服务器时间比请求时间早5秒
    const currentLocalTime = requestedLocalTime + 10000; // 当前本地时间比请求时间晚10秒
    const expectedServerTime = serverTime + 10000; // 调整后的服务器时间

    jest.spyOn(Date, 'now').mockReturnValue(currentLocalTime);

    // 调整后的服务器时间与当前本地时间的差值为5秒（在允许的20秒内）
    expect(timeSelectionUtil({ serverTime, requestedLocalTime })).toBe(currentLocalTime);

    Date.now.mockRestore();
  });

  // 测试当服务器时间远早于请求时间时的行为
  test('should return adjusted serverTime when serverTime is much earlier than requestedLocalTime', () => {
    const requestedLocalTime = 1600000000000;
    const serverTime = 1600000000000 - 30000; // 服务器时间比请求时间早30秒
    const currentLocalTime = requestedLocalTime + 10000; // 当前本地时间比请求时间晚10秒
    const expectedServerTime = serverTime + 10000; // 调整后的服务器时间

    jest.spyOn(Date, 'now').mockReturnValue(currentLocalTime);

    // 调整后的服务器时间与当前本地时间的差值为30秒（超出允许的20秒）
    expect(timeSelectionUtil({ serverTime, requestedLocalTime })).toBe(expectedServerTime);

    Date.now.mockRestore();
  });
});  
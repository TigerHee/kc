import getCurrentTime from 'utils/getCurrentTime';

describe('getTime function', () => {
  const serverTime = Date.now();
  const requestedLocalTime = Date.now();

  it('should return dateNow if serverTime or requestedLocalTime is less than or equal to 0', () => {
    expect(getCurrentTime()).not.toBe(serverTime);
    expect(getCurrentTime({ serverTime: -1, requestedLocalTime: -1 })).not.toBe(serverTime);
    expect(getCurrentTime({ serverTime: 1, requestedLocalTime: serverTime })).not.toBe(serverTime);
  });

  it('should return dateNow if the difference between serverTime and dateNow is less than MAX_OVER_TIME', () => {
    expect(getCurrentTime({ serverTime, requestedLocalTime })).not.toBe(serverTime);
  });
});

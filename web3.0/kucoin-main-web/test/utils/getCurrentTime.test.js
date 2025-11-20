
import getTime from 'src/utils/getCurrentTime.js'; // 假设你的函数在getTime.js文件中

import { jest } from '@jest/globals';



describe('getTime function', () => {

  beforeAll(() => {

    jest.useFakeTimers('modern');

    jest.setSystemTime(new Date('2022-01-01T00:00:00Z').getTime());

  });



  afterAll(() => {

    jest.useRealTimers();

  });



  test('should return current time if serverTime or requestedLocalTime is less than or equal to 0', () => {

    expect(getTime({ serverTime: -1, requestedLocalTime: -1 })).toEqual(new Date().getTime());

    expect(getTime({ serverTime: 0, requestedLocalTime: 0 })).toEqual(new Date().getTime());

  });



  test('should return current time if the difference between serverTime and current time is less than 20 seconds', () => {

    const serverTime = new Date().getTime() - 10 * 1000; // 10 seconds ago

    const requestedLocalTime = new Date().getTime();

    expect(getTime({ serverTime, requestedLocalTime })).toEqual(new Date().getTime());

  });



  test('should return serverTime if the difference between serverTime and current time is more than 20 seconds', () => {

    const serverTime = new Date().getTime() - 30 * 1000; // 30 seconds ago

    const requestedLocalTime = new Date().getTime();

    expect(getTime({ serverTime, requestedLocalTime })).toEqual(serverTime + (new Date().getTime() - requestedLocalTime));

  });

});

/*
 * @Owner: elliott.su@kupotech.com
 */

import { FAILURE, LOADING, SUCCESS } from '../const';

describe('const', () => {
  test('LOADING should be "0"', () => {
    expect(LOADING).toBe('0');
  });
  test('SUCCESS should be "1"', () => {
    expect(SUCCESS).toBe('1');
  });
  test('FAILURE should be "2"', () => {
    expect(FAILURE).toBe('2');
  });
});

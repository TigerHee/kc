/**
 * Owner: willen@kupotech.com
 */
import createDecimals from 'src/utils/createDecimals';

describe('test createDecimals', () => {
  test('createDecimals', () => {
    expect(createDecimals(2).length).toBe(2);
    expect(createDecimals(11).length).toBe(11);
    expect(createDecimals().length).toBe(0);
  });
});

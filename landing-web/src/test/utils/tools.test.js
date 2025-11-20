/*
 * Owner: melon@kupotech.com
 */

import keysEquality from 'utils/tools/keysEquality';

describe('test keysEquality', () => {
  test('test keysEquality is true', () => {
    expect(
      keysEquality(['isLogin'])(
        {
          isLogin: true,
        },
        { isLogin: true },
      ),
    ).toBeDefined();
  });
  test('test keysEquality is false', () => {
    expect(
      keysEquality(['isLogin'])(
        {
          isLogin: true,
        },
        { isLogin: false },
      ),
    ).toBeDefined();
  });
});

/**
 * Owner: willen@kupotech.com
 */
const { push, back, replace } = require('src/utils/router');

describe('utils router', () => {
  test('push function', () => {
    window.__KC_CRTS__ = ['/gempool'];
    expect(push()).toBe();
    expect(push('/404')).toBe();
    expect(push('/gempool')).toBe();
  });

  test('back function', () => {
    expect(back()).toBe();
  });

  test('replace function', () => {
    expect(replace()).toBe();
    expect(replace('/404')).toBe();
  });
});

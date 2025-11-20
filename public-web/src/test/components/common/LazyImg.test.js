/**
 * Owner: jessie@kupotech.com
 */
import LazyImg, { lazy } from 'src/components/common/LazyImg';
import { customRender } from 'src/test/setup';

describe('test LazyImg', () => {
  test('test LazyImg', () => {
    customRender(<LazyImg src={'/'} />, {});
    expect(lazy({ dataset: {} })).toBe();
  });

  test('test LazyImg with no src', () => {
    customRender(<LazyImg />, {});
  });

  test('test LazyImg with alt', () => {
    customRender(<LazyImg src={'/'} preloadSrc={'/'} alt="logo" />, {});
  });
});

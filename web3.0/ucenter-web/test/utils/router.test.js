/**
 * Owner: willen@kupotech.com
 */
const { push, back, replace } = require('src/utils/router');

test('test captureException', () => {
  expect(push()).toBe();
  expect(back()).toBe();
  expect(replace()).toBe();
});

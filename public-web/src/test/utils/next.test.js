/**
 * Owner: willen@kupotech.com
 */
const { default: throw404 } = require('src/utils/next/throw404');

test('test captureException', () => {
  // expect(throw404()).toThrow();
  expect.assertions(1);
  try {
    throw404();
  } catch (e) {
    console.log('errr', e);
    expect(e.message).toBe('trigger 404');
  }
});

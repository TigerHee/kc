/*
 * Owner: terry@kupotech.com
 */
import  'utils/lib-flexible';

describe('lib-flexible', () => {
  it('default', () => {
    expect(document.documentElement?.style?.fontSize).toBeDefined();
  })
})
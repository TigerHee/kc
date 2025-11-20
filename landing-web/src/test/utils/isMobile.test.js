/*
 * Owner: terry@kupotech.com
 */
import isMobile from 'utils/isMobile';

describe('isMobile', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'navigator', {
      value: {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
      }
    })
  })
  afterEach(() => {
    jest.resetAllMocks();
  })

  it('default', () => {
    expect(isMobile()).toBeDefined();
  })

  it('mobile', () => {
    expect(isMobile()).toBeTruthy();
  })
})
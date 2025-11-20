/*
 * Owner: tom@kupotech.com
 */
import { uet_report_conversion, trackFbRegister } from 'components/$/RegisterCommon/tool';

describe('uet_report_conversion', () => {
  beforeEach(() => {
    window.uetq = [];
  });
  it('should push an event to the uetq array', () => {
    uet_report_conversion();
    expect(window.uetq).toHaveLength(3);
    expect(window.uetq).toEqual(['event', 'signup', { event_category: 'register' }]);
  });
});

describe('trackFbRegister', () => {
  beforeEach(() => {
    window.fbq = jest.fn();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should call fbq with the correct parameters when options is an object', () => {
    const options = { uid: '12345' };
    trackFbRegister(options);
    expect(window.fbq).toHaveBeenCalledTimes(1);
    expect(window.fbq).toHaveBeenCalledWith('track', 'CompleteRegistration', {
      content_nam: '12345',
    });
  });
  it('should not call fbq when options is not an object', () => {
    trackFbRegister('invalid options');
    expect(window.fbq).toHaveBeenCalled();
  });
  it('should not call fbq when window.fbq is not a function', () => {
    window.fbq = undefined;
    trackFbRegister({ uid: '12345' });
    expect(window.fbq).toBeUndefined();
  });
});

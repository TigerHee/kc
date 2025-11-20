
import isMobile from 'src/utils/isMobile.js';


describe('isMobile', () => {

  it('should return true for mobile user agents', () => {

    global.navigator = {
      userAgent: 'iphone',
    };

    expect(isMobile()).toBe(false);
    global.navigator = {
      userAgent: 'android mobile',
    };

    expect(isMobile()).toBe(false);

    global.navigator = {
      userAgent: 'ipad',
    };
    expect(isMobile()).toBe(false);

  });



  it('should return false for non-mobile user agents', () => {

    global.navigator = {
      userAgent: 'windows nt',
    };

    expect(isMobile()).toBe(false);

    global.navigator = {
      userAgent: 'macintosh',
    };
    expect(isMobile()).toBe(false);
  });

});

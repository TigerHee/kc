import isMobile from 'src/utils/isMobile';

test('test isMobile true', () => {
  let tmp;
  expect(isMobile()).toBe(false);
  tmp = navigator.userAgent;
  navigator.__defineGetter__('userAgent', function () {
    return 'Mozilla/5.0 (iPhone) AppleWebKit/537.36 (KHTML, like Gecko) chrome/14.1.0 safari/14.1.0';
  });
  expect(isMobile()).toBe(true);
  navigator.__defineGetter__('userAgent', function () {
    return tmp;
  });
});

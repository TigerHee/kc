/**
 * Owner: jessie@kupotech.com
 */
import { updateUrlWithParams } from 'utils/formatUrlWithLang';

describe('formatUrlWithLang', () => {
  it('updateUrlWithParams', () => {
    const url = updateUrlWithParams('https://www.example.com', {
      lang: 'zh-hant',
    });
    expect(url).toBe('https://www.example.com?lang=zh-hant');
    const url2 = updateUrlWithParams('https://www.example.com?lang=en', {
      lang: 'zh-hant',
    });
    expect(url2).toBe('https://www.example.com?lang=zh-hant');
  });
});

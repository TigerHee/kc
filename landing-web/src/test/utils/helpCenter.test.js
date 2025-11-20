/*
 * Owner: terry@kupotech.com
 */

import getHelpCenterLink, { helpCenterMain } from 'src/utils/helpCenter.js';

jest.mock('utils/siteConfig', () => ({ KUCOIN_HOST: 'http://localhost/' }));

jest.mock('utils/lang', () => {
  return {
    __esModule: true,
    _t: (key) => {
      if (key === '') return ''
      if (key === '') return '';
      return '';
    },
    _tHTML: jest.fn((key) => {
      return '';
    }),
    addLangToPath: url => url,
  }
});

describe('helpCenter tools', () => {
  it('default', () => {
    expect(getHelpCenterLink(123)).toBeDefined();
    expect(helpCenterMain()).toBeDefined();
  })
})
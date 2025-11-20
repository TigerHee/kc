/**
 * Owner: herin.yao@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import { useSelector } from 'dva';

import useHtmlLang from 'src/hooks/useHtmlLang';

jest.mock('dva');

jest.mock('src/utils/langTools', () => {
  return {
    __esModule: true,
    ...jest.requireActual('src/utils/langTools'),
    getPathByLang: jest.fn((lang) => lang),
  };
});

describe('test useHtmlLang', () => {
  it('should set the HTML lang attribute', () => {
    const state = {
      app: {
        currentLang: 'en',
      },
    };
    useSelector.mockImplementation((selector) => selector(state));

    const { rerender } = renderHook(() => useHtmlLang());
    expect(document.documentElement.getAttribute('lang')).toBe('en');

    state.app.currentLang = 'zh-hant';
    rerender();
    expect(document.documentElement.getAttribute('lang')).toBe('zh-hant');
  });
});

/**
 * Owner: willen@kupotech.com
 */
const { default: useBreakpoint } = require('src/hooks/useBreakpoint');
import { renderHook } from '@testing-library/react-hooks';

test('test useBreakpoint', () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: (func) => func(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
  renderHook(useBreakpoint);

  renderHook(useBreakpoint, { initialProps: { xs: false } });

  window.matchMedia = undefined;
  renderHook(useBreakpoint);
});

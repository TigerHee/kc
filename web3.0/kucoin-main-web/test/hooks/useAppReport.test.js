/**
 * Owner: willen@kupotech.com
 */
const { default: useAppReport } = require('src/hooks/useAppReport');
import { renderHook, act } from '@testing-library/react-hooks';

test('test useAppReport', () => {
  Object.defineProperty(window, 'requestIdleCallback', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({})),
  });
  Object.defineProperty(document, 'referrer', { value: null, configurable: true });
  renderHook(useAppReport);

  renderHook(useAppReport);
});

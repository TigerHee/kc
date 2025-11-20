/**
 * Owner: jessie@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
const { default: useLocaleOrder } = require('src/hooks/useLocaleOrder');

jest.useFakeTimers();

describe('useLocaleOrder', () => {
  it('test useLocaleOrder', () => {
    renderHook(() => useLocaleOrder());
  });
});

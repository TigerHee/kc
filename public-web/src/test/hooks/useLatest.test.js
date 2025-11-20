/**
 * Owner: jessie@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
const { default: useLatest } = require('src/hooks/useLatest');

describe('useLatest', () => {
  it('test useLatest', () => {
    renderHook(useLatest);
  });
});

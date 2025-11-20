/**
 * Owner: jessie@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
const {
  default: useResizeObserverLayout,
  useResizeObserverBody,
} = require('src/hooks/useResizeObserverLayout');

describe('useResizeObserverLayout', () => {
  it('test useResizeObserverLayout', () => {
    renderHook(useResizeObserverLayout);
  });
});

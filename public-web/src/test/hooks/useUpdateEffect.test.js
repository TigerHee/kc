/**
 * Owner: willen@kupotech.com
 */
const { default: useUpdateEffect } = require('src/hooks/useUpdateEffect');
import { renderHook } from '@testing-library/react-hooks';

test('test useUpdateEffect', () => {
  const { rerender } = renderHook(useUpdateEffect, { initialProps: jest.fn() });
  rerender();
});

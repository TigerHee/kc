/**
 * Owner: willen@kupotech.com
 */
const { default: useDebounceValue } = require('src/hooks/useDebounceValue');
import { renderHook } from '@testing-library/react-hooks';

test('test useDebounceValue', () => {
  renderHook(useDebounceValue);
});

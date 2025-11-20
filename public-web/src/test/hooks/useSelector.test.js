/**
 * Owner: willen@kupotech.com
 */
const { useSelector } = require('src/hooks/useSelector');
import { renderHook } from '@testing-library/react-hooks';

test('test useSelector', () => {
  renderHook(useSelector);
});

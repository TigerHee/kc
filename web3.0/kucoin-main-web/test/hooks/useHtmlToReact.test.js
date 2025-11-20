/**
 * Owner: willen@kupotech.com
 */

import useHtmlToReact from 'src/hooks/useHtmlToReact';
import { renderHook } from '@testing-library/react-hooks';

test('test useHtmlToReact', () => {
  const div = '<div style="style" class="class" data-test="test" asd="asd">test</div>';
  const { result } = renderHook(() => useHtmlToReact({ html: div }));

  expect(result.current).toEqual({ eles: '' });
});

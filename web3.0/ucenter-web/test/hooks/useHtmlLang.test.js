/**
 * Owner: tiger@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import useHtmlLang from 'src/hooks/useHtmlLang';

test('test useHtmlLang', () => {
  renderHook(useHtmlLang);
});

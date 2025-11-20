/**
 * Owner: tiger@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
import useThemeImg from 'src/hooks/useHtmlLang';

test('test useThemeImg', () => {
  renderHook(useThemeImg);
});

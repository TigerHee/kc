/**
 * Owner: jessie@kupotech.com
 */
import { renderHook } from '@testing-library/react-hooks';
const { default: useHtmlLang } = require('src/hooks/useHtmlLang');

describe('useHtmlLang', () => {
  it('test useHtmlLang', () => {
    renderHook(useHtmlLang);
  });
});

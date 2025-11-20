/*
 * Owner: terry@kupotech.com
 */
import useHtmlToReact from 'hooks/useHtmlToReact';
import { renderHook } from '@testing-library/react-hooks';

jest.mock('html-to-react', () => {
  const HtmlToReact = jest.fn();
  HtmlToReact.Parser = function () {
    this.parse = (html) => html;
  };
  return {
    __esModule: true,
    default: HtmlToReact,
  };
});

describe('useHtmlToReact', () => {
  it('useHtmlToReact', () => {
    expect(useHtmlToReact).toBeDefined();
    const div = '<div style="style" class="class" data-test="test" asd="asd">test</div>';
    const { result } = renderHook(() => useHtmlToReact({ html: div }));
    expect(result.current).toEqual({ eles: '' });
  });
});

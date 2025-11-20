import {
  isArticlePage,
  getNodeContent,
  getTextFromHtml,
  getCompleteUrl,
  DateTimeFormat,
} from 'src/utils/seoTools.js';

import { getLocaleBasename, addLangToPath } from 'tools/i18n';

import { matchPath } from 'react-router-dom';

jest.mock('tools/i18n', () => ({
  getLocaleBasename: jest.fn(),
  addLangToPath: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  matchPath: jest.fn(),
}));

describe('isArticlePage', () => {
  beforeEach(() => {
    window.location.pathname = '';
    getLocaleBasename.mockClear();
    matchPath.mockClear();
  });

  it('should return false for blog article page', () => {
    getLocaleBasename.mockReturnValue('en');
    window.location.pathname = '/en/blog/123/title';
    expect(isArticlePage()).toBe(false);
  });

  it('should return false for blog categories page', () => {
    getLocaleBasename.mockReturnValue('en');
    window.location.pathname = '/en/blog/categories';
    expect(isArticlePage()).toBe(false);
  });

  it('should return true for learn article page', () => {
    window.location.pathname = '/learn/category/title';
    matchPath.mockReturnValue({ params: { title: 'title' } });
    expect(isArticlePage()).toBe(true);
  });

  it('should return true for non-article page', () => {
    window.location.pathname = '/home';

    expect(isArticlePage()).toBe(true);
  });
});

describe('getNodeContent', () => {
  it('should return string content', () => {
    const node = 'Hello World';

    expect(getNodeContent(node)).toBe('Hello World');
  });

  it('should return concatenated content from children', () => {
    const node = {
      props: {
        children: [{ props: { children: 'Hello ' } }, { props: { children: 'World' } }],
      },
    };

    expect(getNodeContent(node)).toBe('Hello World');
  });
});

describe('getTextFromHtml', () => {
  it('should return text content from HTML string', () => {
    const html = '<div>Hello <span>World</span></div>';

    expect(getTextFromHtml(html)).toBe('Hello World');
  });

  it('should return text content from HTML DOM element', () => {
    const html = document.createElement('div');

    html.innerHTML = 'Hello <span>World</span>';

    expect(getTextFromHtml(html)).toBe('Hello World');
  });
});

describe('getCompleteUrl', () => {
  it('should return href property with URL', () => {
    const result = getCompleteUrl(true, '/path', false);

    expect(result).toEqual({ href: '/path' });
  });

  it('should return href property with URL and language path', () => {
    addLangToPath.mockReturnValue('/en/path');

    const result = getCompleteUrl(true, '/path', true);

    expect(result).toEqual({ href: '/en/path' });
  });

  it('should return empty object if judgeCondition is false', () => {
    const result = getCompleteUrl(false, '/path', false);

    expect(result).toEqual({});
  });
});

describe('DateTimeFormat', () => {
  it('should format date correctly for en_US', () => {
    const date = '2023-10-01T00:00:00Z';

    const result = DateTimeFormat({ lang: 'en_US', date });

    expect(result).toBe('10/1/2023');
  });

  it('should format date correctly for ar_AE', () => {
    const date = '2023-10-01T00:00:00Z';

    const result = DateTimeFormat({ lang: 'ar_AE', date });

    expect(result).toBe('1‏/10‏/2023');
  });

  it('should return original date string if formatting fails', () => {
    const date = 'invalid-date';

    const result = DateTimeFormat({ lang: 'en_US', date });

    expect(result).toBe('invalid-date');
  });
});

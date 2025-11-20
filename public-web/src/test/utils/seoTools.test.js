/**
 * Owner: willen@kupotech.com
 */

import {
  // canUseLangLink,
  getTextFromdom,
  getTextFromHtml,
  // isAnnouncementArticle,
  // isAnnouncementCategory,
  isArticlePage,
  isHtmlDom,
  isIdpArticle,
  // isNewsArticle,
  // isSupportArticle,
  matchReg,
} from 'utils/seoTools';

describe('seoTools', () => {
  test('matchReg', () => {
    expect(matchReg('<p>Test</p>')).toBe('Test');
    expect(matchReg(null)).toBe('');
  });

  test('should remove HTML tags from a string', () => {
    const input = '<div>Hello <span>World</span></div>';
    const expectedOutput = 'Hello World';
    expect(matchReg(input)).toBe(expectedOutput);
  });

  test('should return an empty string if input is null', () => {
    expect(matchReg(null)).toBe('');
  });

  test('should return an empty string if input is undefined', () => {
    expect(matchReg(undefined)).toBe('');
  });

  test('should return the same string if there are no HTML tags', () => {
    const input = 'Hello World';
    expect(matchReg(input)).toBe(input);
  });

  test('should handle self-closing tags', () => {
    const input = 'Hello <br/> World';
    const expectedOutput = 'Hello  World';
    expect(matchReg(input)).toBe(expectedOutput);
  });

  test('should handle nested tags', () => {
    const input = '<div><p>Hello <span>World</span></p></div>';
    const expectedOutput = 'Hello World';
    expect(matchReg(input)).toBe(expectedOutput);
  });

  test('should handle multiple tags', () => {
    const input = '<div>Hello</div> <p>World</p>';
    const expectedOutput = 'Hello World';
    expect(matchReg(input)).toBe(expectedOutput);
  });

  test('should handle empty string input', () => {
    expect(matchReg('')).toBe('');
  });

  test('isArticlePage', () => {
    // Replace '/path' with actual paths from INDEPENDENT_ARTICLE_PATHS
    expect(isArticlePage('/support')).toBe(false);
    expect(isArticlePage('/announcement')).toBe(false);
    expect(isArticlePage('/support')).toBe(false);
    expect(isArticlePage('')).toBe(false);
    expect(isIdpArticle('/legal/terms-of-use')).toBe(true);
  });

  // test('canUseLangLink', () => {
  //   // Replace '/path' with actual paths from INDEPENDENT_ARTICLE_PATHS
  //   expect(canUseLangLink('/support')).toBe(true);
  //   expect(canUseLangLink('/support/111')).toBe(true);
  //   expect(canUseLangLink('')).toBe(true);
  // });

  test('getTextFromHtml', () => {
    expect(getTextFromHtml('<p>Test</p>')).toBe('Test');
    expect(getTextFromHtml('Test')).toBe('Test');
  });

  // test('isNewsArticle', () => {
  //   expect(isNewsArticle('/news/categories')).toBe(false);
  // });

  // test('should return true for a valid news article path', () => {
  //   const pathname = '/news/12345';
  //   expect(isNewsArticle(pathname)).toBe(false);
  // });

  // test('should return false for a path with non-numeric id', () => {
  //   const pathname = '/news/abcde';
  //   expect(isNewsArticle(pathname)).toBe(true);
  // });

  // test('should return false for a path that does not match the news pattern', () => {
  //   const pathname = '/blog/12345';
  //   expect(isNewsArticle(pathname)).toBe(false);
  // });

  // test('should return true for a valid news article path with additional segments', () => {
  //   const pathname = '/news/12345/some/extra/segments';
  //   expect(isNewsArticle(pathname)).toBe(false);
  // });

  // test('should return false for a path with a numeric id but includes categories', () => {
  //   const pathname = '/news/categories/12345';
  //   expect(isNewsArticle(pathname)).toBe(false);
  // });

  // test('should return false for an empty path', () => {
  //   const pathname = '';
  //   expect(isNewsArticle(pathname)).toBe(false);
  // });

  // test('should return false for a null path', () => {
  //   const pathname = null;
  //   expect(isNewsArticle(pathname)).toBe(false);
  // });

  // test('should return false for an undefined path', () => {
  //   const pathname = undefined;
  //   expect(isNewsArticle(pathname)).toBe(false);
  // });

  // test('isAnnouncementCategory', () => {
  //   expect(isAnnouncementCategory('/announcement/history')).toBe(true);
  //   expect(isAnnouncementCategory('/announcement/123')).toBe(false);
  // });

  // test('isAnnouncementArticle', () => {
  //   expect(isAnnouncementArticle('/announcement/123')).toBe(true);
  //   expect(isAnnouncementArticle('/announcement/history')).toBe(false);
  // });

  // jest.mock('utils/seoTools', () => ({
  //   ...require.requireActual('utils/seoTools'),
  //   isAnnouncementCategory: jest.fn(),
  // }));
  // test('should return true for a valid announcement article path', () => {
  //   const pathname = '/announcement/12345';
  //   expect(isAnnouncementArticle(pathname)).toBe(true);
  // });

  // test('should return false for a path containing /page/', () => {
  //   const pathname = '/announcement/12345/page/2';
  //   expect(isAnnouncementArticle(pathname)).toBe(false);
  // });

  // test('should return false for a path that is an announcement category', () => {
  //   const pathname = '/announcement/category';
  //   expect(isAnnouncementArticle(pathname)).toBe(true);
  // });

  // test('should return false for a path that does not match the announcement pattern', () => {
  //   const pathname = '/blog/12345';
  //   expect(isAnnouncementArticle(pathname)).toBe(false);
  // });

  // test('should return false for an empty path', () => {
  //   const pathname = '';
  //   expect(isAnnouncementArticle(pathname)).toBe(false);
  // });

  test('isIdpArticle', () => {
    // Replace '/path' with actual paths from INDEPENDENT_ARTICLE_PATHS
    expect(isIdpArticle('/news/123')).toBe(false);
    expect(isIdpArticle('')).toBe(false);
    expect(isIdpArticle('/legal/terms-of-use')).toBe(true);
  });

  // test('isSupportArticle', () => {
  //   expect(isSupportArticle('/support/123')).toBe(true);
  //   expect(isSupportArticle('/support')).toBe(false);
  //   expect(isSupportArticle('')).toBe(false);
  // });

  test('getTextFromdom', () => {
    const node = document.createTextNode('Test');
    expect(getTextFromdom(node)).toBe('Test');
  });

  test('should return an empty string if node is null', () => {
    expect(getTextFromdom(null)).toBe('');
  });

  test('should return an empty string if node is undefined', () => {
    expect(getTextFromdom(undefined)).toBe('');
  });

  test('should return the text content of a text node', () => {
    const textNode = document.createTextNode('Hello World');

    expect(getTextFromdom(textNode)).toBe('Hello World');
  });

  test('should return the concatenated text content of an element node with child text nodes', () => {
    const div = document.createElement('div');

    div.appendChild(document.createTextNode('Hello '));

    div.appendChild(document.createTextNode('World'));

    expect(getTextFromdom(div)).toBe('Hello World');
  });

  test('should return the concatenated text content of nested element nodes', () => {
    const div = document.createElement('div');

    const span = document.createElement('span');

    span.appendChild(document.createTextNode('Hello '));

    div.appendChild(span);

    div.appendChild(document.createTextNode('World'));

    expect(getTextFromdom(div)).toBe('Hello World');
  });

  test('should return an empty string for an element node with no child nodes', () => {
    const div = document.createElement('div');

    expect(getTextFromdom(div)).toBe('');
  });

  test('should handle deeply nested nodes', () => {
    const div = document.createElement('div');

    const span = document.createElement('span');

    const b = document.createElement('b');

    b.appendChild(document.createTextNode('Hello '));

    span.appendChild(b);

    div.appendChild(span);

    div.appendChild(document.createTextNode('World'));

    expect(getTextFromdom(div)).toBe('Hello World');
  });

  test('isHtmlDom', () => {
    const node = document.createElement('div');
    expect(isHtmlDom(node)).toBe(true);
    expect(isHtmlDom('Test')).toBe(false);
  });

  test('should return true for an HTMLElement object', () => {
    const div = document.createElement('div');
    expect(isHtmlDom(div)).toBe(true);
  });

  test('should return true for an object with nodeType and nodeName properties', () => {
    const fakeElement = {
      nodeType: 1,
      nodeName: 'DIV',
    };
    expect(isHtmlDom(fakeElement)).toBe(true);
  });

  test('should return false for a plain object', () => {
    const obj = { key: 'value' };
    expect(isHtmlDom(obj)).toBe(false);
  });

  test('should return false for a string', () => {
    const str = '<div></div>';
    expect(isHtmlDom(str)).toBe(false);
  });

  test('should return false for a number', () => {
    const num = 123;
    expect(isHtmlDom(num)).toBe(false);
  });

  test('should return false for undefined', () => {
    expect(isHtmlDom(undefined)).toBe(false);
  });

  test('should return false for a function', () => {
    const func = () => {};
    expect(isHtmlDom(func)).toBe(false);
  });

  test('should return false for an array', () => {
    const arr = [];
    expect(isHtmlDom(arr)).toBe(false);
  });
});

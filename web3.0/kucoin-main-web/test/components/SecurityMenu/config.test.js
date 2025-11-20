/**
 * Owner: larvide.peng@kupotech.com
 */

import { NEWSLIST, articles, canSearchArticles } from 'src/components/SecurityMenu/config.js';

describe('test SecurityMenu config', () => {
  test('test SecurityMenu config - NEWSLIST', () => {
    expect(NEWSLIST.length).toBe(4);
    NEWSLIST.forEach((item) => {
      expect(item.tag).toBeDefined();
      expect(item.type).toBeDefined();
      expect(item.news).toBeDefined();
      item.news.forEach((newsItem) => {
        expect(newsItem.images).toBeDefined();
        expect(newsItem.title).toBeDefined();
        expect(newsItem.path).toBeDefined();
      });
    });
  });

  test('test SecurityMenu config- articles', () => {
    const item = articles[0];
    expect(item.id).toBe('1');
    expect(item.mode).toBe('left');
    expect(item.type).toBe('category');
    expect(item.path).toBe('/security/account-security#1-1');
    expect(item.title).toBe('6466d82f9d854000a50f');
    expect(item.desc).toBe('73a9758b70d94000a458');
    expect(item.articleNavigation).toEqual({ prev: false, next: true });

    const item2 = articles[1];
    expect(item2.id).toBe('2');
    expect(item2.mode).toBe('right');
    expect(item2.type).toBe('category');
    expect(item2.path).toBe('/security/secure-your-funds-and-wallet#2-1');
    expect(item2.title).toBe('fc5a3212ae234000a1cc');
    expect(item2.desc).toBe('1b329fd0297b4000a61a');
    expect(item2.articleNavigation).toEqual({ prev: true, next: true });

    const lastItem = articles[articles.length - 1];
    expect(lastItem.articleNavigation).toEqual({ prev: true, next: false });
    expect(lastItem.mode).toBe('right');
    expect(lastItem.type).toBe('category');
  });

  test('test SecurityMenu config - canSearchArticles', () => {
    canSearchArticles.forEach((item) => {
      expect(item.title).toBeDefined();
      expect(item.path).toBeDefined();
      expect(item.id).toBeDefined();
      expect(item.type).toBeDefined();
    });
  });
});

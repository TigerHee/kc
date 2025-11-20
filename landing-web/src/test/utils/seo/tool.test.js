/*
 * Owner: terry@kupotech.com
 */
import {
  DEFAULT_LOCALE,
  getLocaleFromLocaleMap,
  replaceHelpCenterUrl,
  resolveArticalLinks,
  replaceOldOrigin,
  replacezhHans2zhHant,
} from 'utils/seo/tool';

describe('seo tools', () => {

  it('DEFAULT_LOCALE', () => {
    expect(DEFAULT_LOCALE).toBeDefined();
  })

  it('getLocaleFromLocaleMap no args', () => {
    expect(getLocaleFromLocaleMap()).toEqual(DEFAULT_LOCALE);
  })

  it('getLocaleFromLocaleMap zh_hk', () => {
    expect(getLocaleFromLocaleMap('zh_HK')).toEqual('zh-hant');
  })

  it('getLocaleFromLocaleMap zh_hk1', () => {
    expect(getLocaleFromLocaleMap('zh_HK1')).toEqual(DEFAULT_LOCALE);
  })

  it('replaceHelpCenterUrl replace articles', () => {
    expect(
      replaceHelpCenterUrl(`href="https://support.kucoin.plus/hc/ja/articles/1234"`)
    ).toEqual(
      expect.stringContaining('ja/support/1234')
    )
  });

  it('replaceHelpCenterUrl replace categories', () => {
    expect(
      replaceHelpCenterUrl(`href="https://support.kucoin.plus/hc/ru/categories/1234"`)
    ).toEqual(
      expect.stringContaining('ru/support/categories/1234')
    )
  });

  it('resolveArticalLinks empty', () => {
    expect(resolveArticalLinks()).toBeUndefined();
  })

  it('resolveArticalLinks content', () => {
    expect(resolveArticalLinks('https://www.kucoin.net')).toBeDefined();
  })

  it('replaceOldOrigin empty', () => {
    expect(replaceOldOrigin()).toBeUndefined();
  })

  it('replaceOldOrigin content1', () => {
    expect(replaceOldOrigin(`
      <a href="https://futures.kucoin.com"></a>
    `)).toEqual(
      expect.stringContaining('kucoin.com/futures')
    )
  });

  it('replacezhHans2zhHant', () => {
    expect(
      replacezhHans2zhHant(`href="https://www.kucoin.net/zh-hans/testPage"`)
    ).toEqual(
      expect.stringContaining('http://localhost/zh-hant/testPage')
    )
  })
});
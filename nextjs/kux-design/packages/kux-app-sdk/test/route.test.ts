import { openLink, buildURL, addLang2Path, getBaseName, getPathnameWithoutLang } from '../src/route'

describe('route', () => {
  it('openLink', () => {
    // expect(!!isUseSSG).toBe(false)
  })
  it('buildURL', () => {
    const url1 = buildURL('/test', {
      query: {
        abc: 123,
      }
    });
    expect(url1.includes('/test?abc=123')).toBe(true);
    expect(url1.startsWith('http://')).toBe(true);
    expect(buildURL('/test#some-hash', {
      query: {
        abc: 123,
      }
    }).endsWith('/test?abc=123#some-hash')).toBe(true)

    expect(buildURL('https://kucoin.com/test?abc=222', {
      query: {
        abc: 123,
      }
    })).toBe('https://kucoin.com/test?abc=123')

    expect(buildURL('https://example.com/test?abc=222#some-hash', {
      clearHash: true,
      clearQuery: true,
      query: {
        a: '中文',
        b: null,
        c: undefined,
      }
    })).toBe('https://example.com/test?a=' + encodeURIComponent('中文'))
  })

  it('buildURL for appPath', () => {
    expect(buildURL('/test', {
      isAppPath: true,
      query: {
        abc: 123,
      }
    })).toBe('/test?abc=123')
    expect(buildURL('/test#some-hash', {
      isAppPath: true,
      query: {
        abc: 123,
      }
    })).toBe('/test?abc=123#some-hash')

    expect(buildURL('/test?abc=222', {
      isAppPath: true,
      query: {
        abc: 123,
      }
    })).toBe('/test?abc=123')

    expect(buildURL('/test?abc=222#some-hash', {
      isAppPath: true,
      clearHash: true,
      query: {
        abc: 123,
      }
    })).toBe('/test?abc=123')

    expect(buildURL('/test?abc=222#some-hash', {
      isAppPath: true,
      clearHash: true,
      clearQuery: true,
      query: {
        a: '中文',
        b: null,
        c: undefined,
      }
    })).toBe('/test?a=' + encodeURIComponent('中文'))
  })
  it('addLang2Path', () => {
    expect(addLang2Path('/test?lang=zh-hant')).toBe(location.origin + '/test')
    expect(addLang2Path('/test?lang=zh-hant&spm=test')).toBe(location.origin + '/test?spm=test')
    expect(addLang2Path('/test?lang=&spm=test')).toBe(location.origin + '/test?spm=test')
    expect(addLang2Path('/test?lang&spm=test')).toBe(location.origin + '/test?spm=test')
    expect(addLang2Path('/test?spm=test&lang=zh-hant')).toBe(location.origin + '/test?spm=test')
    expect(addLang2Path('/test/?spm=test&lang=zh-hant')).toBe(location.origin + '/test?spm=test')
    expect(addLang2Path('/zh-hant/test', 'zh-hant')).toBe(location.origin + '/zh-hant/test')
    expect(addLang2Path('/zh-hant/test', 'en')).toBe(location.origin + '/test')
    expect(addLang2Path('/zh-hant/test', 'ja')).toBe(location.origin + '/ja/test')
    expect(addLang2Path('/test', 'ja')).toBe(location.origin + '/ja/test')
    expect(addLang2Path('/test', 'en')).toBe(location.origin + '/test')
    expect(addLang2Path('https://kucoin.com/test', 'en-US')).toBe('https://kucoin.com/test')
    expect(addLang2Path('https://www.kucoin.com/zh-hant/test', 'en-US')).toBe('https://www.kucoin.com/test')
    expect(addLang2Path('https://test.local/zh-hant/test', 'en-US')).toBe('https://test.local/test')
    expect(addLang2Path('https://www.example.com/zh-hant/test', 'en-US')).toBe('https://www.example.com/zh-hant/test')
    expect(addLang2Path('/test', 'zh-hant')).toBe(location.origin + '/zh-hant/test')
  })
  it('getBaseName', () => {
    expect(getBaseName()).toBe('')
  })
  it('getPathnameWithoutLang', () => {
    expect(getPathnameWithoutLang()).toBe('')
  })
})
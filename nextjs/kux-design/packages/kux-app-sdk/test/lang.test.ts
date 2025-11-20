import { SUPPORTED_LANGS, isLangSupported, DEFAULT_LANG,
  convertLangStyle, getCurrentLang, isRTL, setLang,
} from '../src/lang'
import { globalObject } from '../src/utils';

describe('lang', () => {
  describe('SUPPORTED_LANGS & DEFAULT_LANG', () => {
    expect(SUPPORTED_LANGS.length).toBeGreaterThan(0)
    it.each(SUPPORTED_LANGS)('SUPPORTED_LANGS: %s', (lang) => {
      expect(/^[a-z]+_[A-Z]+$/.test(lang)).toBe(true)
    })

    expect(DEFAULT_LANG).toContain('en_US')
  })

  it('isLangSupported', () => {
    expect(isLangSupported('en_US')).toBe(true)
    expect(isLangSupported('zh_CN')).toBe(false)
    // zh-Hant => zh-HK
    expect(isLangSupported('zh-Hant')).toBe(true)
    expect(isLangSupported('zh-HK')).toBe(true)
    expect(isLangSupported('zh-TW')).toBe(false)
  })

  describe('convertLangStyle', () => {
    it.each([
      ['zh-hant', 'standard', 'zh-HK'],
      ['zh-hant', 'underscore', 'zh_HK'],
      ['zh-HANT', 'path', 'zh-hant'],
      ['zh-hk', 'path', 'zh-hant'],
      ['zh_HK', 'path', 'zh-hant'],
      ['zh-hant', 'path', 'zh-hant'],
      ['zh-Hant', 'path', 'zh-hant'],
      ['zh-Hant', 'standard', 'zh-HK'],
      ['zh-Hant', 'underscore', 'zh_HK'],
      ['zh-Hant', 'path', 'zh-hant'],
      ['zh-HK', 'path', 'zh-hant'],
      ['zh-HK', 'standard', 'zh-HK'],
      ['zh-HK', 'underscore', 'zh_HK'],
      ['zh-HK', 'path', 'zh-hant'],
      ['en-US', 'standard', 'en-US'],
      ['en-US', 'underscore', 'en_US'],
      ['en-US', 'path', ''],
    ])('convertLangStyle(%j, %j) === %j', (lang, style, expected) => {
      // @ts-expect-error ignore for test
      expect(convertLangStyle(lang, style)).toBe(expected)
    })
  })

  // for unsupported lang using general convention
  it.each([
    ['unknown lang to underscore(zh-tw)', 'zh-tw', 'standard', 'zh-TW'],
    ['unknown lang to underscore(zh-CN)',  'zh-CN', 'underscore', 'zh_CN'],
    ['unknown lang to underscore(zh-traditional)', 'zh-traditional', 'underscore', 'zh_TRADITIONAL'],
    ['unknown lang to path(en)', 'en', 'path', ''],
    // unknown lang: 原样返回
    ['unknown lang to path(ab-CD)', 'ab-CD', 'path', ''],
    // unknown style: 原样返回
    ['unknown format(abc-format)','ab-CD', 'abc-format', 'ab_CD'],
  ])('%j', (_, lang, style, expected) => {
    // @ts-expect-error sss
    expect(convertLangStyle(lang, style)).toBe(expected)
  })

  it('getCurrentLang', () => {
    expect(getCurrentLang()).toBe('en_US')
  })

  it('isRTL', () => {
    expect(isRTL('ar_AE')).toBe(true)
    expect(isRTL('zh_CN')).toBe(false)
    expect(isRTL('en_US')).toBe(false)
    expect(isRTL()).toBe(false)
  })

  it('setLang', () => {
    expect(setLang('zh-HK')).toBe(true)
    expect(getCurrentLang()).toBe('zh_HK')
    // unsupported lang
    expect(setLang('zh-TW')).toBe(false)
    expect(getCurrentLang()).toBe('zh_HK')
    expect(setLang('zh-CN')).toBe(false)
    expect(getCurrentLang()).toBe('zh_HK')
    expect(setLang('zh-CN')).toBe(false)
    expect(getCurrentLang()).toBe('zh_HK')
    expect(setLang('en-US')).toBe(true)
    expect(getCurrentLang()).toBe('en_US')
    expect(setLang('en-US')).toBe(false)
    expect(getCurrentLang()).toBe('en_US')
    expect(setLang('en')).toBe(false)
    expect(setLang('ar_AE')).toBe(true)
    expect(getCurrentLang()).toBe('ar_AE')
    expect(isRTL()).toBe(true)
  })
})

describe('lang without boot.js', () => {
  const bootValues = {
    _DEFAULT_LANG_: globalObject._DEFAULT_LANG_,
    __KC_LANGUAGES__: globalObject.__KC_LANGUAGES__,
    __KC_LANGUAGES_BASE_MAP__: globalObject.__KC_LANGUAGES_BASE_MAP__,
  }
  beforeAll(() => {
    Object.keys(bootValues).forEach(key => {
      delete globalObject[key]
    })
    vi.resetModules();
  })
  afterAll(() => {
    Object.assign(globalObject, bootValues)
  })

  it('test lang without boot.js', async () => {
    // re-import lang.ts to reset the globalObject
    const { SUPPORTED_LANGS, isLangSupported, DEFAULT_LANG,
    convertLangStyle,
    } = await import('../src/lang')
    expect(SUPPORTED_LANGS.length).toBeGreaterThan(0)
    expect(DEFAULT_LANG).toContain('en_US')
    expect(isLangSupported('en_US')).toBe(true)
    // 找不到语言即认为空(默认语言)
    expect(convertLangStyle('en-UK', 'path')).toBe('')
    expect(convertLangStyle('en-UK', 'underscore')).toBe('en_UK')
  })
})

describe('lang with eu-boot.js', () => {
  const EU__KC_LANGUAGES_BASE_MAP__ = {
    "baseToLang": {
      "en-eu": "en_US",
      "de-eu": "de_DE",
      "es-eu": "es_ES",
      "fr-eu": "fr_FR",
      "ko-eu": "ko_KR",
      "nl-eu": "nl_NL",
      "pt-eu": "pt_PT",
      "ru-eu": "ru_RU",
      "tr-eu": "tr_TR",
      "vi-eu": "vi_VN",
      "zh-hant-eu": "zh_HK",
      "it-eu": "it_IT",
      "id-eu": "id_ID",
      "ms-eu": "ms_MY",
      "hi-eu": "hi_IN",
      "th-eu": "th_TH",
      "ja-eu": "ja_JP",
      "bn-eu": "bn_BD",
      "pl-eu": "pl_PL",
      "fil-eu": "fil_PH",
      "ar-eu": "ar_AE",
      "ur-eu": "ur_PK",
      "uk-eu": "uk_UA"
    },
    "langToBase": {
      "en_US": "en-eu",
      "de_DE": "de-eu",
      "es_ES": "es-eu",
      "fr_FR": "fr-eu",
      "ko_KR": "ko-eu",
      "nl_NL": "nl-eu",
      "pt_PT": "pt-eu",
      "ru_RU": "ru-eu",
      "tr_TR": "tr-eu",
      "vi_VN": "vi-eu",
      "zh_HK": "zh-hant-eu",
      "it_IT": "it-eu",
      "id_ID": "id-eu",
      "ms_MY": "ms-eu",
      "hi_IN": "hi-eu",
      "th_TH": "th-eu",
      "ja_JP": "ja-eu",
      "bn_BD": "bn-eu",
      "pl_PL": "pl-eu",
      "fil_PH": "fil-eu",
      "ar_AE": "ar-eu",
      "ur_PK": "ur-eu",
      "uk_UA": "uk-eu"
    }
  };
  const __KC_LANGUAGES_BASE_MAP__ = globalObject.__KC_LANGUAGES_BASE_MAP__;
  beforeAll(() => {
    globalObject.__KC_LANGUAGES_BASE_MAP__ = EU__KC_LANGUAGES_BASE_MAP__;
  })
  afterAll(() => {
    globalObject.__KC_LANGUAGES_BASE_MAP__ = __KC_LANGUAGES_BASE_MAP__
  })

  it('convertLangStyle', () => {
    const testCases = [
      ['en_US', 'path', 'en-eu'],
      ['en-eu', 'standard', 'en-US'],
      ['en-eu', 'underscore', 'en_US'],
      ['zh_HK', 'path', 'zh-hant-eu'],
      ['zh-hant-eu', 'standard', 'zh-HK'],
      ['zh-hant-eu', 'underscore', 'zh_HK'],
      ['ja_JP', 'path', 'ja-eu'],
      ['ja-eu', 'standard', 'ja-JP'],
      ['ja-eu', 'underscore', 'ja_JP'],
    ] as const

    testCases.forEach(([lang, style, expected]) => {
      expect(convertLangStyle(lang, style)).toBe(expected)
    })
  })

})


describe('lang with au-boot.js', () => {
  const AU__KC_LANGUAGES_BASE_MAP__ = {
    "baseToLang": {
      "en-au": "en_US",
      "de-au": "de_DE",
      "es-au": "es_ES",
      "fr-au": "fr_FR",
      "ko-au": "ko_KR",
      "nl-au": "nl_NL",
      "pt-au": "pt_PT",
      "ru-au": "ru_RU",
      "tr-au": "tr_TR",
      "vi-au": "vi_VN",
      "zh-hant-au": "zh_HK",
      "it-au": "it_IT",
      "id-au": "id_ID",
      "ms-au": "ms_MY",
      "hi-au": "hi_IN",
      "th-au": "th_TH",
      "ja-au": "ja_JP",
      "bn-au": "bn_BD",
      "pl-au": "pl_PL",
      "fil-au": "fil_PH",
      "ar-au": "ar_AE",
      "ur-au": "ur_PK",
      "uk-au": "uk_UA"
    },
    "langToBase": {
      "en_US": "en-au",
      "de_DE": "de-au",
      "es_ES": "es-au",
      "fr_FR": "fr-au",
      "ko_KR": "ko-au",
      "nl_NL": "nl-au",
      "pt_PT": "pt-au",
      "ru_RU": "ru-au",
      "tr_TR": "tr-au",
      "vi_VN": "vi-au",
      "zh_HK": "zh-hant-au",
      "it_IT": "it-au",
      "id_ID": "id-au",
      "ms_MY": "ms-au",
      "hi_IN": "hi-au",
      "th_TH": "th-au",
      "ja_JP": "ja-au",
      "bn_BD": "bn-au",
      "pl_PL": "pl-au",
      "fil_PH": "fil-au",
      "ar_AE": "ar-au",
      "ur_PK": "ur-au",
      "uk_UA": "uk-au"
    }
  }
  const __KC_LANGUAGES_BASE_MAP__ = globalObject.__KC_LANGUAGES_BASE_MAP__;
  beforeAll(() => {
    globalObject.__KC_LANGUAGES_BASE_MAP__ = AU__KC_LANGUAGES_BASE_MAP__;
  })
  afterAll(() => {
    globalObject.__KC_LANGUAGES_BASE_MAP__ = __KC_LANGUAGES_BASE_MAP__
  })

  it('convertLangStyle', () => {
    const testCases = [
      ['en_US', 'path', 'en-au'],
      ['en-au', 'standard', 'en-US'],
      ['en-au', 'underscore', 'en_US'],
      ['zh_HK', 'path', 'zh-hant-au'],
      ['zh-hant-au', 'standard', 'zh-HK'],
      ['zh-hant-au', 'underscore', 'zh_HK'],
      ['ja_JP', 'path', 'ja-au'],
      ['ja-au', 'standard', 'ja-JP'],
      ['ja-au', 'underscore', 'ja_JP'],
    ] as const

    testCases.forEach(([lang, style, expected]) => {
      expect(convertLangStyle(lang, style)).toBe(expected)
    })
  })

})
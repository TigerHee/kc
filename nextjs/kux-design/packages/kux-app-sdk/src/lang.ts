/**
 * 用户信息 & 多语言
 */
import { BUILTIN_EVENT_NAMES } from './config';
import { innerEmit } from './event';
import { storage } from './storage'
import { globalObject, param as appParam  } from './utils';

/**
 * 默认语言
 */
export const DEFAULT_LANG = globalObject._DEFAULT_LANG_ || 'en_US';

/**
 * 支持的语言
*/
const DEFAULT_SUPPORT_LANGS = [
  'de_DE',
  'en_US',
  'es_ES',
  'fr_FR',
  'ko_KR',
  'nl_NL',
  'pt_PT',
  'ru_RU',
  'tr_TR',
  'vi_VN',
  'zh_HK',
  'it_IT',
  'id_ID',
  'ms_MY',
  'hi_IN',
  'th_TH',
  'ja_JP',
  'bn_BD',
  'pl_PL',
  'fil_PH',
  'ar_AE',
  'ur_PK',
  'uk_UA',
] as const;

export const SUPPORTED_LANGS: string[] = globalObject.__KC_LANGUAGES__?.__ALL__ || DEFAULT_SUPPORT_LANGS;

export type ILang = typeof SUPPORTED_LANGS[number];

// RTL语言前缀
const rtlLangs = ['ar', 'fa', 'ur']

/**
 * 判断语言是否支持
 * @param lang 语言, 如: zh-Hant, en-US
 * @returns
 */
export function isLangSupported(lang: string) {
  return SUPPORTED_LANGS.includes(convertLangStyle(lang, 'underscore'));
}

/**
 * 转换语言风格, 同时将特殊语言转换为标准语言, 兼容跨共享站的语言风格转换
 * @param lang 语言
 * @param style 风格, 默认为 underscore
 *    * path 路径中使用: 全小写, 大部分取语言前两位, 如 en, 少部分取完整语言, 如 zh-hant
 *    * standard 标准: 以'-'分隔, 前部分小写, 后部分大写, 如: zh-HK, en-US
 *    * underscore 下划线: 以'_'分隔, 前部分小写, 后部分大写, 如: zh_HK, en_US
 * @returns 转换后的语言
 */
export function convertLangStyle(lang: string,
  style: 'path' | 'standard' | 'underscore' = 'underscore') {
  const base2LangMap = globalObject.__KC_LANGUAGES_BASE_MAP__?.baseToLang || {};
  const lang2baseMap = globalObject.__KC_LANGUAGES_BASE_MAP__?.langToBase || {};

  if (style !== 'path') {
    const formattedLang = convertLang2Underscore(lang, base2LangMap, lang2baseMap);
    if (style === 'standard') {
      return formattedLang?.replace(/_/g, '-');
    }
    return formattedLang;
  }
  return convertLang2Path(lang, base2LangMap, lang2baseMap)
}

const SITE_BRAND = String(globalObject._BRAND_SITE_ || '').toLowerCase();
// * 区域后缀, 如: -au, -eu
const REGION_SUFFIX = SITE_BRAND && SITE_BRAND !== 'kc' ? `-${SITE_BRAND}` : '';

// 将语言转换为下划线风格, 如: zh-Hant => zh_HK, en-US => en_US
function convertLang2Underscore(lang: string, base2lang: Record<string, any>, lang2base: Record<string, any>) {
  // 当前语言已经存在, 直接返回
  if (lang2base[lang]) return lang;
  // 尝试将语言转换为下划线风格, 如: zh-Hant => zh_HK, en-US => en_US
  const underscoreLang = tryConvert2underscoreStyle(lang)
  if (lang2base[underscoreLang]) return underscoreLang;
  // 转换为小写连字符风格
  const formattedLang = lang.toLowerCase().replace(/_/g, '-');
  const langFromBase = base2lang[formattedLang];
  if (langFromBase) {
    return langFromBase;
  }
  // 尝试去掉区域后缀, 2位字母(-au, -eu), 不影响 zh-hant 场景, 再查找
  const tryFixedLang = formattedLang.replace(/-[a-z]{2}$/g, '') + REGION_SUFFIX;
  if (base2lang[tryFixedLang]) {
    return base2lang[tryFixedLang];
  }
  // 如果没有找到对应的语言, 则返回下划线风格
  return underscoreLang;
}

// 将语言转换为路径风格, 如: zh_HK => zh-hant, en_US => en-us
function convertLang2Path(lang: string, base2lang: Record<string, any>, lang2base: Record<string, any>) {
  // 已经是路径风格, 直接返回
  if (base2lang[lang]) return lang;
  // 去掉区域后缀, 2位字母(-au, -eu), 不影响 zh-hant 场景, 再查找
  const formattedLang = lang.toLowerCase().replace(/_/g, '-').replace(/-[a-z]{2}$/g, '') + REGION_SUFFIX;
  if (base2lang[formattedLang]) {
    return formattedLang;
  }
  // 尝试将语言转换为下划线风格, 如: zh-Hant => zh_HK, en-US => en_US
  const underscoreLang = tryConvert2underscoreStyle(lang)
  const baseFormLang = lang2base[underscoreLang];
  if (baseFormLang) {
    return baseFormLang
  }
  // 找不到即认为默认语言, 路径空
  // 当前除了共享站点(欧洲站/澳洲站)外其他站点默认语言的路径都是空
  return '';
}

/**
 * 尝试将语言转换为下划线风格 en-US => en_US, en_US => en_US, en_us => en_US
 */
function tryConvert2underscoreStyle(lang: string) {
  // 尝试将语言转换为下划线风格, 如: zh-Hant => zh_HK, en-US => en_US
  return lang.toLowerCase().replace(/[-_]([a-z]+)$/g, (_, $1)=> `_${$1.toUpperCase()}`);
}

/**
 * 当前用户语言
 */
let currentLang: ILang = (function(){
  const langs = [
    // 从url参数中获取语言
    appParam('lang'),
    // 从路径中获取语言
    globalObject.location && globalObject.location.pathname.split('/')[1],
    // 从本地存储中获取语言
    storage('lang'),
    // 从浏览器中获取语言
    // @ts-expect-error support old language
    (globalObject.navigator?.language || globalObject.navigator?.userLanguage),
  ].filter(Boolean) as string[]

  const detectedLang = langs.find(isLangSupported)
  return detectedLang ? convertLangStyle(detectedLang) as ILang : DEFAULT_LANG
})();

/**
 * 获取当前用户语言
 */
export function getCurrentLang() {
  return currentLang;
}

/**
 * 判断是否是RTL语言
 */
export function isRTL(lang?: string) {
  const ll = String(lang || currentLang).toLowerCase();
  return rtlLangs.some(l => ll.startsWith(l));
}

/**
 * 切换语言
 * @returns 是否切换成功
 */
export function setLang(lang: string) {
  const formatted = convertLangStyle(lang, 'underscore');
  // 不支持的语言或者当前语言一致, 直接返回
  if (!isLangSupported(formatted) || formatted === currentLang) {
    return false
  }
  currentLang = formatted as ILang;
  storage('lang', formatted);
  // 触发语言变化事件立即出发, 因为语言变化后, 需要重新加载语言文件, 若应用已经加载完成, 则需要刷新页面
  innerEmit({
    eventName: BUILTIN_EVENT_NAMES.LANG_CHANGED,
    immediate: true
  }, formatted)
  return true
}

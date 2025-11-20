/**
 * 日期时间格式化
 */
import Big from 'big.js';
import { config } from './config';
import { getCurrentLang, convertLangStyle, isRTL } from './lang';

const DEFAULT_FORMAT_NUMBER_OPTIONS: Intl.NumberFormatOptions = {
  // 默认精度
  maximumFractionDigits: 20,
  currency: '',
};

export interface IFormatNumberOptions extends Intl.NumberFormatOptions {
  /**
   * 语言, 默认为当前语言
   */
  lang?: string;
  /**
   * 是否显示符号, 负数始终显示符号 -
   * * 若为true, 正数会显示 +
   */
  showSign?: boolean;
  /**
   * 货币符号
   * @deprecated 罕见使用方式
   */
  currency?: string;
}

export function formatNumber(number: number | string, options: IFormatNumberOptions = {}) {
  try {
    const absNumber = new Big(number).abs().toNumber();
    const { lang, currency = '', showSign, ...intlOptions } = { ...DEFAULT_FORMAT_NUMBER_OPTIONS, ...options }
    const locale = convertLangStyle(lang || getCurrentLang(), 'standard');
    const formatter = new Intl.NumberFormat(locale, intlOptions);
    const validNumber = formatter.format(absNumber);
    // 判断符号
    const signSymbol = +number < 0 ? '-' : showSign ? '+' : '';
    // 需要反转的语言, % 单独处理
    if (intlOptions.style === 'percent') {
      if (isRTL(locale)) {
        const num = `\u202D${validNumber.replace('%', '')}\u202C`;
        return `\u202E${signSymbol}${num}%\u202C`; // -10.23%，页面上会自动转
      }
      return `${signSymbol}${validNumber}`;
    }
    return `${signSymbol}${currency}${validNumber}`;
  } catch (e) {
    console.warn('[formatNumber] error:', e);
    // 保证返回字符串
    return String(number);
  }
}


const DEFAULT_DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hourCycle: 'h23',
  day: '2-digit',
  month: '2-digit',
};

export interface IFormatDateTimeOptions extends Intl.DateTimeFormatOptions {
  /**
   * 语言, 默认为当前语言
   */
  lang?: string;
  /**
   * 需要格式化的时区
   */
  timeZone?: string;
}

/**
 * 日期时间格式化, 返回
 * * options 中的 timeZone 支持 UTC 格式, 若传空则使用浏览器默认时区
 */
export function formatDateTime(date: string  | number | Date, options: IFormatDateTimeOptions = {}) {
  try {
    const newOptions = { timeZone: config('timeZone'), ...DEFAULT_DATE_FORMAT_OPTIONS, ...options };
    if (newOptions.timeZone) {
      newOptions.timeZone = formatUTCTimezone(newOptions.timeZone) as string;
    } else {
      // 兼容传入的 "", null, 等空值的场景, 删除无效属性, 避免报错
      // 清除后, 会使用浏览器默认时区来格式化时间
      // @ts-expect-error 删除无效属性
      delete newOptions.timeZone;
    }
    const dateOjb = new Date(date).valueOf();
    const locale = convertLangStyle(newOptions.lang || getCurrentLang(), 'standard');
    const dateTimeFormat = new Intl.DateTimeFormat(locale, newOptions);
    const formatted = dateTimeFormat.format(dateOjb);
    if (locale === 'en-US' || isRTL(locale)) {
      return formatted.replace(',', '');
    }
    return formatted;
  } catch (e) {
    console.warn('[formatDateTime] error:', e);
    // 保证返回字符串
    return String(date);
  }
}

/**
 * 格式化 UTC 时区, 转换为 Intl.DateTimeFormat 可用的 Etc/GMT 格式
 * UTC-8 => Etc/GMT+8
 * 一般时区格式: Asia/Shanghai
 */
function formatUTCTimezone(timeZone?: string) {
  if (!timeZone || !/^utc(.*)$/i.test(timeZone)) return timeZone;
  const offset = Number(RegExp.$1 || '+0');
  if (isNaN(offset)) return timeZone;
  return `Etc/GMT${offset < 0 ? '+' : '-'}${Math.abs(offset)}`;
}
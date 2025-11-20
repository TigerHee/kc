/**
 * Owner: iron@kupotech.com
 */
import { find, size, includes, split, some, toLower, indexOf, toNumber } from 'lodash';
import md5 from 'md5';
import qs from 'query-string';
import Big, { BigNumber } from 'bignumber.js';
import sensors from 'tools/sensors';
import { bootConfig } from 'kc-next/boot';
import * as Sentry from '@sentry/nextjs';
import QueryPersistence, { queryPersistence } from 'tools/base/QueryPersistence';
import remoteEvent from 'tools/remoteEvent';
import storage from 'tools/storage';
import { IS_SSG_ENV } from 'kc-next/env';
import addLangToPath from 'tools/addLangToPath';
import { DEFAULT_TRACK_SRC, MAX_RCODE_EXPIRE, LOCAL_RCODE_KEY } from './constants';
import { getTenantConfig } from '../config/tenant';
import { getReport } from 'tools/report';

// md5 加密
export function loopCrypto(str: string, time: number) {
  const salt = '_kucoin_';
  const c = md5(`${salt}${str}${salt}`).toString();
  if (time <= 0) {
    return c;
  }
  return loopCrypto(c, time - 1);
}

export function getUtm() {
  const utm = queryPersistence.getPersistenceQuery(QueryPersistence.UTM_GROUP as unknown as string[]);
  return QueryPersistence.transformObjWithMap(utm, QueryPersistence.UtmRcodeMap);
}

export const sentryReport = (opt: Sentry.Event) => {
  try {
    Sentry.captureEvent?.(opt);
  } catch (e) {
    console.log(e);
  }
};

export const reportPasswordError = (value: string, module: string) => {
  try {
    if (!value.trim()) {
      sentryReport({
        level: 'error',
        message: `${module} password empty`,
        tags: {
          errorType: `${module}_input_error`,
        },
      });
    }

    if (toLower(value) === 'undefined') {
      sentryReport({
        level: 'error',
        message: `${module} password undefined`,
        tags: {
          errorType: `${module}_input_error`,
        },
      });
    }

    if (toLower(value) === 'null') {
      sentryReport({
        level: 'error',
        message: `${module} password null`,
        tags: {
          errorType: `${module}_input_error`,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const resolveCountryCode = (code: string) => {
  return (code || '').replace(/_.*$/g, '');
};

export const removeSpaceSE = (str?: string) => {
  return (str || '').replace(/(^\s*)|(\s*$)/g, '');
};

// 常用正则
export const REGEXP = {
  pwd: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\S]{10,32}$/, // 至少包含大小写字母跟数字，不支持空格
  email:
    /(?:[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/, // eslint-disable-line
  phone: /^\d{5,13}$/, // 5-13位的纯数字
};

// 检测账号类型（邮箱/手机号/未知）
export const checkAccountType = (value: string, type?: 'phone' | 'email') => {
  if (value) {
    value = value.trim();
    if (type === 'phone') {
      if (REGEXP.phone.test(value)) return 'phone';
    } else if (type === 'email') {
      if (REGEXP.email.test(value)) return 'email';
    } else {
      if (REGEXP.phone.test(value)) return 'phone';
      if (REGEXP.email.test(value)) return 'email';
    }
  }
  return undefined;
};

// 注册密码要求项
export const REGEXP_PWD_GROUP = {
  length: /^.{10,32}$/,
  str: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/,
  space: /^\S*$/,
};

// zendesk 登录处理
export const getJWTPath = (platform: string, jwt: string, returnTo?: string) => {
  if (platform === 'zendesk') {
    let zendesk = `https://kucoin.zendesk.com/access/jwt?jwt=${jwt}`;
    if (returnTo) {
      zendesk = `${zendesk}&return_to=${returnTo}`;
    }
    return zendesk;
  }

  return '';
};

// 获取query参数，兼容hash路由
export function parseQuery() {
  if (typeof window !== 'undefined') {
    const { href } = window.location;
    if (href.indexOf('?') === -1) {
      return {};
    }

    const queryString = href.split('?')[1] || '';

    return qs.parse(queryString);
  }
  return {};
}

/**
 * 大数据埋点
 */
export const ga = async (key: string) => {
  if (!key) return;
  const Report = await getReport();
   Report?.logAction(key, 'click');
};

export const isForbiddenCountry = (
  code?: string,
  field: keyof ReturnType<ReturnType<typeof getTenantConfig>['common']['forbiddenCountriesForUse']>[0] = 'mobileCode'
) => {
  return find(getTenantConfig().common.forbiddenCountriesForUse(), forbiddenItem => {
    return forbiddenItem[field] === code;
  });
};

/**
 * 登录/注册时或者页面来源，从哪个界面触发的登录/注册（便于统计流量）
 * 取值优先级如下
 *    组件传入的source -> url上面的source参数 -> 当前界面的page_id - 默认mainSet主站
 *    其中url带的source是其他二级域名跳转主站登录的情况 格式如下 /signin?spm=kcWeb.B2RewardsHub.CDiversion.1
 *
 * @param {*} config trackingConfig组件调用方传过来的source
 * @returns
 */
export const getTrackingSource = (config: { source?: string } = {}) => {
  const { source } = config || {};
  const sdkPageID = sensors?.spm?.getPageId();
  const urlSource = getUrlSource();
  return urlSource || source || sdkPageID || DEFAULT_TRACK_SRC;
};

const getUrlSource = () => {
  const { spm } = parseQuery();
  if (typeof spm === 'string' && spm && size(spm) > 0 && includes(spm, '.')) {
    const spmList: string[] = split(spm, '.');
    return spmList[1];
  }
};

// 用于获取神策匿名ID
export const getAnonymousID = () => {
  let id = '';
  remoteEvent.emit(remoteEvent.evts.GET_SENSORS, sensors => {
    id = sensors.getAnonymousID();
  });
  return id;
};

export const sensorsLogin = (uid: string, userLevel: string) => {
  remoteEvent.emit(remoteEvent.evts.GET_SENSORS, sensors => {
    sensors.login(uid, userLevel);
  });
};

/**
 * 从其他工程移植过来
 * @description 获取queryString字符串转换为JSON对象
 * @param {String} search 可选参数 无是自动获取浏览器后面的queryString
 * @returns {Object}
 * runtime: next/browser
 */
export function searchToJson(search?: string) {
  if (!search && typeof window !== 'undefined') {
    search = window.location.search.slice(1);
  }
  const temp = {};
  if (search) {
    try {
      const arr = search.split('&');
      Object.keys(arr).forEach(key => {
        if (Object.prototype.hasOwnProperty.call(arr, key)) {
          const str = arr[key];
          const at = str.indexOf('=');
          const k = str.substring(0, at);
          const v = decodeURIComponent(decodeURI(str.substring(at + 1)));
          temp[k] = v;
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  return temp;
}

// 判断登录是否需要邮件授权
export const checkIsNeedMailAuthorize = ({ riskTag }: { riskTag?: string }) => riskTag === 'LOGIN_RISK_EMAIL_VERIFY';

export const removeLangQuery = (url = '') => {
  if (!url) {
    return url;
  }
  const langIndex = url.indexOf('lang=');
  if (langIndex !== -1) {
    const query = url.substr(url.indexOf('?') + 1);
    const queryArr = query.split('&') || [];
    if (queryArr && queryArr.length === 1) {
      if (queryArr[0].indexOf('lang=') === 0) {
        return url.substr(0, url.indexOf('?'));
      }
      return url;
    }
    let langQueryLen = 0;
    queryArr.forEach(item => {
      if (item?.indexOf('lang=') === 0) {
        langQueryLen = item.length;
      }
    });
    // 有多个参数
    if (url[langIndex - 1] === '?') {
      return `${url.substr(0, url.indexOf('?') + 1)}${url.slice(url.indexOf('&') + 1)}`;
    }
    const delIndex = url.indexOf('&lang=');
    return `${url.substr(0, delIndex)}${url.substr(delIndex + langQueryLen + 1, url.length)}`;
  }
  return url;
};

export const getMobileCode = val => {
  if (
    !val ||
    getTenantConfig()
      .common.forbiddenCountriesForUse()
      .find(i => i.mobileCode === val)
  ) {
    return '0';
  }
  return val;
};

export const emailHide = email => {
  if (!email) {
    return '***';
  }
  const splitted = email.split('@');
  let email1 = splitted[0];
  const avg = email1.length / 2;
  email1 = email1.substring(0, email1.length - avg);
  if (!splitted[1]) {
    return '***';
  }
  const email2 = splitted[1];
  const splitted2 = email2.split('.');
  const suffix = splitted2[1];
  return `${email1}**@**.${suffix}`;
};

export interface NoSSGProps {
  children: React.ReactNode;
  byPass?: boolean;
  fallback?: React.ReactNode;
}
// SSG 环境不渲染
export const NoSSG = (props: NoSSGProps) => {
  const { children, byPass, fallback = null } = props;
  if (IS_SSG_ENV && !byPass) {
    return fallback;
  }
  return children;
};

// session存在rcode，同步保存在localStorage, 默认有效期 15天
export const syncRCodeWithLocal = (rcode, ttl = MAX_RCODE_EXPIRE) => {
  if (!rcode) return;
  storage.setItemWithExpire(LOCAL_RCODE_KEY, rcode, ttl);
};

export const getRCodeWithLocal = () => {
  return storage.getItemWithExpire(LOCAL_RCODE_KEY);
};

// 允许同步rcode的url
const allowRCodesUrls = ['/ucenter/signup'];

const checkSync = () => {
  return some(allowRCodesUrls, url => {
    return window ? window.location.pathname?.includes(url) : false;
  });
};
/**
 * rcode localStorage/sessionStorage 之间互相同步
 */
export const syncRCode = () => {
  if (!checkSync()) return;
  const sessionCode = queryPersistence.getPersistenceQuery('rcode');
  const localCode = getRCodeWithLocal();
  if (!sessionCode && !localCode) return;
  // 优先使用sessionCode，保持原有逻辑
  if (sessionCode) {
    if (sessionCode !== localCode) syncRCodeWithLocal(sessionCode);
  } else {
    const allData = queryPersistence.getPersistenceQuery() || {};
    allData.rcode = localCode;
    queryPersistence.setPersistenceQuery(allData);
  }
};

/**
 ** @param {Array} validationList
 * 解构后端返回的验证结果，list存在代表验证不通过，需要弹出toast，没有达到上限的情况下，弹出对应项的错误，达到上限的情况下，弹出后端给的msg
 * validationList:[{"validationType":string,"checkResult":"EXPIRED"|"MISMATCHING"｜"ATTEMPT_LIMIT","maxFaildCount":number,"failedCount":number}]
 */
interface IValidation {
  validationType: 'my_sms' | 'my_email' | 'google_2fa';
  checkResult: 'EXPIRED' | 'MISMATCHING' | 'ATTEMPT_LIMIT';
  maxFaildCount: number;
  failedCount: number;
}
export const getValidateResult = (validationList: IValidation[]) => {
  const validateKeyToNameMap: { [key in IValidation['validationType']]: string } = {
    my_sms: '38b2a7b980124000a04a',
    my_email: '5e072c122d574000a8ba',
    google_2fa: 'mBDd5m2KVc4w4zJVn66tU2',
  };
  let hasMaxLimit = false;
  const errorToastKeyList: string[] = [];
  for (let i = 0; i < validationList.length; i++) {
    const item = validationList[i];
    errorToastKeyList.push(validateKeyToNameMap[item.validationType]);
    if (item.checkResult === 'ATTEMPT_LIMIT') {
      // 如果有一个验证类型达到上限，就此标志设置为true，外层会根据此标志弹出对应toast
      hasMaxLimit = true;
    }
  }
  return {
    hasMaxLimit,
    errorToastKeyList,
  };
};

/**
 * 手机号脱敏处理，用于展示
 */
export function formatPhoneNumber(phone: string = '') {
  // 如果有 *，则表示已经脱敏过
  if (phone.includes('*')) {
    return phone;
  }
  // 如果号码不足3位，直接返回 "****" + 所有数字
  if (phone.length < 3) {
    return `****${phone}`;
  }
  // 仅展示 ****和最后三位
  return `****${phone.slice(-3)}`;
}

/**
 * 邮箱脱敏处理，用于展示
 */
export function formatEmail(email: string = '') {
  const [localPart, domain] = email.split('@');
  if (!domain || !localPart) {
    return '';
  }
    // 如果有 *，则表示已经脱敏过
  if (email.includes('***')) {
    return email;
  }
  
  const maskedLocalPart = localPart.length > 2 ? `${localPart.slice(0, 3)}***` : `${localPart}***`;
  return `${maskedLocalPart}@${domain}`;
}

/**
 * 从剪贴板粘贴内容
 */
export async function pasteFromClipboard() {
  if (navigator.clipboard && navigator.clipboard.readText) {
    try {
      const text = await navigator.clipboard.readText();
      return text;
    } catch (err) {
      console.error(err);
    }
  } else {
    console.error('unsupport clipboard API');
  }
}

// 是否满足基本密码要求
export const matchPasswordCheck = (str: string) => {
  // 满足所有项
  return Object.values(REGEXP_PWD_GROUP).every(reg => reg.test(str));
};

// 定义用户类型
export interface IUserFlag {
  nickname?: string;
  email?: string;
  phone?: string;
  subAccount?: string;
}

// 获取用户表示标示：昵称>邮箱>手机，从用户已有的里面选优先级最高的那个，取前两个字符展示
export const getUserFlag = (user: IUserFlag, isSub: boolean = false): string => {
  const { nickname = '', email = '', phone = '', subAccount = '' } = user || {};
  let userFlag = '';
  try {
    if (nickname) {
      const nicknameStr = `${nickname}`;
      userFlag += nicknameStr[0];
      if (nicknameStr[1] && nicknameStr[0].charCodeAt(0) <= 255 && nicknameStr[1].charCodeAt(0) <= 255) {
        userFlag += nicknameStr[1];
      }
    } else if (isSub) {
      userFlag = subAccount.substring(0, 2) || '';
    } else if (email) {
      userFlag += email.substring(0, 2);
    } else if (phone) {
      userFlag += phone.substring(phone.length - 2);
    }
  } catch (e) {
    console.log(e);
  }
  return userFlag.toUpperCase();
};

export const getUserNickname = (inviteInfo: { nickname?: string; email?: string; phone?: string }) => {
  const { nickname, email, phone } = inviteInfo;
  return nickname || email || phone || '--';
};

const defaultOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hourCycle: 'h23',
} as const;

interface DateTimeFormatParams {
  children: Date | number | string;
  options?: Intl.DateTimeFormatOptions;
  hideTime?: boolean;
  currentLang?: string;
}

export function dateTimeFormat({
  children,
  options = {},
  hideTime = false,
  currentLang,
}: DateTimeFormatParams): string {
  const _lang = (currentLang || bootConfig._DEFAULT_LANG_).replace('_', '-');
  const dateTimeFormat = new Intl.DateTimeFormat(_lang, {
    ...defaultOptions,
    // 不展示时分秒
    ...(hideTime ? { hour: undefined, minute: undefined, second: undefined } : {}),
    ...options,
  });
  return dateTimeFormat.format(children as any);
}

/**
 * 高精度指定位数
 * @param v
 * @param decimal
 * @param round
 * @returns {*}
 */
export const numberFixed = (
  v: number | string,
  decimal: number,
  round: BigNumber.RoundingMode = Big.ROUND_DOWN
): string => {
  const numberV = +v;
  if (typeof numberV !== 'number' || v === undefined) {
    return v as any;
  }
  if (numberV === 0) {
    return '0';
  }
  const stringV = v.toString(); // 防止数值超过最大范围，导致转换不准确
  return new Big(stringV).toFixed(decimal, round);
};

const MIN_CONVERT_NUM = 10000;
/**
 * 将num转成 1K 10K 1M的字符串， 10000以下不显示
 * @param {*} num
 * @param {*} digits
 * @returns
 */
export function nFormatter(
  num: number | string,
  digits: number = 2,
  { minCoverNum = MIN_CONVERT_NUM }: { minCoverNum?: number } = {}
): string {
  num = +num; // 将可能的字符串转为number
  if (Math.abs(num) < minCoverNum) return `${numberFixed(num, digits)}`;
  const si = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
    { value: 1e12, symbol: 'T' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i: number;
  for (i = si.length - 1; i > 0; i--) {
    if (Math.abs(num) >= si[i].value) {
      break;
    }
  }
  const fixedNum = `${numberFixed(num / si[i].value, digits)}`;
  const fixedNumWithSymbol = fixedNum.replace(rx, '$1') + si[i].symbol;
  return fixedNumWithSymbol;
}

/**
 * 获取当前设备是否为安卓终端设备
 * @returns bool
 */
export const getIsAndroid = (): boolean => {
  const u = navigator.userAgent;
  if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
    return true;
  }
  return false;
};

/**
 * 增加千分位分隔符
 * @param n
 * @returns {string}
 */
interface ISeparateNumberPool {
  pool: Record<string, string>;
  poolCount: number;
  has: (k: string) => boolean;
  get: (k: string) => string | undefined;
  set: (k: string, v: string) => void;
}

export const SeparateNumberPool: ISeparateNumberPool = {
  pool: Object.create(null),
  poolCount: 0,
  has(k: string) {
    return !!this.pool[k];
  },
  get(k: string) {
    return this.pool[k];
  },
  set(k: string, v: string) {
    if (this.poolCount > 100000) {
      // 清理缓存
      this.poolCount = 0;
      this.pool = Object.create(null);
    }
    if (!this.has(k)) {
      this.poolCount += 1;
    }
    this.pool[k] = v;
  },
};

export const separateNumber = (n: number | string): string => {
  if (typeof +n !== 'number') {
    return n as string;
  }
  const num = `${n}`;

  if (SeparateNumberPool.has(num)) {
    return SeparateNumberPool.get(num)!;
  }
  if (!/^[0-9.]+$/.test(num)) {
    return n as string;
  }

  let integer = num;
  let floater = '';
  if (num.indexOf('.') > -1) {
    const arr = num.split('.');
    [integer, floater] = arr;
  }
  const len = integer.length;
  let parser = '';
  if (len > 3) {
    let count = 0;
    for (let i = len - 1; i >= 0; i -= 1) {
      parser = integer[i] + parser;
      count += 1;
      if (count % 3 === 0 && i > 0) {
        parser = `,${parser}`;
      }
    }
  } else {
    parser = integer;
  }
  if (floater !== '') {
    floater = `.${floater}`;
  }
  const r = `${parser}${floater}`;
  SeparateNumberPool.set(num, r);

  return r;
};

export function transformParam(a: any): any {
  // 输入值为undefined或者null处理为0
  if (a == null || a === '') {
    a = new Big(0);
  }
  if (!Big.isBigNumber(a)) {
    const isNaNB = Number.isNaN(toNumber(a));
    a = new Big(isNaNB ? NaN : a);
  }
  return a;
}

// 比较函数
export function comparedTo(x: any, y: any): number | undefined {
  try {
    x = Big.isBigNumber(x) ? x : new Big(x);
    y = Big.isBigNumber(y) ? y : new Big(y);
    return x.comparedTo(y);
  } catch (e) {
    return undefined;
  }
}

export const toFixed = (a: any, b?: number, mode: number = Big.ROUND_HALF_UP): string => {
  a = transformParam(a);
  if (b == null) {
    return a.toFixed();
  }
  return a.toFixed(b, mode);
};

/**
 * 高精度除法并取给定位数四舍五入
 * @param a
 * @param b
 * @param decimal
 * @param round
 * @returns {string|*}
 */
export const divide = (a: any, b: any, decimal: number = 8, round: number = Big.ROUND_HALF_UP): string | number => {
  if (!a || !b) {
    return 0;
  }
  a = transformParam(a);
  b = transformParam(b);
  if (comparedTo(b, 0) === 0) {
    // 如果分母为0按0返回
    return toFixed(new Big(0), decimal, round);
  }
  return toFixed(a.dividedBy(b), decimal, round);
};

/**
 * @decription 高精度加法
 */
export const add = (a: any, b: any): any => {
  a = transformParam(a);
  b = transformParam(b);
  return a.plus(b);
};

export function multiply(x: any, y: any, dp?: number): any {
  x = transformParam(x);
  return x.multipliedBy(y).toFixed(dp);
}

export const compose = (spm: string[] = []) => {
  let spmId = '';
  if (spm) {
    const siteId = sensors?.spm?.getSiteId();
    const pageId = sensors?.spm?.getPageId();
    if (siteId && pageId) {
      spmId = sensors?.spm?.compose(spm);
    }
  }
  return spmId;
};

// 向url添加参数
const updateQueryStringParameter = (uri, key, value) => {
  if (!uri || !value) {
    return uri;
  }
  const reg = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
  const separator = indexOf(uri, '?') > -1 ? '&' : '?';
  if (uri.match(reg)) {
    return uri.replace(reg, `$1${key}=${value}$2`);
  }

  return `${uri}${separator}${key}=${value}`;
};

// 向query参数中添加spm
export const addSpmIntoQuery = (url, spms, currentLang) => {
  const spm = compose(spms);
  const href = currentLang ? addLangToPath(url) : url; // 增加语言子路径
  if (!spm) return href;
  return updateQueryStringParameter(href, 'spm', spm);
};

// saveSpmQueryParam2SessionStorage
export const saveSpm2Storage = (url, spm) => {
  remoteEvent.emit(remoteEvent.evts.GET_SENSORS, sensors => {
    if (sensors.spmStorage && window) {
      let _href = url;
      if (_href.startsWith('/')) {
        _href = `${window.location.origin}${_href}`;
      }
      _href = addLangToPath(_href);
      sensors.spmStorage.saveSpm2SessionStorage(_href, spm);
    }
  });
};

export const composeSpmAndSave = (url, spms) => {
  if (!spms) return;
  const spm = compose(spms);
  if (!spm) return;
  saveSpm2Storage(url, spm);
};

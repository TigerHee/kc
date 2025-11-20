import { IS_CLIENT } from "@/config/env";
import Decimal from "decimal.js";

// 判断是否是IOS
export const isIOS = () => {
  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    return true;
  }
  return false;
};

export const runInApp = () => {
  return IS_CLIENT && window.navigator.userAgent.indexOf("KuCoin") > -1;
};

/**
 * 处理路径连接
 */
export const concatPath = (base, path) => {
  const hasSlashes = path.indexOf("/") === 0;
  return `${base}${hasSlashes ? "" : "/"}${path}`;
};

export const generateUuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;

    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const getFullUrl = (req) => {
  // 优先使用代理传递的头部信息
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  
  // 处理多个协议值的情况（如 "https,http"）
  const cleanProtocol = protocol.includes(',') 
    ? protocol.split(',')[0] 
    : protocol;
  
  return `${cleanProtocol}://${host}${req.url}`;
};

export const getRequestOriginInfo = (req) => {
  const getHeader = (key, fallback = "") => {
    const val = req.headers[key];
    if (!val) return fallback;
    return (Array.isArray(val) ? val[0] : val).split(",")[0].trim();
  };

  const protocol = getHeader("x-forwarded-proto", "http");
  const host = getHeader("x-forwarded-host") || getHeader("host");
  const userAgent = getHeader("user-agent", "");

  const path = req.url || "";
  return {
    origin: `${protocol}://${host}`,
    proto: protocol,
    host,
    path,
    userAgent,
  };
};


// convert json to url params
export const jsonToUrlParams = (json) => {
  return Object.keys(json)
    .map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key] || '');
    })
    .join('&');
};

/**
 * @decription 小数转百分比
 */
export const toPercent = (a: number, sign = '%') => {
  return `${new Decimal(a).mul(100).toFixed()}${sign}`;
};


// 通过步长获取精度 num >= 1 时， num<1，（仅限 0.0000...x 这种格式，如 0.01， 0.0005， 0.0000007等）
export const transStepToPrecision = (num: number) => {
  if (num > 1) {
    return 0;
  }
  const decimal = `${num}`.split('.')[1];
  return decimal ? decimal.length : 0;
};

/**
 * 永续合约名称统一改造
 * @param options 
 * @returns 
 */
export const getPerpFutureName = (options: { symbol: string; currency: string, tI18n: (key: string, options?: any) => string }) => {
  const { symbol, currency, tI18n } = options;

  if (!symbol || !currency) return '';

  const displaySymbol = symbol === 'XBT' ? 'BTC' : symbol;
  return tI18n('perpetual.contract', { futurePair: `${displaySymbol}${currency}` });
}
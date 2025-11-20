export const IS_DEV = process.env.NODE_ENV !== 'production';
export const IS_PROD = process.env.NODE_ENV === 'production';
export const IS_SPA_MODE = true;
export const IS_SSR_MODE = false;
export const IS_CLIENT_ENV = true;
export const IS_SERVER_ENV = false;
export const IS_SSG_ENV = navigator.userAgent.indexOf("SSG_ENV") > -1;
export const IS_MOBILE_SSG_ENV = navigator.userAgent.indexOf('SSG_MOBILE_ENV') > -1;
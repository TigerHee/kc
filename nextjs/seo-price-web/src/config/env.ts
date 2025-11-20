/**
 * Owner: victor.ren@kupotech.com
 */
const host =
  typeof window !== "undefined" ? window.location.host : "www.kucoin.com";
const isDev = process.env.NODE_ENV === "development";

export const IS_TEST_ENV = host.includes("kucoin.net");

export const _DEV_ = isDev;
export const IS_PROD =
  !isDev && !IS_TEST_ENV && process.env.NODE_ENV === "production";

export const IS_SPA = Boolean(process.env.NEXT_PUBLIC_SPA);
export const IS_SSR = !IS_SPA;
export const IS_CLIENT = typeof window !== "undefined";
export const IS_SERVER = !IS_CLIENT;


export const IS_PROD_ENV = !_DEV_ && IS_CLIENT && !window.location.host.includes('.net');

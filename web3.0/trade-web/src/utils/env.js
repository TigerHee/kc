/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-11-14 15:01:27
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-12-21 22:01:04
 * @FilePath: /trade-web/src/utils/env.js
 * @Description:  产物一致性，现在不能通过 sit 判断测试环境，所以用判断域名的方式判断测试环境
 */
const host = window ? window.location.host : 'www.kucoin.com';
const isDev = process.env.NODE_ENV === 'development';
export const _IS_TEST_ENV_ = host.includes('kucoin.net');
export const _DEV_ = isDev;
export const IS_PROD =
  !isDev && !_IS_TEST_ENV_ && process.env.NODE_ENV === 'production';

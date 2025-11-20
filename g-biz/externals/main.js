/**
 * Owner: iron@kupotech.com
 */
// 公共模块 bundle 入口， 为业务项目提供公共业务模块
import { setCsrf } from '@tools/csrf';
import { LocaleProvider } from '@tools/i18n';
import * as _404 from './packages/404';
import * as entrance from './packages/entrance';
import * as header from './packages/header';
import * as share from './packages/share';
import * as footer from './packages/footer';
import * as im from './packages/im';
import * as kyc from './packages/kyc';
import gps from './packages/user-gps';
import * as security from './packages/security';
import * as verification from './packages/verification';
import * as utmLink from './packages/utm-link';
import * as downloadBanner from './packages/download';
import * as seo from './packages/seo';
import * as captcha from './packages/captcha';
import * as userRestricted from './packages/userRestricted';
import * as notice from './packages/notice-center';
import * as dialogCenter from './packages/dialogCenter';
import * as transfer from './packages/transfer';
import * as compliance from './packages/compliance';

export default {
  packages: {
    entrance,
    header,
    footer,
    im,
    kyc,
    gps,
    '404': _404,
    security,
    verification,
    utmLink,
    downloadBanner,
    seo,
    share,
    captcha,
    userRestricted,
    notice,
    dialogCenter,
    transfer,
    compliance,
  },
  helpers: {
    setCsrf,
  },
  LocaleProvider,
};

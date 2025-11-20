/**
 * Owner: vijay.zhou@kupotech.com
 */
import { _t } from 'src/tools/i18n';
export { LEVEL_COPY_TEXT_ENUMS, LEVEL_ENUMS } from 'src/constants/security/score';

export const METHOD_ENUMS = {
  PASSKEY: 'PK',
  EMAIL: 'EMV',
  PHONE: 'SMS',
  G2FA: 'GAV',
  SAFE_WORD: 'MAIL_WORD',
};

export const METHOD_INFOS = {
  [METHOD_ENUMS.PASSKEY]: {
    name: () => _t('securityGuard.suggest.passkey'),
    desc: () => _t('securityGuard.suggest.passkey.desc'),
    checkDeviceSupport: true,
    noSupportedTitle: () => _t('securityGuard.suggest.unableBindItem'),
    noSupportedDesc: () => _t('securityGuard.suggest.unableBindItem.desc'),
    webUrl: '/account/security/passkey',
    appUrl: '/user/passkeyManager',
  },
  [METHOD_ENUMS.EMAIL]: {
    name: () => _t('securityGuard.suggest.email'),
    desc: () => _t('securityGuard.suggest.emailAndPhoneAndG2fa.desc'),
    checkDeviceSupport: false,
    webUrl: '/account/security/email',
    appUrl: '/user/safe/check?type=BIND_EMAIL',
  },
  [METHOD_ENUMS.PHONE]: {
    name: () => _t('securityGuard.suggest.phone'),
    desc: () => _t('securityGuard.suggest.emailAndPhoneAndG2fa.desc'),
    checkDeviceSupport: false,
    webUrl: '/account/security/phone',
    appUrl: '/user/safe/check?type=BIND_PHONE',
  },
  [METHOD_ENUMS.G2FA]: {
    name: () => _t('securityGuard.suggest.g2fa'),
    desc: () => _t('securityGuard.suggest.emailAndPhoneAndG2fa.desc'),
    checkDeviceSupport: false,
    webUrl: '/account/security/g2fa',
    appUrl: '/user/safe/check?type=BIND_GOOGLE_2FA',
  },
  [METHOD_ENUMS.SAFE_WORD]: {
    name: () => _t('securityGuard.suggest.antiPhishingCode'),
    desc: () => _t('securityGuard.suggest.antiPhishingCode.desc'),
    checkDeviceSupport: false,
    webUrl: '/account/security/safeWord',
    appUrl: '/safe/fishCode',
  },
};

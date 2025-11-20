/**
 * Owner: iron@kupotech.com
 */
import withI18nReady from '@hooks/withI18nReady';
import {
  SecurityHome as OriSecurityHome,
  UpdatePwd as OriUpdatePwd,
  G2fa as OriG2fa,
  SecurityVerify as OriSecurityVerify,
  SetTradePwdDrawer as OriSetTradePwdDrawer,
  SetTradePwd as OriSetTradePwd,
} from '@packages/security/src/componentsBundle';

export const SecurityHome = withI18nReady(OriSecurityHome, 'security');
export const UpdatePwd = withI18nReady(OriUpdatePwd, 'security');
export const G2fa = withI18nReady(OriG2fa, 'security');
export const SecurityVerify = withI18nReady(OriSecurityVerify, 'security');
export const SetTradePwdDrawer = withI18nReady(OriSetTradePwdDrawer, 'security');
export const SetTradePwd = withI18nReady(OriSetTradePwd, 'security');

export { withVerify, useVerify } from '@packages/security/src/index';
export { default as getSecurityVerify } from '@packages/security/src/SecurityVerify/securityVerify';

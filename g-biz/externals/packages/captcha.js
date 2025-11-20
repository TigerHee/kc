/**
 * Owner: tiger@kupotech.com
 */
import withI18nReady from '@hooks/withI18nReady';
import { Captcha as OriCaptcha } from '@packages/captcha';

export const Captcha = withI18nReady(OriCaptcha, 'captcha');

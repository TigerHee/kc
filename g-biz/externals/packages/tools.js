/**
 * Owner: iron@kupotech.com
 */
import { setCsrf } from '@tools/csrf';
import { LocaleProvider } from '@tools/i18n';
import remoteEvent from '@tools/remoteEvent';
import addLangToPath from '@tools/addLangToPath';
import { getTermId, getTermUrl } from '@tools/term';

export default {
  setCsrf,
  remoteEvent,
  LocaleProvider,
  addLangToPath,
  getTermId,
  getTermUrl,
};

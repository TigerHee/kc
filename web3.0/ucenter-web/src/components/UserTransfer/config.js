/**
 * Owner: tiger@kupotech.com
 */
import { addLangToPath } from 'tools/i18n';
import siteConfig from 'utils/siteConfig';
const { KUCOIN_HOST } = siteConfig;

export const supportUrl = addLangToPath(`${KUCOIN_HOST}/support`);

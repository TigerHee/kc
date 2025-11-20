/**
 * Owner: tiger@kupotech.com
 */
import { addLangToPath } from 'tools/i18n';
import { getSiteConfig } from 'kc-next/boot';

export const getSupportUrl = () => {
  const siteConfig = getSiteConfig();
  return addLangToPath(`${siteConfig.KUCOIN_HOST}/support`);
};

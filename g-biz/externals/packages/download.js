/**
 * Owner: iron@kupotech.com
 */
import withI18nReady from '@hooks/withI18nReady';

import { DownloadBanner as OriDownloadBanner } from '@packages/downloadBanner';

export const DownloadBanner = withI18nReady(OriDownloadBanner, 'downloadBanner');

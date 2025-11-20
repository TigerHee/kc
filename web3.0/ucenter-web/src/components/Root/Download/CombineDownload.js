/**
 * Owner: willen@kupotech.com
 */

import { DownloadBanner } from '@kucoin-biz/download';
import { getPageId } from 'utils/ga';
import Download from './index';

export const DynamicDownloadBanner = DownloadBanner;

export default ({ pathname, downloadAppUrlMap = {} }) => {
  return (
    <Download pathname={pathname} pageId={getPageId()} downloadAppUrl={downloadAppUrlMap.Modal} />
  );
};

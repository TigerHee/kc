/**
 * Owner: iron@corp.kucoin.com
 * 整合 h5 DownloadBanner DownloadGuide DownloadModal 组件
 * 针对组件进行懒加载
 */
import loadable from '@loadable/component';
import { getPageId } from 'utils/ga';
import Download from './index';

export const DynamicDownloadBanner = loadable(() => System.import('@kucoin-biz/download'), {
  resolveComponent: (module) => {
    return module.DownloadBanner;
  },
});

export default ({ pathname, traded, currentLang, downloadAppUrlMap = {} }) => {
  return (
    <>
      {/* 在App交易更安全更快捷 半弹窗 */}
      {/* <DownloadGuide downloadAppUrl={downloadAppUrlMap.Guide} /> */}
      {/* 底部下载banner */}
      {/* <DynamicDownloadBanner
        pathname={pathname}
        traded={traded}
        downloadAppUrl={downloadAppUrlMap.Banner}
      /> */}
      {/* modal弹窗下载 */}
      <Download
        pathname={pathname}
        currentLang={currentLang}
        pageId={getPageId()}
        downloadAppUrl={downloadAppUrlMap.Modal}
      />
    </>
  );
};

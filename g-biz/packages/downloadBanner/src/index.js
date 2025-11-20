/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { useMediaQuery, ThemeProvider } from '@kufox/mui';
import { checkIsInApp } from './helper';
import DownloadBanner from './DownloadBanner';

const NormalDownloadBar = ({
  downloadAppUrl,
  pathname,
  traded,
  currentLang,
  onlyShowInH5MainSiteHome = true,
} = {}) => {
  const isInApp = checkIsInApp() || false;
  const isH5 = useMediaQuery((theme) => theme.breakpoints.down('md'));
  /** isHideByPathname
   * 通过 onlyShowInH5MainSiteHome 字段判定下载模块是否只在h5主站首页展示
   * 传递true时，判断pathname不为'/'时隐藏；
   * 传递false时，就不需要判断pathname了。
   */
  const isHideByPathname = onlyShowInH5MainSiteHome ? pathname !== '/' : false;
  if (
    !isH5 ||
    traded ||
    isInApp ||
    // _.find(noneBannerPage, (i) => _.startsWith(pathname, i)) || // 不展示banner的page list
    isHideByPathname
  )
    return null;

  return (
    <DownloadBanner pathname={pathname} downloadAppUrl={downloadAppUrl} currentLang={currentLang} />
  );
};

export default (props) => {
  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <NormalDownloadBar {...props} />
    </ThemeProvider>
  );
};

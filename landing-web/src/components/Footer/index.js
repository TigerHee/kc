/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { useIsMobile } from 'components/Responsive';
// import pathToRegexp from 'path-to-regexp';
import { checkPathname } from 'helper';
import KCFooter from './KCFooter';
import styles from './style.less';

// function matchUrl(url, urls) {
//   return _.some(urls, item => {
//     const pathMatch = pathToRegexp(item);
//     if (pathMatch.exec(url)) {
//       return true;
//     }
//     return true;
//   });
// }

/**
 * @deprecated 此Footer不公用，每个land自己管理Footer，公用可以使用KCFooter
 */
export default () => {
  const isMobile = useIsMobile();
  // const pathname = window.location.pathname;

  if (isMobile) {
    return (
      <div className={styles.mbFoot}>
        <div>
          CopyRight © 2017 - {new Date().getFullYear()} KuCoin.com. All Rights Reserved.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.foot}>
      <KCFooter />
    </div>
  );
}

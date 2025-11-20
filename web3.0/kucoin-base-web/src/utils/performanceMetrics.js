import { allMetricsInit } from '@kc/performance-metric';
import isMobile from './isMobile';
// import history from '@kucoin-base/history';
// 开启性能监控的路径正则
// const enablePaths = [/\/kcs$/, /\/affiliate$/, /\/margin\/v2\/lend$/, /\/account.*$/];

export const initMetrics = (sensors, kunlun) => {
  allMetricsInit(sensors, kunlun, isMobile());

  // let path;
  // history.listen((location) => {
  //   try {
  //     if (path !== location.pathname) {
  //       path = location.pathname;
  //       const needInit = enablePaths.some((reg) => reg.test(path));
  //       if (needInit) {
  //         allMetricsInit(sensors);
  //       } else {
  //         stopMetrics();
  //       }
  //     }
  //   } catch (error) {
  //     console.error(`metrics change error! | path: ${path} | reason:`, error);
  //   }
  // });
};

import { IS_SERVER_ENV } from 'kc-next/env';
import { allMetricsInit } from '@kc/performance-metric';
import JsBridge from 'gbiz-next/bridge';
import { sensors } from './sensors';

export function initPerformanceMetric(kunlun) {
  if (IS_SERVER_ENV) return;
  // 启动性能监控
  const isApp = JsBridge.isApp();
  allMetricsInit(sensors, kunlun, isApp);
}

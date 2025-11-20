import { IS_SERVER_ENV } from 'kc-next/env';
import { allMetricsInit } from '@kc/performance-metric';
import { sensors } from './sensors';
import { kunlun } from './kunlun';
import JsBridge from 'gbiz-next/bridge';

export function initPerformanceMetric() {
  if (IS_SERVER_ENV) return;
  // 启动性能监控
  const isApp = JsBridge.isApp();
  allMetricsInit(sensors, kunlun, isApp);
}

import { IS_SERVER_ENV } from 'kc-next/env';
import { allMetricsInit } from '@kc/performance-metric';
import { sensors } from './sensors';
import * as kunlun from '@kc/web-kunlun';

export function initPerformanceMetric() {
  if (IS_SERVER_ENV) return;
  // 启动性能监控
  allMetricsInit(sensors, kunlun);
}

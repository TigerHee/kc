/**
 * 用户数据上报: 监控、告警、性能日志等相关的实现
 */
import { IS_CLIENT_ENV } from 'kc-next/env';
import { IAppModule } from '../types';
import { initSensors } from './sensors';
import { initReportModule } from './report';
import { initPerformanceMetric } from './performanceMetric';
import { initKunlun } from './kunlun';

export * from './sensors';
export * from './report';
export * from './extension';
export * from './sentry';

export const telemetryModule: IAppModule = {
  name: 'telemetry',
  init: () => {
    if (IS_CLIENT_ENV) {
      initSensors();
      initKunlun();
      // 性能上报依赖于神策的初始化
      initPerformanceMetric();
      initReportModule();
    }
  },
};

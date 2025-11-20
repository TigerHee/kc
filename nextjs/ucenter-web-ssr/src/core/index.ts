import { ModuleManager } from './ModuleManager';
import { telemetryModule } from './telemetryModule';
import { xgrayModule } from './xgrayModule';
import { queryPersistenceModule } from './queryPersistenceModule';
import { clientGlobalsModule } from './clientGlobalsModule';
import { fetchInterceptorModule } from './fetchInterceptorModule';
import { serviceWorkerModule } from './serviceWorkerModule';
import { jsBridgeModule } from './jsBridgeModule';

export const moduleManager = new ModuleManager();

// 按优先级初始化
export const enabledModules = [
  clientGlobalsModule,
  jsBridgeModule,
  telemetryModule,
  xgrayModule,
  queryPersistenceModule,
  fetchInterceptorModule,
  serviceWorkerModule,
];

enabledModules.forEach(module => moduleManager.register(module));

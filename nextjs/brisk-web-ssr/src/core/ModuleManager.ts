import { IAppModule, AppContext } from './types';

export class ModuleManager {
  private modules: IAppModule[] = [];

  register(module: IAppModule) {
    this.modules.push(module);
  }

  initAll(context?: AppContext) {
    this.modules.forEach((module) => module.init(context));
  }

  destroyAll() {
    this.modules.forEach((module) => module.destroy?.());
  }
}

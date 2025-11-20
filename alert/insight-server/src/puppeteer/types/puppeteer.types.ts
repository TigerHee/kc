import { Browser, PuppeteerLaunchOptions } from 'puppeteer';

export interface PuppeteerModuleOptions {
  launchOptions?: PuppeteerLaunchOptions;
  maxInstances?: number;
}

export interface PuppeteerInstance {
  instanceName: string;
  browser: Browser;
}

export interface ProjectRouteItem {
  projectName: string;
  accessibleLink: string;
}

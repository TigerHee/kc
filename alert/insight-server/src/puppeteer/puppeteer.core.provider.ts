import { launch, PuppeteerLaunchOptions } from 'puppeteer';
import { PuppeteerModuleOptions, PuppeteerInstance } from './types/puppeteer.types';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PuppeteerCore {
  private readonly pool: PuppeteerInstance[] = [];

  constructor(
    private readonly options: PuppeteerModuleOptions,
    private readonly configService: ConfigService,
  ) {
    //
  }

  async launch(instanceName: string, options?: PuppeteerLaunchOptions) {
    const args = ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors'];
    const isDevelopment = this.configService.get<string>('NODE_ENV') === 'development';
    // 如果是生产环境并且提供了代理 URL，添加代理配置
    if (!isDevelopment) {
      args.push(`--proxy-server=${this.configService.get<string>('MWG_URL')}`);
    }
    const defaultOptions = {
      ignoreHTTPSErrors: true,
      args,
      dumpio: isDevelopment,
    };
    if (!options) options = defaultOptions;

    const exists = this.pool.find((i) => i.instanceName === instanceName);
    if (exists) {
      throw new Error(`Puppeteer Instance with name ${instanceName} already exists`);
    }

    if (this.options.maxInstances && this.pool.length >= this.options.maxInstances) {
      throw new Error('Max instances reached');
    }
    const browser = await launch(options);

    const instance: PuppeteerInstance = { instanceName, browser };
    this.pool.push(instance);
    return instance;
  }

  async destroy(instance: PuppeteerInstance) {
    await instance.browser.close();
    this.pool.splice(this.pool.indexOf(instance), 1);
  }

  instanceOptions() {
    return this.options;
  }

  async instance(instanceName: string) {
    return this.pool.find((i) => i.instanceName === instanceName);
  }

  async totalInstances() {
    return this.pool.length;
  }

  async closeAll() {
    await Promise.all(this.pool.map((i) => i.browser.close()));
    this.pool.length = 0;
  }
}

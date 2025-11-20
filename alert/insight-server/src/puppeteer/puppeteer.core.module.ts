import { PuppeteerModuleOptions } from './types/puppeteer.types';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DynamicModule, Global } from '@nestjs/common';
import { PuppeteerCore } from './puppeteer.core.provider';

export const PUPPETEER_BROWSER_TOKEN = 'PUPPETEER_BROWSER_TOKEN';

@Global()
export class PuppeteerCoreModule {
  static register(puppeteerModuleOptions?: PuppeteerModuleOptions): DynamicModule {
    return {
      module: PuppeteerCoreModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: PUPPETEER_BROWSER_TOKEN,
          useFactory: (configService: ConfigService, options = puppeteerModuleOptions || {}) => {
            if (options.maxInstances === undefined || options.maxInstances <= 0) {
              options.maxInstances = 1;
            }
            return new PuppeteerCore(options, configService);
          }, // 显式注入
          inject: [ConfigService],
        },
      ],
      exports: [PUPPETEER_BROWSER_TOKEN],
    };
  }
}

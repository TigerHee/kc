import { DynamicModule, Global } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpsProxyAgent } from 'https-proxy-agent';

export const CONFLUENCE_HTTP_SERVICE_TOKEN = 'CONFLUENCE_HTTP_SERVICE_TOKEN';

@Global()
export class ConfluenceHttpModule {
  static register(): DynamicModule {
    return {
      module: ConfluenceHttpModule,
      imports: [
        HttpModule.registerAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            baseURL: configService.get<string>('CONFLUENCE_API_URL'),
            timeout: 1 * 60 * 1000,
            maxRedirects: 5,
            headers: {
              Host: 'k-devdoc.atlassian.net',
              'Content-Type': 'application/json',
              Authorization:
                'Basic ' +
                Buffer.from(
                  configService.get<string>('CONFLUENCE_USER') + ':' + configService.get<string>('CONFLUENCE_TOKEN'),
                ).toString('base64'),
            },
            httpsAgent:
              configService.get<string>('NODE_ENV') === 'development'
                ? undefined
                : new HttpsProxyAgent(configService.get<string>('MWG_URL')),
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [
        {
          provide: CONFLUENCE_HTTP_SERVICE_TOKEN,
          useExisting: HttpService,
        },
      ],
      exports: [CONFLUENCE_HTTP_SERVICE_TOKEN],
    };
  }
}

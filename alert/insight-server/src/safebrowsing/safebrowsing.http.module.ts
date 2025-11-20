import { DynamicModule, Global } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpsProxyAgent } from 'https-proxy-agent';

export const SAFE_BROWSING_SERVICE_TOKEN = 'SAFE_BROWSING_SERVICE_TOKEN';

@Global()
export class SafebrowsingHttpModule {
  static register(): DynamicModule {
    return {
      module: SafebrowsingHttpModule,
      imports: [
        HttpModule.registerAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => {
            return {
              baseURL: configService.get<string>('SAFEBROWSING_API_URL'),
              timeout: 1 * 60 * 1000,
              maxRedirects: 5,
              headers: {
                'Content-Type': 'application/json',
              },
              httpsAgent:
                configService.get<string>('NODE_ENV') === 'development'
                  ? undefined
                  : new HttpsProxyAgent(configService.get<string>('MWG_URL')),
            };
          },
          inject: [ConfigService],
        }),
      ],
      providers: [
        {
          provide: SAFE_BROWSING_SERVICE_TOKEN,
          useExisting: HttpService,
        },
      ],
      exports: [SAFE_BROWSING_SERVICE_TOKEN],
    };
  }
}

import { DynamicModule, Global } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpsProxyAgent } from 'https-proxy-agent';

export const VIRUSTOTAL_HTTP_SERVICE_TOKEN = 'VIRUSTOTAL_HTTP_SERVICE_TOKEN';

@Global()
export class VirustotalHttpModule {
  static register(): DynamicModule {
    return {
      module: VirustotalHttpModule,
      imports: [
        HttpModule.registerAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            baseURL: configService.get<string>('VIRUSTOTAL_API_URL'),
            timeout: 1 * 60 * 1000,
            maxRedirects: 5,
            headers: {
              'x-apikey': configService.get<string>('VIRUSTOTAL_API_KEY'),
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
          provide: VIRUSTOTAL_HTTP_SERVICE_TOKEN,
          useExisting: HttpService,
        },
      ],
      exports: [VIRUSTOTAL_HTTP_SERVICE_TOKEN],
    };
  }
}

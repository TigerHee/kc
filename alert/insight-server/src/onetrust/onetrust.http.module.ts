import { HttpModule, HttpService } from '@nestjs/axios';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpsProxyAgent } from 'https-proxy-agent';

export const ONETRUST_HTTP_SERVICE_TOKEN = 'ONETRUST_HTTP_SERVICE_TOKEN';

@Global()
@Module({})
export class OnetrustHttpModule {
  static register(): DynamicModule {
    return {
      module: OnetrustHttpModule,
      imports: [
        HttpModule.registerAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            baseURL: configService.get<string>('ONETRUST_API_URL'),
            timeout: 1 * 60 * 1000,
            maxRedirects: 5,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json; charset=utf-8',
              Authorization: `Bearer ${configService.get<string>('ONETRUST_TOKEN')}`,
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
          provide: ONETRUST_HTTP_SERVICE_TOKEN,
          useExisting: HttpService,
          // inject: [HttpService],
        },
      ],
      exports: [ONETRUST_HTTP_SERVICE_TOKEN],
    };
  }
}

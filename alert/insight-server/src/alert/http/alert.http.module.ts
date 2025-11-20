import { DynamicModule, Global } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const ALERT_SERVICE_TOKEN = 'ALERT_SERVICE_TOKEN';

@Global()
export class AlertHttpModule {
  static register(): DynamicModule {
    return {
      module: AlertHttpModule,
      imports: [
        HttpModule.registerAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => {
            return {
              baseURL: configService.get<string>('KUNLUN_API_URL'),
              timeout: 1 * 60 * 1000,
              maxRedirects: 5,
              headers: {
                'Content-Type': 'application/json',
                AUTH_API_KEY: configService.get<string>('KUNLUN_API_TOKEN'),
              },
            };
          },
          inject: [ConfigService],
        }),
      ],
      providers: [
        {
          provide: ALERT_SERVICE_TOKEN,
          useExisting: HttpService,
        },
      ],
      exports: [ALERT_SERVICE_TOKEN],
    };
  }
}

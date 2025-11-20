import { Module, DynamicModule, Global } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const KUFOX_HTTP_SERVICE_TOKEN = 'KUFOX_HTTP_SERVICE_TOKEN';

@Global()
@Module({})
export class KufoxHttpModule {
  static register(): DynamicModule {
    return {
      module: KufoxHttpModule,
      imports: [
        HttpModule.registerAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            baseURL: configService.get<string>('KUFOX_API_URL'),
            timeout: 1 * 60 * 1000,
            maxRedirects: 5,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [
        {
          provide: KUFOX_HTTP_SERVICE_TOKEN,
          useExisting: HttpService,
        },
      ],
      exports: [KUFOX_HTTP_SERVICE_TOKEN],
    };
  }
}

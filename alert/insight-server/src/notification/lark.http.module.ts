import { Module, DynamicModule, Global } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const LARK_HTTP_SERVICE_TOKEN = 'LARK_HTTP_SERVICE_TOKEN';

@Global()
@Module({})
export class LarkHttpModule {
  static register(): DynamicModule {
    return {
      module: LarkHttpModule,
      imports: [
        HttpModule.registerAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            baseURL: configService.get<string>('LARK_API_URL'),
            timeout: 1 * 60 * 1000,
            maxRedirects: 5,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${configService.get<string>('TEAMS_NOTIFY_TOKEN')}`,
            },
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [
        {
          provide: LARK_HTTP_SERVICE_TOKEN,
          useExisting: HttpService,
        },
      ],
      exports: [LARK_HTTP_SERVICE_TOKEN],
    };
  }
}

import { Module, DynamicModule, Global } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const TEAMS_HTTP_SERVICE_TOKEN = 'TEAMS_HTTP_SERVICE_TOKEN';

@Global()
@Module({})
export class TeamsHttpModule {
  static register(): DynamicModule {
    return {
      module: TeamsHttpModule,
      imports: [
        HttpModule.registerAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            baseURL: configService.get<string>('TEAMS_API_URL'),
            timeout: 1 * 60 * 1000,
            maxRedirects: 5,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json; charset=utf-8',
              Authorization: `Bearer ${configService.get<string>('TEAMS_NOTIFY_TOKEN')}`,
            },
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [
        {
          provide: TEAMS_HTTP_SERVICE_TOKEN,
          useExisting: HttpService,
          // inject: [HttpService],
        },
      ],
      exports: [TEAMS_HTTP_SERVICE_TOKEN],
    };
  }
}

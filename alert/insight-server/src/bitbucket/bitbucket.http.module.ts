import { Module, DynamicModule, Global } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const BITBUCKET_HTTP_SERVICE_TOKEN = 'BITBUCKET_HTTP_SERVICE_TOKEN';

@Global()
@Module({})
export class BitbucketHttpModule {
  static register(): DynamicModule {
    return {
      module: BitbucketHttpModule,
      imports: [
        HttpModule.registerAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            baseURL: configService.get<string>('BITBUCKET_API_URL'),
            timeout: 1 * 60 * 1000,
            maxRedirects: 5,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${configService.get<string>('BITBUCKET_TOKEN')}`,
            },
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [
        {
          provide: BITBUCKET_HTTP_SERVICE_TOKEN,
          useExisting: HttpService,
          // inject: [HttpService],
        },
      ],
      exports: [BITBUCKET_HTTP_SERVICE_TOKEN],
    };
  }
}

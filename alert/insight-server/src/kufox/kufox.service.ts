import { Inject, Injectable } from '@nestjs/common';
import { KUFOX_HTTP_SERVICE_TOKEN } from './kufox.http.module';
import { HttpService } from '@nestjs/axios';
import { ReportCheckResultData } from './kufox.types';

@Injectable()
export class KufoxService {
  constructor(@Inject(KUFOX_HTTP_SERVICE_TOKEN) private readonly httpService: HttpService) {
    //
  }

  /**
   * 上报检查结果
   */
  async reportCheckResult(data: ReportCheckResultData) {
    const res = this.httpService
      .post('/daily-build/cicd_check_item', {
        data: {
          ...data,
          appType: 'web',
          checkType: 'web-checker',
        },
      })
      .toPromise();
    return res;
  }
}

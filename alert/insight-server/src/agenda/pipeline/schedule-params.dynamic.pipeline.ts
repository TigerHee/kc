import { ArgumentMetadata, BadRequestException, HttpException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import DEFINER_JOB_ENUMS from '../constants/definer.constants';
import {
  BitbucketScanRepoJscramblerJobDto,
  BitbucketScanRepoOfflineJobDto,
  BitbucketScanRepoPackageJsonJobDto,
  ComplianceCodeScanJobDto,
  InsightProjectsRouteJobDto,
  InsightSecretReplaceJobDto,
  KucoinSafeBrowsingJobDto,
  KucoinVirustotalJobDto,
  OnetrustScanCookieDiffJobDto,
  KunlunScanAlertJobDto,
  ScanAlertBacklogListJobDto,
} from '../dto/schedule-job-payload.dto';
import { ScheduleTypeEnum } from '../types';
import { ImmediateJobDto, IntervalJobDto, ScheduleJobDto } from '../dto/schedule-job-params.dto';

@Injectable()
export class ScheduleParamsDynamicPipeline implements PipeTransform {
  scheduleType: ScheduleTypeEnum;

  constructor(scheduleType: ScheduleTypeEnum) {
    this.scheduleType = scheduleType;
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    const { type } = metadata;
    if (type === 'body') {
      // 检查整个外部数据
      switch (this.scheduleType) {
        case ScheduleTypeEnum.IMMEDIATE:
          const im_errors = await validate(plainToClass(ImmediateJobDto, value));
          if (im_errors.length > 0) {
            throw new BadRequestException(Object.values(im_errors.map((e) => e.constraints)));
          }
          break;
        case ScheduleTypeEnum.SCHEDULE:
          const sc_errors = await validate(plainToClass(ScheduleJobDto, value));
          if (sc_errors.length > 0) {
            throw new BadRequestException(Object.values(sc_errors.map((e) => e.constraints)));
          }
          break;
        case ScheduleTypeEnum.INTERVAL:
          const in_errors = await validate(plainToClass(IntervalJobDto, value));
          if (in_errors.length > 0) {
            throw new BadRequestException(Object.values(in_errors.map((e) => e.constraints)));
          }
          break;
        default:
          throw new BadRequestException('未知的调度类型');
      }

      // 检查Job请求需要的payload数据
      const { name, payload } = value;

      // 测试任务
      if (
        [
          // DEFINER_JOB_ENUMS.TEST_ASYNC_LONG_RUNNING_JOB_V1,
          //     DEFINER_JOB_ENUMS.TEST_LONG_SCHEDULE_JOB_V1,
          //     DEFINER_JOB_ENUMS.TEST_SHORT_SCHEDULE_JOB_V1,
          //     DEFINER_JOB_ENUMS.TEST_REMOTE_ASYNC_JOB_V1,
          //     DEFINER_JOB_ENUMS.TEST_FAR_SCHEDULE_JOB_V1,
          //     DEFINER_JOB_ENUMS.TEST_FAIL_JOB_V1,
        ].includes(name)
      ) {
        //   console.log('测试任务', name, payload);
        return value;
      }

      let jobDataDtoClass;
      switch (name) {
        case DEFINER_JOB_ENUMS.ONETRUST_COOKIE_DETECT_DIFF_V1:
          jobDataDtoClass = OnetrustScanCookieDiffJobDto;
          break;
        case DEFINER_JOB_ENUMS.INSIGHT_SECRET_REFRESH_NOTIFY_V1:
          jobDataDtoClass = InsightSecretReplaceJobDto;
          break;
        case DEFINER_JOB_ENUMS.BITBUCKET_SCAN_REPO_PACKAGE_JSON_V1:
          jobDataDtoClass = BitbucketScanRepoPackageJsonJobDto;
          break;
        case DEFINER_JOB_ENUMS.BITBUCKET_SCAN_REPO_APP_H5_OFFLINE_V1:
          jobDataDtoClass = BitbucketScanRepoOfflineJobDto;
          break;
        case DEFINER_JOB_ENUMS.BITBUCKET_SCAN_REPO_JSCRAMBLER_V1:
          jobDataDtoClass = BitbucketScanRepoJscramblerJobDto;
          break;
        case DEFINER_JOB_ENUMS.INSIGHT_PROJECTS_ROUTES_JOB_V1:
          jobDataDtoClass = InsightProjectsRouteJobDto;
          break;
        case DEFINER_JOB_ENUMS.KUCOIN_SAFE_BROWSING_JOB_V1:
          jobDataDtoClass = KucoinSafeBrowsingJobDto;
          break;
        case DEFINER_JOB_ENUMS.KUCOIN_VIRUSTOTAL_JOB_V1:
          jobDataDtoClass = KucoinVirustotalJobDto;
          break;
        case DEFINER_JOB_ENUMS.KUNLUN_SCAN_ALERT_V1:
          jobDataDtoClass = KunlunScanAlertJobDto;
          break;
        case DEFINER_JOB_ENUMS.SCAN_ALERT_BACKLOG_LIST_V1:
          jobDataDtoClass = ScanAlertBacklogListJobDto;
          break;
        case DEFINER_JOB_ENUMS.COMPLIANCE_CODE_SCAN_V1:
          jobDataDtoClass = ComplianceCodeScanJobDto;
          break;

        // 测试任务
        // case DEFINER_JOB_ENUMS.TEST_ASYNC_LONG_RUNNING_JOB_V1:
        //   jobDataDtoClass = KucoinVirustotalJobDto;
        // break;
        default:
          throw new HttpException('任务不存在或者参数错误', 400);
      }
      const object = plainToClass(jobDataDtoClass, payload);
      const errors = await validate(object);
      if (errors.length > 0) {
        throw new BadRequestException(errors.map((e) => Object.values(e.constraints)).join(','));
      }
      return value;
    }
  }
}

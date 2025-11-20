import { BitbucketOfflineService } from './../../bitbucket/services/offline.bitbucket.service';
import { InsightProjectsService } from '../../insight/services/projects.insight.service';
import { Injectable, UseInterceptors } from '@nestjs/common';
import { Job } from '@hokify/agenda';
import { DefineJob } from '../decorator';
import { OnetrustService } from 'src/onetrust/services/onetrust.service';
import {
  BitbucketScanRepoJscramblerJobDto,
  BitbucketScanRepoOfflineJobDto,
  BitbucketScanRepoPackageJsonJobDto,
  ComplianceCodeScanJobDto,
  InsightSecretReplaceJobDto,
  OnetrustScanCookieDiffJobDto,
  KunlunScanAlertJobDto,
  ScanAlertBacklogListJobDto,
} from '../dto/schedule-job-payload.dto';
import DEFINER_JOB_ENUMS from '../constants/definer.constants';
import { JobExecutionData } from '../types';
import { BitbucketPackageService } from 'src/bitbucket/services/package.bitbucket.service';
import { BitbucketJscramblerService } from 'src/bitbucket/services/jscrambler.bitbucket.service';
import { DefinerExceptionInterceptor } from '../exceptions/exception.interceptor.definer';
import { AutoProjectsInsightService } from 'src/insight/services/auto.project.insight.service';
import { ComplianceScanService } from 'src/compliance/services/scan.compliance.service';
import { AlertService } from 'src/alert/service/alert.service';

/**
 * 全局任务定义器，定义全局任务
 * 可以用用接口调用，获取是手动创建的定时任务使用
 * 与项目相关的任务定义器请查看ProjectJobDefiner
 */
@Injectable()
@UseInterceptors(DefinerExceptionInterceptor)
export class GlobalJobDefiner {
  constructor(
    private readonly onetrustService: OnetrustService,
    private readonly insightProjectsService: InsightProjectsService,
    private readonly bitbucketPackageService: BitbucketPackageService,
    private readonly bitbucketJscramblerService: BitbucketJscramblerService,
    private readonly bitbucketOfflineService: BitbucketOfflineService,
    private readonly autoProjectsInsightService: AutoProjectsInsightService,
    private readonly complianceScanService: ComplianceScanService,
    private readonly alertService: AlertService,
  ) {
    //
  }

  /**
   * Token更换提醒和通知
   * @param job
   * @param done
   */
  @DefineJob(DEFINER_JOB_ENUMS.INSIGHT_SECRET_REFRESH_NOTIFY_V1, 'Token更换提醒和通知')
  async insightServerBitbucketTokenRefreshNotify(job: Job<JobExecutionData<InsightSecretReplaceJobDto>>, done) {
    const { data } = job.attrs;
    await this.insightProjectsService.replaceSecretNotify(data.payload);
    done?.();
    return true;
  }

  /**
   * 使用Onetrust探测cookie的diff
   * @param job
   * @param done
   */
  @DefineJob(DEFINER_JOB_ENUMS.ONETRUST_COOKIE_DETECT_DIFF_V1, '使用Onetrust探测cookie的diff')
  async onetrustCookieDetectDiff(job: Job<JobExecutionData<OnetrustScanCookieDiffJobDto>>, done) {
    const { data } = job.attrs;
    await this.onetrustService.makeCookieDiffAAndSendMessage({ ...data.payload, executor: 'system' });
    done?.();
    return true;
  }

  /**
   * 扫描Bitbucket仓库的package.json
   * @param job
   * @param done
   */
  @DefineJob(DEFINER_JOB_ENUMS.BITBUCKET_SCAN_REPO_PACKAGE_JSON_V1, '扫描仓库的package.json')
  async bitbucketScanRepoPackageJson(job: Job<JobExecutionData<BitbucketScanRepoPackageJsonJobDto>>, done) {
    const { data } = job.attrs;
    const res = await this.bitbucketPackageService.getPackageJsonContent(data.payload);
    done?.(res);
    return true;
  }

  /**
   * 扫描Bitbucket仓库的AppH5离线包
   * @param job
   * @param done
   */
  @DefineJob(DEFINER_JOB_ENUMS.BITBUCKET_SCAN_REPO_APP_H5_OFFLINE_V1, '扫描仓库的AppH5离线包')
  async bitbucketScanRepoAppH5Offline(job: Job<JobExecutionData<BitbucketScanRepoOfflineJobDto>>, done) {
    const { data } = job.attrs;
    const res = await this.bitbucketOfflineService.getOfflineContent(data.payload);
    done?.(res);
    return true;
  }

  /**
   * 扫描Bitbucket仓库的Jscrambler
   * @param job
   * @param done
   */
  @DefineJob(DEFINER_JOB_ENUMS.BITBUCKET_SCAN_REPO_JSCRAMBLER_V1, '扫描仓库的Jscrambler')
  async bitbucketScanRepoJscrambler(job: Job<JobExecutionData<BitbucketScanRepoJscramblerJobDto>>, done) {
    const { data } = job.attrs;
    const res = await this.bitbucketJscramblerService.getJscramblerContent(data.payload);
    done?.(res);
    return true;
  }

  /**
   * 扫描前端kunlun告警列表
   * @param job
   * @param done
   */
  @DefineJob(DEFINER_JOB_ENUMS.KUNLUN_SCAN_ALERT_V1, '扫描前端kunlun告警列表')
  async scanKunlunAlertList(job: Job<JobExecutionData<KunlunScanAlertJobDto>>, done) {
    const { data } = job.attrs;
    const res = await this.alertService.scanAlerts(data.payload);
    done?.(res);
    return true;
  }

  /**
   * 扫描未处理的告警消息
   * @param job
   * @param done
   */
  @DefineJob(DEFINER_JOB_ENUMS.SCAN_ALERT_BACKLOG_LIST_V1, '扫描未处理的告警消息')
  async scanAlertBacklogList(job: Job<JobExecutionData<ScanAlertBacklogListJobDto>>, done) {
    const res = await this.alertService.getAlertBacklog();
    done?.(res);
    return true;
  }

  /**
   * 合规代码扫描
   * @param job
   * @param done
   * @returns
   */
  @DefineJob(DEFINER_JOB_ENUMS.COMPLIANCE_CODE_SCAN_V1, '合规代码扫描')
  async complianceCodeScan(job: Job<JobExecutionData<ComplianceCodeScanJobDto>>, done) {
    const { data } = job.attrs;
    const { repos } = data.payload;
    const res = await this.complianceScanService.scanRepoComplianceCodeAll(repos);
    done?.(res);
    return true;
  }
}

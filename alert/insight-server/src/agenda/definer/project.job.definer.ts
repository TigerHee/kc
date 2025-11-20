import { Injectable, UseInterceptors } from '@nestjs/common';
import DEFINER_JOB_ENUMS from '../constants/definer.constants';
import { DefineJob } from '../decorator';
import { DefinerExceptionInterceptor } from '../exceptions/exception.interceptor.definer';
import { JobExecutionData } from '../types';
import { Job } from '@hokify/agenda';
import { BitbucketPackageService } from 'src/bitbucket/services/package.bitbucket.service';
import { CommonProjectAutoWorkflowJobV1 } from '../types/project-job.type';
import { BitbucketJscramblerService } from 'src/bitbucket/services/jscrambler.bitbucket.service';
import { BitbucketOfflineService } from 'src/bitbucket/services/offline.bitbucket.service';
import { InsightProjectsService } from 'src/insight/services/projects.insight.service';

/**
 * 项目任务定义器，定义项目相关任务
 */
@Injectable()
@UseInterceptors(DefinerExceptionInterceptor)
export class ProjectJobDefiner {
  constructor(
    private readonly insightProjectsService: InsightProjectsService,
    private readonly bitbucketPackageService: BitbucketPackageService,
    private readonly bitbucketJscramblerService: BitbucketJscramblerService,
    private readonly bitbucketOfflineService: BitbucketOfflineService,
  ) {
    //
  }

  /**
   * 扫描项目的package配置
   * @param job
   * @param done
   * @returns
   */
  @DefineJob(DEFINER_JOB_ENUMS.PROJECT_SCAN_REPO_PACKAGE_JSON_V1, '扫描项目配置')
  async projectScanRepoPackageJson(job: Job<JobExecutionData<CommonProjectAutoWorkflowJobV1>>, done) {
    const { data } = job.attrs;
    const _payload = {
      repo: data.payload.project.repos.slug,
    };
    const res = await this.bitbucketPackageService.getPackageJsonContent(_payload);
    done?.(res);
    return true;
  }

  /**
   * 扫描项目的jscrambler配置
   * @param job
   * @param done
   * @returns
   */
  @DefineJob(DEFINER_JOB_ENUMS.PROJECT_SCAN_REPO_JSCRAMBLER_V1, '扫描加固配置')
  async projectScanRepoJscrambler(job: Job<JobExecutionData<CommonProjectAutoWorkflowJobV1>>, done) {
    const { data } = job.attrs;
    const _payload = {
      repo: data.payload.project.repos.slug,
    };
    const res = await this.bitbucketJscramblerService.getJscramblerContent(_payload);
    done?.(res);
    return true;
  }

  /**
   * 扫描项目的offline配置
   * @param job
   * @param done
   * @returns
   */
  @DefineJob(DEFINER_JOB_ENUMS.PROJECT_SCAN_REPO_OFFLINE_V1, '扫描离线配置')
  async projectScanRepoOffline(job: Job<JobExecutionData<CommonProjectAutoWorkflowJobV1>>, done) {
    const { data } = job.attrs;
    const _payload = {
      repo: data.payload.project.repos.slug,
    };
    const res = await this.bitbucketOfflineService.getOfflineContent(_payload);
    done?.(res);
    return true;
  }

  /**
   * 扫描项目的路由配置
   * @param job
   * @param done
   * @returns
   */
  @DefineJob(DEFINER_JOB_ENUMS.PROJECT_SCAN_REPO_ROUTES_V1, '扫描路由配置')
  async projectScanRepoRoute(job: Job<JobExecutionData<CommonProjectAutoWorkflowJobV1>>, done) {
    const { data } = job.attrs;
    const projectId = data.payload.project._id;
    const res = await this.insightProjectsService.refreshOneProjectRoute(projectId);
    done?.(res);
    return true;
  }
}

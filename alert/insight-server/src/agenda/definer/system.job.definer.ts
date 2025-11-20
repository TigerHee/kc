import { InsightProjectsService } from 'src/insight/services/projects.insight.service';
import { SafebrowsingService } from 'src/safebrowsing/services/safebrowsing.service';
import { VirustotalService } from 'src/virustotal/services/virustotal.service';
import DEFINER_JOB_ENUMS from '../constants/definer.constants';
import { DefineJob, ScheduleJob } from '../decorator';
import { AgendaJobsService } from './../services/jobs.agenda.service';
import { Injectable, Logger, UseInterceptors } from '@nestjs/common';
import { JobWithId } from '@hokify/agenda';
import { DefinerExceptionInterceptor } from '../exceptions/exception.interceptor.definer';
import { MustReadInsightService } from 'src/insight/services/must-read.insight.service';

/**
 * 系统任务定义器，定义系统任务
 * 用于定义系统级别的任务，启动就需要运行的任务
 * 用于接口或者手动创建的定时任务，请查看GlobalJobDefiner
 * 与项目相关的任务定义器，请查看ProjectJobDefiner
 */
@Injectable()
@UseInterceptors(DefinerExceptionInterceptor)
export class SystemJobDefiner {
  logger = new Logger(SystemJobDefiner.name);
  constructor(
    private readonly agendaJobsService: AgendaJobsService,
    private readonly insightProjectsService: InsightProjectsService,
    private readonly safebrowsingService: SafebrowsingService,
    private readonly virustotalService: VirustotalService,
    private readonly mustReadInsightService: MustReadInsightService,
  ) {
    //
  }

  /**
   * insight 全量项目路由定时任务
   * @param job
   * @param done
   */
  @DefineJob(DEFINER_JOB_ENUMS.INSIGHT_PROJECTS_ROUTES_JOB_V1, 'Insight 全量项目路由定时任务', {
    priority: 'high',
  })
  @ScheduleJob('00 14 * * *', true, {
    scheduleType: 'interval',
    triggerSource: 'system',
    interval: '00 14 * * *',
  })
  async insightProjectsRoutesScheduleJob(job: JobWithId, done) {
    console.log('🚛 调度运行 { INSIGHT:PROJECTS_ROUTES_JOB }', job.attrs.data);
    await this.insightProjectsService.refreshAllProjectRoute();
    done?.();
  }

  /**
   * Kucoin 域名safe-browsing定时任务
   * @param job
   * @param done
   */
  @DefineJob(DEFINER_JOB_ENUMS.KUCOIN_SAFE_BROWSING_JOB_V1, 'Kucoin 域名safe-browsing定时任务', {
    priority: 'high',
  })
  @ScheduleJob('30 08,17 * * *', true, {
    scheduleType: 'interval',
    triggerSource: 'system',
    interval: '30 08,17 * * *',
  })
  async safeBrowsingScheduleJob(job, done) {
    console.log('🚛 调度运行 { KUCOIN:SAFE_BROWSING_JOB }', job.attrs.data);
    await this.safebrowsingService.checkKucoinUrls(job.attrs.data.triggerSource);
    done?.();
  }

  /**
   * Kucoin 域名virustotal定时任务
   * @param job
   * @param done
   */
  @DefineJob(DEFINER_JOB_ENUMS.KUCOIN_VIRUSTOTAL_JOB_V1, 'Kucoin 域名virustotal定时任务', {
    priority: 'high',
  })
  @ScheduleJob('20 09,18 * * *', true, {
    scheduleType: 'interval',
    triggerSource: 'system',
    interval: '20 09,18, * * *',
  }) // 每天 9:20、18:20 运行
  async virustotalScheduleJob(job, done) {
    console.log('🚛 调度运行 { KUCOIN:VIRUSTOTAL_JOB }', job.attrs.data);
    await this.virustotalService.checkKucoinDomains(job.attrs.data.triggerSource);
    done?.();
  }

  /**
   * 扫描wiki的viewer
   * 每15分钟扫描一次
   * @param job
   * @param done
   */
  @DefineJob(DEFINER_JOB_ENUMS.CONFLUENCE_WIKI_VIEWER_UPDATE_V1, '扫描wiki的viewer', {
    priority: 'high',
  })
  @ScheduleJob('15 minutes', true, {
    scheduleType: 'interval',
    triggerSource: 'system',
    interval: '15 minutes',
  })
  async scanProjectRoutes(job, done) {
    // 如果是开发环境，不执行
    if (process.env.NODE_ENV === 'development') {
      console.log('🚛 [DEV QUIT] 调度运行 { CONFLUENCE:WIKI_VIEWER_UPDATE_V1 }', job.attrs.data);
      done?.();
      return;
    }
    console.log('🚛 调度运行 { CONFLUENCE:WIKI_VIEWER_UPDATE_V1 }', job.attrs.data);
    await this.mustReadInsightService.refreshMustReadWikiList();
    done?.();
  }

  // /**
  //  * 测试异步长时间任务
  //  * @param job
  //  * @param done
  //  */
  // @DefineJob(DEFINER_JOB_ENUMS.TEST_ASYNC_LONG_RUNNING_JOB_V1, '测试异步长时间任务', {
  //   priority: 'high',
  // })
  // async testAsyncLongRunningJob(job: JobWithId, done) {
  //   await new Promise<void>(async (resolve) => {
  //     let progress = 0;
  //     await new Promise<void>((resolve) => {
  //       const ref = setInterval(async () => {
  //         progress += 20;
  //         this.logger.log('🚛 调度运行 { TEST:LONG_RUNNING_JOB:v1 } PROGRESS ->' + progress);
  //         await this.agendaJobsService.updateTaskProgressByJob(job, progress);
  //         if (progress === 100) {
  //           clearInterval(ref);
  //           resolve();
  //         }
  //       }, 1000);
  //     });
  //     resolve();
  //     done?.();
  //   });
  //   return true;
  // }

  // /**
  //  * 测试长定时任务
  //  * @param job
  //  * @param done
  //  */
  // @DefineJob(DEFINER_JOB_ENUMS.TEST_LONG_SCHEDULE_JOB_V1, '测试长定时任务', {
  //   priority: 'high',
  // })
  // @ScheduleJob('1 hour', true)
  // async testLongScheduleJob(job, done) {
  //   console.log('🚛 调度运行 { TEST:LONG_SCHEDULE_JOB }', job.attrs.data);
  //   done?.();
  // }

  // /**
  //  * 测试远程异步执行任务
  //  * @param job
  //  * @param done
  //  */
  // @DefineJob(DEFINER_JOB_ENUMS.TEST_REMOTE_ASYNC_JOB_V1, '测试立即执行任务', {
  //   priority: 'high',
  // })
  // async testImmediateJob(job, done) {
  //   console.log('🚛 调度运行 { TEST:IMMEDIATE_JOB }', job.attrs.data);
  //   done?.();
  // }

  // /**
  //  * 测试遥远的计划任务
  //  */
  // @DefineJob(DEFINER_JOB_ENUMS.TEST_FAR_SCHEDULE_JOB_V1, '测试遥远的计划任务', {
  //   priority: 'high',
  // })
  // @ScheduleJob('in 1 year', false, { name: 'FAR_SCHEDULE_JOB' })
  // async testFarScheduleJob(job, done) {
  //   console.log('🚛 调度运行 { TEST:FAR_SCHEDULE_JOB }', job.attrs.data);
  //   done?.();
  //   return true;
  // }

  // /**
  //  * 测试失败任务
  //  */
  // @DefineJob(DEFINER_JOB_ENUMS.TEST_FAIL_JOB_V1, '测试失败任务', {
  //   priority: 'high',
  // })
  // async testFailJob(job: Job) {
  //   console.log('🚛 调度运行 { TEST:FAIL_JOB }', job.attrs.data);
  //   throw new Error('测试失败任务');
  // }
}

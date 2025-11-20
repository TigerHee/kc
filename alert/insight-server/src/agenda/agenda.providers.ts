import { FactoryProvider } from '@nestjs/common';
import { Agenda } from '@hokify/agenda';
import type { AgendaModuleOptions } from './types';
import { AGENDA_MODULE_OPTIONS_TOKEN } from './constants/agenda.constants';
import { AgendaLogService } from './services/log.agenda.service';
import { ObjectId, Types } from 'mongoose';
import { AgendaJobsService } from './services/jobs.agenda.service';
import { KunlunLogger } from 'src/common/kunlun.logger';
import { AutoProjectsInsightService } from 'src/insight/services/auto.project.insight.service';
const logger = new KunlunLogger('InsightAgendaCore');

export enum ListenAgendaEvent {
  START = 'start',
  COMPLETE = 'complete',
  SUCCESS = 'success',
  FAIL = 'fail',
  ERROR = 'error',
}

export const createClientProvider = (): FactoryProvider => ({
  provide: Agenda,
  useFactory: async (
    options: AgendaModuleOptions,
    jobLogService: AgendaLogService,
    agendaJobsService: AgendaJobsService,
    autoProjectsInsightService: AutoProjectsInsightService,
  ) => {
    const agenda = new Agenda(options);

    /**
     * 任务开始
     */
    agenda.on(ListenAgendaEvent.START, async (job) => {
      logger.log(`🎯 [HOOK]调度任务执行 { ${job.attrs.name} } 状态 <Started>`);
      await jobLogService.logTask(
        job.attrs.name,
        new Types.ObjectId(job.attrs._id) as unknown as ObjectId,
        'start',
        job.attrs.data,
        '',
      );
    });

    /**
     * 任务执行失败
     */
    agenda.on(ListenAgendaEvent.FAIL, async (err, job) => {
      logger.error(`🎯 [HOOK]调度任务执行 { ${job.attrs.name} } 状态 <Failed>: ${err.message}`, err.stack);
      await jobLogService.logTask(
        job.attrs.name,
        new Types.ObjectId(job.attrs._id) as unknown as ObjectId,
        'fail',
        job.attrs.data,
        err.message,
      );
    });

    /**
     * Agenda 错误
     */
    agenda.on(ListenAgendaEvent.ERROR, async (err) => {
      logger.error(`🎯 [HOOK]调度任务执行 { } 状态 <Error>: ${err.message}`, err.stack);
    });

    /**
     * 完成任务
     */
    agenda.on(ListenAgendaEvent.COMPLETE, async (job) => {
      logger.log(`🎯 [HOOK]调度任务执行 { ${job.attrs.name} } 状态 <Completed>`);
      if (job.attrs.type === 'normal') {
        await agendaJobsService.updateTaskProgress(job.attrs._id as unknown as string, 100);
      }
      await jobLogService.logTask(
        job.attrs.name,
        new Types.ObjectId(job.attrs._id) as unknown as ObjectId,
        'complete',
        job.attrs.data,
        '',
      );

      // 如果是自动任务机制, 则调度下一个任务
      // 特征: triggerUser === 'project-workflow'
      if ((job.attrs.data as any).triggerUser === 'project-workflow') {
        await autoProjectsInsightService.currentStepFinish((job.attrs.data as any).payload.workflowRecord);
      }
    });
    await agenda.start();
    logger.log('🚚 调度任务的核心 <启动完成> ');
    return agenda;
  },
  inject: [AGENDA_MODULE_OPTIONS_TOKEN, AgendaLogService, AgendaJobsService, AutoProjectsInsightService],
});

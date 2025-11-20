import { Agenda } from '@hokify/agenda';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { AgendaLogService } from './log.agenda.service';
import { ObjectId, Types } from 'mongoose';
import { AppGateway, WsEventTypes } from 'src/websocket/app.gateway';
import { ScheduleTypeEnum } from '../types';

@Injectable()
export class InvokeAgendaService {
  constructor(
    @Inject(forwardRef(() => Agenda)) private readonly agenda: Agenda,
    private readonly agendaLogService: AgendaLogService,
    private readonly appGateway: AppGateway,
  ) {
    //
  }

  /**
   * 调用一个周期任务
   * @param name
   * @param interval
   * @returns
   */
  async callTaskInterval(name: string, interval: string, data: any = {}) {
    const jobData = {
      ...data,
      scheduleType: ScheduleTypeEnum.INTERVAL,
    };
    const job = await this.agenda.every(interval, name, jobData, {
      skipImmediate: true,
      timezone: 'Asia/Shanghai',
    });
    await this.agendaLogService.logTask(
      job.attrs.name,
      new Types.ObjectId(job.attrs._id) as unknown as ObjectId,
      'create',
      jobData,
    );
    this.appGateway.sendMessage(WsEventTypes.AGENDA_JOBS_STATUS_UPDATE, {
      type: 'new-job',
      data: {
        name,
      },
    });
    return job.attrs._id;
  }

  /**
   * 调用一个计划任务
   * @param cron
   * @param name
   * @param data
   * @returns
   */
  async callTaskSchedule(cron: string, name: string, data: any = {}) {
    const jobData = {
      ...data,
      scheduleType: ScheduleTypeEnum.SCHEDULE,
    };
    const job = await this.agenda.schedule(cron, name, jobData);
    await this.agendaLogService.logTask(
      job.attrs.name,
      new Types.ObjectId(job.attrs._id) as unknown as ObjectId,
      'create',
      jobData,
    );
    this.appGateway.sendMessage(WsEventTypes.AGENDA_JOBS_STATUS_UPDATE, {
      type: 'new-job',
      data: {
        name,
      },
    });
    return job.attrs._id;
  }

  /**
   * 立即执行任务
   * @param name
   * @param data
   * @returns
   */
  async callTaskImmediate(name: string, data: any = {}) {
    const jobData = {
      ...data,
      scheduleType: ScheduleTypeEnum.IMMEDIATE,
    };
    const job = await (await this.agenda.now(name, jobData)).save();
    await this.agendaLogService.logTask(
      job.attrs.name,
      new Types.ObjectId(job.attrs._id) as unknown as ObjectId,
      'create',
      jobData,
    );
    this.appGateway.sendMessage(WsEventTypes.AGENDA_JOBS_STATUS_UPDATE, {
      type: 'new-job',
      data: {
        name,
      },
    });
    return job.attrs._id;
  }
}

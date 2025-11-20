import { AgendaJobsService } from './jobs.agenda.service';
import { Agenda } from '@hokify/agenda';
import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { Types, ObjectId } from 'mongoose';
import { AgendaLogService } from './log.agenda.service';

@Injectable()
export class AgendaActionService {
  private readonly logger = new Logger(AgendaActionService.name);

  constructor(
    @Inject(Agenda) private readonly agenda: Agenda,
    private readonly agendaJobsService: AgendaJobsService,
    private readonly agendaLogService: AgendaLogService,
  ) {
    //
  }

  /**
   * 执行日志
   * @param name
   * @param status
   */
  protected async log(name: string, status: string) {
    this.logger.log(`🎯 [HOOK]调度任务执行 { ${name} } 状态 <${status}>`);
  }

  /**
   * 禁用任务
   * @param id
   * @returns
   */
  async disableTask(id: string) {
    const job = await this.agenda.jobs({ _id: new Types.ObjectId(id) as unknown as ObjectId });
    if (job.length === 0) {
      throw new HttpException('任务不存在', 400);
    }
    if (job[0].attrs.disabled) {
      throw new HttpException('任务已禁用', 400);
    }
    if (job[0].attrs.type !== 'single') {
      throw new HttpException('只能禁用interval任务', 400);
    }
    job[0].disable();
    await job[0].save();
    this.log(job[0].attrs.name, 'Disable');
    await this.agendaLogService.logTask(
      job[0].attrs.name,
      new Types.ObjectId(job[0].attrs._id) as unknown as ObjectId,
      'disable',
      '',
      '',
    );
  }

  /**
   * 启用任务
   * @param id
   * @returns
   */
  async enableTask(id: string) {
    const job = await this.agenda.jobs({ _id: new Types.ObjectId(id) as unknown as ObjectId });
    if (job.length === 0) {
      throw new HttpException('任务不存在', 400);
    }
    if (!job[0].attrs.disabled) {
      throw new HttpException('任务未禁用', 400);
    }
    job[0].enable();
    await job[0].save();
    this.log(job[0].attrs.name, 'Enable');
    await this.agendaLogService.logTask(
      job[0].attrs.name,
      new Types.ObjectId(job[0].attrs._id) as unknown as ObjectId,
      'enable',
      '',
      '',
    );
  }

  /**
   * 删除任务
   * @param id
   * @returns
   */
  async removeTask(id: string) {
    const job = await this.agenda.jobs({ _id: new Types.ObjectId(id) as unknown as ObjectId });
    if (job.length === 0) {
      throw new HttpException('任务不存在', 400);
    }
    await job[0].remove();
    await job[0].save();
    this.log(job[0].attrs.name, 'Remove');
    await this.agendaLogService.logTask(
      job[0].attrs.name,
      new Types.ObjectId(job[0].attrs._id) as unknown as ObjectId,
      'remove',
      '',
      '',
    );
  }

  /**
   * 取消任务
   * 针对fork任务，才有取消任务的操作
   * @param id
   * @returns
   */
  async cancelTask(id: string, reason: string = '取消任务') {
    const job = await this.agenda.jobs({ _id: new Types.ObjectId(id) as unknown as ObjectId });
    if (job.length === 0) {
      throw new HttpException('任务不存在', 400);
    }
    job[0].cancel(reason);
    await job[0].save();
    this.log(job[0].attrs.name, 'Cancel');
    await this.agendaLogService.logTask(
      job[0].attrs.name,
      new Types.ObjectId(job[0].attrs._id) as unknown as ObjectId,
      'cancel',
      '',
      '',
    );
  }

  /**
   * 清除所有当前没有define的任务
   * @param id
   */
  async purgeTask() {
    return await this.agenda.purge();
  }

  /**
   * 手动完成任务
   * @param id
   */
  async manualCompleteTask(id: string) {
    const job = await this.agenda.jobs({ _id: new Types.ObjectId(id) as unknown as ObjectId });
    if (job.length === 0) {
      throw new HttpException('任务不存在', 400);
    }
    if (job[0].attrs.progress === 100) {
      throw new HttpException('任务已完成', 400);
    }
    if (job[0].attrs.type === 'single') {
      throw new HttpException('不能操作周期任务', 400);
    }
    await this.agendaJobsService.updateTaskProgress(job[0].attrs._id as unknown as string, 100);

    this.log(job[0].attrs.name, 'ManualComplete');
    await this.agendaLogService.logTask(
      job[0].attrs.name,
      new Types.ObjectId(job[0].attrs._id) as unknown as ObjectId,
      'manual-complete',
      '',
      '',
    );
  }
}

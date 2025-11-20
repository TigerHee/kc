import { Agenda, Job } from '@hokify/agenda';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, SortOrder, Types } from 'mongoose';
import { JobLog } from '../schemas/job-log.schema';
import { ObjectId as OldObjectId } from 'mongodb';
import { Jobs } from '../schemas/jobs.schema';
import { AgendaExplorer } from '../agenda.explorer';
import { AppGateway, WsEventTypes } from 'src/websocket/app.gateway';
import DEFINER_JOB_ENUMS from '../constants/definer.constants';
import { JobExecutionData, ScheduleTriggerEnum, ScheduleTypeEnum } from '../types';
import { ProjectAutoWorkflowContextDto } from '../dto/schedule-job-payload.dto';
import { AutoProjectsInsightService } from 'src/insight/services/auto.project.insight.service';

@Injectable()
export class AgendaJobsService {
  constructor(
    @Inject(forwardRef(() => Agenda)) private readonly agenda: Agenda,
    @InjectModel('JobLog') private jobLogModel: Model<JobLog>,
    @InjectModel('Jobs') private jobModel: Model<Jobs>,
    private readonly agendaExplorer: AgendaExplorer,
    private readonly appGateway: AppGateway,
    private readonly autoProjectsInsightService: AutoProjectsInsightService,
  ) {
    //
  }

  /**
   * 取消任务
   * @param name
   * @returns
   */
  async cancelTask(name: string) {
    await this.agenda.cancel({ name });
  }

  /**
   * 获取所有任务
   */
  async getAllJobs(params: {
    id?: string;
    name?: string;
    type?: string;
    isCompleted?: boolean;
    priority?: number;
    pageSize?: number;
    current?: number;
    orderField?: string;
  }): Promise<{ list: any[]; total: number }> {
    const { id, name, type, isCompleted, priority, orderField, pageSize = 10, current = 1 } = params;
    const query = {};
    let order = { lastRunAt: -1 as const } as { [key: string]: SortOrder };
    if (name) {
      query['name'] = name;
    }
    if (id) {
      query['_id'] = new OldObjectId(id);
    }
    if (type) {
      query['data.scheduleType'] = type;
    }
    if (priority) {
      query['priority'] = priority;
    }
    if (isCompleted) {
      query['progress'] = 100;
    }
    if (orderField) {
      order = { [orderField]: -1 as const };
    }

    const data = await this.jobModel
      .find(query)
      .sort(order)
      .skip((current - 1) * pageSize)
      .limit(pageSize)
      .exec();
    const total = await this.jobModel.countDocuments(query);
    return {
      list: data,
      total,
    };
  }

  /**
   * 动态定义任务
   * @param name
   * @param taskFunction
   */
  async defineTask(name: string, taskFunction: (job: any) => Promise<void>) {
    this.agenda.define(name, async (job) => {
      await taskFunction(job);
    });
  }

  /**
   * 获取所有定义的任务
   */
  async getDefinedTasks() {
    const ddd = this.agendaExplorer.defineJobList;
    const def = await this.agenda.definitions;
    const data = ddd.map((item) => {
      return {
        ...item,
        meta: {
          ...def[item.name],
          fn: def[item.name].fn.toString(),
        },
      };
    });
    return data;
  }

  /**
   * 获取任务
   * @param name
   * @returns
   */
  async getScheduleTaskByName(name: string): Promise<any[]> {
    const data = (await this.agenda.jobs(
      {
        type: 'normal',
        name,
      },
      {
        lastRunAt: -1,
      },
    )) as Job<{ scheduleType: 'schedule' | 'immediate' }>[];
    return (data ?? []).map((item) => ({ ...item.attrs })).filter((item) => item.data?.scheduleType === 'schedule');
  }

  /**
   * 获取立即执行的任务
   * @param name
   * @returns
   */
  async getImmediateTaskByName(name: string): Promise<any[]> {
    const data = (await this.agenda.jobs(
      {
        type: 'normal',
        name,
      },
      {
        lastRunAt: -1,
      },
    )) as Job<{ scheduleType: 'schedule' | 'immediate' }>[];
    return (data ?? []).map((item) => ({ ...item.attrs })).filter((item) => item.data?.scheduleType === 'immediate');
  }

  /**
   * 获取周期任务
   * @param name
   * @returns
   */
  async getIntervalTaskByName(name: string): Promise<any[]> {
    const data = await this.agenda.jobs(
      {
        type: 'single',
        name,
      },
      {
        lastRunAt: -1,
      },
    );
    return (data ?? []).map((item) => ({ ...item.attrs }));
  }

  // /**
  //  * 完成任务
  //  * @param id
  //  */
  // async completeTask(id: string) {
  //   await this.jobModel.updateOne(
  //     { _id: new Types.ObjectId(id) as unknown as ObjectId },
  //     { progress: 100, completed: true }
  //   );
  // }

  /**
   * 更新任务进度
   * @param id
   * @param progress
   */
  async updateTaskProgress(id: string, progress: number) {
    await this.jobModel.updateOne(
      { _id: new Types.ObjectId(id) as unknown as ObjectId },
      { progress, completed: progress === 100 },
    );
    const jobData = await this.getOneJob(id);
    await this.appGateway.sendMessage(WsEventTypes.AGENDA_JOBS_STATUS_UPDATE, {
      type: 'progress-update',
      data: jobData,
    });
  }

  /**
   * 更新任务进度
   * @param job
   * @param progress
   */
  async updateTaskProgressByJob(job: Job, progress: number) {
    job.touch(progress);
    await job.save();
    const jobData = await this.getOneJob(job.attrs._id as unknown as string);
    await this.appGateway.sendMessage(WsEventTypes.AGENDA_JOBS_STATUS_UPDATE, {
      type: 'progress-update',
      data: jobData,
    });
  }

  /**
   * 获取所有任务日志
   * @returns
   */
  async getJobAllLogs({
    status,
    name,
    jobid,
    current = 1,
    pageSize = 10,
  }: {
    name: string;
    jobid: string;
    status?: string;
    current?: number;
    pageSize?: number;
  }) {
    const query = {};
    if (name) {
      query['name'] = name;
    }
    if (jobid) {
      query['jobId'] = new Types.ObjectId(jobid);
    }
    if (status) {
      query['status'] = status;
    }
    const data = await this.jobLogModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip((current - 1) * pageSize)
      .limit(pageSize)
      .exec();
    const total = await this.jobLogModel.countDocuments(query);
    return {
      list: data,
      total,
    };
  }

  /**
   * 获取任务日志
   * @param id
   * @param current
   * @param pageSize
   * @returns
   */
  async getTaskLogs({
    id,
    // current,
    // pageSize,
    limit = 100,
  }: {
    id: string;
    current: number;
    pageSize: number;
    limit?: number;
  }) {
    const data = await this.jobLogModel
      .find({ jobId: new Types.ObjectId(id) })
      .sort({ createdAt: -1 })
      .limit(limit)
      // .skip((current - 1) * pageSize)
      // .limit(pageSize)
      .exec();
    // const total = await this.jobLogModel.countDocuments({ jobId: new Types.ObjectId(id) });
    // return {
    //   list: data,
    //   total,
    // }
    return data;
  }

  /**
   * 获取单个任务
   * @param id
   * @returns
   */
  async getOneJob(id: string) {
    const data = await this.jobModel.findOne({ _id: new Types.ObjectId(id) as unknown as ObjectId }).exec();
    return data;
  }

  /**
   * 更新任务payload数据
   * @param id
   * @param payload
   */
  async updateJobDataPayload(id: string, payload: any) {
    await this.jobModel.findByIdAndUpdate(
      new Types.ObjectId(id) as unknown as ObjectId,
      // 只更新 payload 字段
      { $set: { 'data.payload': payload } },
      // 返回更新后的文档
      { new: true },
    );
  }

  /**
   * 动态定义任务
   * 项目的调度任务
   */
  async defineProjectScheduleTask(projectScheduleId: string, interval: string, payload: ProjectAutoWorkflowContextDto) {
    const name = DEFINER_JOB_ENUMS.DYNAMIC_PROJECT_AUTO_WORKFLOW_V1 + ':' + projectScheduleId;
    this.agenda.define(name, async (job: Job<JobExecutionData<ProjectAutoWorkflowContextDto>>, done) => {
      const { data } = job.attrs;
      await this.autoProjectsInsightService.autoWorkflow(data.payload.workflowRecord);
      done?.();
      return true;
    });
    const job = await this.agenda.every(interval, name, {
      payload,
      interval,
      triggerUser: 'system',
      scheduleType: ScheduleTypeEnum.INTERVAL,
      triggerSource: ScheduleTriggerEnum.SYSTEM,
    });
    return job.attrs._id;
  }

  /**
   * 批量删除任务
   */
  async removeJobs(ids: string[]) {
    await this.jobModel.deleteMany({ _id: { $in: ids.map((id) => new Types.ObjectId(id)) } });
  }
}

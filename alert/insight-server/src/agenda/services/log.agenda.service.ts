import { IJobLogStatus } from '../types/agenda-job.type';
import { Injectable } from '@nestjs/common';
import { JobLogDocument } from '../schemas/job-log.schema';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AgendaLogService {
  constructor(@InjectModel('JobLog') private jobLogModel: Model<JobLogDocument>) {
    //
  }

  /**
   * 记录任务日志
   * @param name
   * @param status
   * @param error
   */
  async logTask(name: string, jobId: ObjectId | string, status: IJobLogStatus, data: any, error?: string) {
    // 记录任务日志
    const log = new this.jobLogModel({ name, status, data, error, jobId });
    await log.save();
  }
}

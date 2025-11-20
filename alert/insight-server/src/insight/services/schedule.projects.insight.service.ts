import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProjectWorkflowRecord, ProjectWorkflowRecordDocument } from '../schemas/project-workflow-record.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class ProjectsScheduleInsightService {
  constructor(
    @InjectModel(ProjectWorkflowRecord.name)
    private readonly projectWorkflowRecordModel: Model<ProjectWorkflowRecordDocument>,
  ) {
    //
  }

  /**
   * 获取项目工作流记录
   * @param id
   * @param params
   * @returns
   */
  async getProjectWorkflowRecord(id: string, params: { current: number; pageSize: number }) {
    const { current, pageSize } = params;
    const query = {
      project: new Types.ObjectId(id),
    };
    const list = await this.projectWorkflowRecordModel
      .find(query)
      .populate('nodes')
      .sort({ createdAt: -1 })
      .skip((current - 1) * pageSize)
      .limit(pageSize)
      .exec();
    const total = await this.projectWorkflowRecordModel.countDocuments(query);

    return {
      list,
      total,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProjectWorkflowRecord, ProjectWorkflowRecordDocument } from '../schemas/project-workflow-record.schema';
import { Model, Types } from 'mongoose';
import { ProjectWorkflowRecordNode } from '../schemas/project-workflow-record-node.schema';
import { JobLog, JobLogDocument } from 'src/agenda/schemas/job-log.schema';

@Injectable()
export class ProjectsLogsInsightService {
  constructor(
    @InjectModel(ProjectWorkflowRecord.name)
    private readonly projectWorkflowRecordModel: Model<ProjectWorkflowRecordDocument>,
    @InjectModel(JobLog.name)
    private readonly jobLogModel: Model<JobLogDocument>,
  ) {
    //
  }

  /**
   * 获取项目工作流日志
   * @param id
   * @param params
   * @returns
   */
  async getProjectJobLogs(id: string, params: { current: number; pageSize: number }) {
    const { current, pageSize } = params;
    const records = await this.projectWorkflowRecordModel
      .find({
        project: new Types.ObjectId(id),
      })
      .sort({ createdAt: -1 })
      .populate({
        path: 'nodes',
      })
      .select(['nodes']);
    const _logs = records.map((record) => {
      const l = record.nodes.map((node: ProjectWorkflowRecordNode) => {
        return node.job;
      });
      return l;
    });
    const logs = _logs
      .flat()
      .filter(Boolean)
      .map((log) => new Types.ObjectId(log as unknown as string));
    const list = await this.jobLogModel
      .find({
        jobId: {
          $in: logs,
        },
      })
      .populate('jobId')
      .sort({ createdAt: -1 })
      .skip((current - 1) * pageSize)
      .limit(pageSize)
      .select(['job', 'status', 'createdAt', 'name', '_id']);

    const total = await this.jobLogModel.countDocuments({
      jobId: {
        $in: logs,
      },
    });
    return {
      list,
      total,
    };
  }
}

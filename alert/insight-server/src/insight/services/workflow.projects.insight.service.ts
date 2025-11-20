import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Projects } from '../schemas/projects.schema';
import { Types } from 'mongoose';
import { ProjectWorkflowSchedule } from '../schemas/project-workflow-schedule.schema';

@Injectable()
export class ProjectWorkflowInsightService {
  constructor(
    @InjectModel(Projects.name) private readonly projectModel,
    @InjectModel(ProjectWorkflowSchedule.name) private readonly projectWorkflowScheduleModel,
  ) {
    //
  }

  async getWorkflowList(id: string) {
    const schedule = await this.projectWorkflowScheduleModel.find({ project: new Types.ObjectId(id) }).populate({
      path: 'workflow',
    });
    const project = await this.projectModel.findOne({ _id: new Types.ObjectId(id) }).populate({
      path: 'workflowSchedule',
      populate: {
        path: 'workflow',
      },
    });
    if (!project) {
      throw new Error('项目不存在');
    }
    return schedule;
  }
}

export default ProjectWorkflowInsightService;

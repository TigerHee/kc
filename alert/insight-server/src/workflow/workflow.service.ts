import { ForbiddenException, Injectable } from '@nestjs/common';
import { Workflow, WorkflowDocument } from './schemas/workflow.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RequestWithUser } from 'src/auth/auth.types';
import { UserService } from 'src/auth/services/user.service';
import {
  ProjectWorkflowSchedule,
  ProjectWorkflowScheduleDocument,
} from 'src/insight/schemas/project-workflow-schedule.schema';

@Injectable()
export class WorkflowService {
  constructor(
    @InjectModel(Workflow.name) private workflowModel: Model<WorkflowDocument>,
    @InjectModel(ProjectWorkflowSchedule.name)
    private readonly projectWorkflowScheduleModel: Model<ProjectWorkflowScheduleDocument>,
    private readonly userService: UserService,
  ) {
    //
  }

  async getWorkflowList(params: { current?: number; pageSize?: number }): Promise<{
    list: any[];
    total: number;
  }> {
    const { current = 1, pageSize = 10 } = params;
    const query = {
      isDeleted: false,
    };
    const _list = await this.workflowModel
      .find(query)
      .populate('createdBy')
      .sort({
        createdAt: -1,
      })
      .skip((current - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const projects = await this.projectWorkflowScheduleModel
      .find({
        workflow: {
          $in: _list.map((item) => item._id),
        },
      })
      .select('workflow');

    const list = _list.map((item) => {
      return {
        ...(item?.toJSON() ?? {}),
        relateProjects: projects.filter((project) => project.workflow.toString() === item._id.toString()).length,
      };
    });
    const total = await this.workflowModel.countDocuments(query);
    return {
      list: list,
      total,
    };
  }

  /**
   * 创建一条工作流
   */
  async createWorkflow(req: RequestWithUser, data: WorkflowDocument) {
    const { user } = req;
    try {
      const _user = await this.userService.getUserByEmail(user.email);
      return await this.workflowModel.create({
        ...data,
        createdBy: _user._id,
      });
    } catch (error) {
      throw new ForbiddenException('用户不存在:' + error.message);
    }
  }

  /**
   * 删除一条工作流
   */
  async deleteWorkflow(id) {
    return this.workflowModel
      .updateOne(
        {
          _id: id,
        },
        {
          updatedAt: new Date(),
          isDeleted: true,
        },
      )
      .exec();
  }

  /**
   * 更新一条工作流
   */
  async updateWorkflow(id, data: WorkflowDocument) {
    return this.workflowModel
      .updateOne(
        { _id: id },
        {
          ...data,
          updatedAt: new Date(),
        },
      )
      .exec();
  }

  /**
   * 获取一条工作流
   * @param id
   * @returns
   */
  async getWorkflowById(id: string): Promise<WorkflowDocument> {
    const data = await this.workflowModel.findById(id);
    return data;
  }

  /**
   * 获取工作流选项
   */
  async getWorkflowOptions() {
    const data = await this.workflowModel.find({
      isDeleted: false,
    });
    return data.map((item) => {
      return {
        label: item.name,
        value: item._id,
        desc: item.desc,
      };
    });
  }
}

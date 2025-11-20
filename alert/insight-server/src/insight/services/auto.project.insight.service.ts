import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  ProjectWorkflowRecordNode,
  ProjectWorkflowRecordNodeDocument,
} from '../schemas/project-workflow-record-node.schema';
import { InvokeAgendaService } from 'src/agenda/services/invoke.agenda.service';
import { ScheduleTriggerEnum } from 'src/agenda/types';
import { ProjectWorkflowRecord, ProjectWorkflowRecordDocument } from '../schemas/project-workflow-record.schema';
import { Projects, ProjectsDocument } from '../schemas/projects.schema';
import { convertObjectIdToString } from 'src/agenda/utils/compatible';
import { ProjectWorkflowSchedule, ProjectWorkflowScheduleDocument } from '../schemas/project-workflow-schedule.schema';

@Injectable()
export class AutoProjectsInsightService {
  constructor(
    @InjectModel(ProjectWorkflowRecord.name)
    private readonly projectWorkflowRecordModel: Model<ProjectWorkflowRecordDocument>,
    @InjectModel(ProjectWorkflowRecordNode.name)
    private readonly projectWorkflowRecordNodeModel: Model<ProjectWorkflowRecordNodeDocument>,
    @InjectModel(Projects.name)
    private readonly projectsModel: Model<ProjectsDocument>,
    @InjectModel(ProjectWorkflowSchedule.name)
    private readonly projectWorkflowScheduleModel: Model<ProjectWorkflowScheduleDocument>,
    private readonly invokeAgendaService: InvokeAgendaService,
  ) {
    //
  }

  /**
   * 自动执行项目的工作流
   * @param workflowRecord
   */
  async autoWorkflow(_workflowRecord: string) {
    // console.log('autoWorkflow._workflowRecord', _workflowRecord);
    const workSchedule = await this.projectWorkflowScheduleModel
      .findOne({
        workflowRecord: {
          $in: [new Types.ObjectId(_workflowRecord)],
        },
      })
      .exec();

    // 当前的最新的record _id
    const workflowRecord = workSchedule.workflowRecord.pop().toString();
    // console.log('autoWorkflow.workflowRecord', workflowRecord);

    const record: ProjectWorkflowRecordDocument = await this.projectWorkflowRecordModel
      .findById(workflowRecord)
      .populate('nodes')
      .exec();

    const currentStep = record.currentStep;
    if (record.nodes?.length <= currentStep) {
      // 当前记录已经执行完毕
      console.log('流水线执行完成：', currentStep + '/' + record.nodes.length);

      // 更新当前record的状态为true
      await this.projectWorkflowRecordModel.updateOne(
        {
          _id: workflowRecord,
        },
        {
          status: true,
        },
      );

      // 以最近的一个record node 创建新的record node
      const _newWorkflowRecordNode = await this.projectWorkflowRecordNodeModel.insertMany(
        (record.nodes as ProjectWorkflowRecordNode[]).map((node) => {
          return {
            name: node.name,
            desc: node.desc,
            status: false,
            job: null,
          };
        }),
      );
      // 以最近的一个record 创建新的 record
      const _newWorkflowRecord = await this.projectWorkflowRecordModel.create({
        name: record.name,
        project: record.project,
        nodes: _newWorkflowRecordNode.map((node) => node._id),
      });

      // 更新workflowSchedule的workflowRecord, 添加新的record
      await this.projectWorkflowScheduleModel.updateOne(
        {
          _id: workSchedule._id,
        },
        {
          $push: {
            workflowRecord: _newWorkflowRecord._id,
          },
        },
      );
      console.log('新的记录已经创建');
      return;
    }

    const nodes = record.nodes as ProjectWorkflowRecordNode[];

    if (nodes[currentStep].status) {
      // 更新record的当前步骤的
      await this.projectWorkflowRecordModel.updateOne(
        {
          _id: workflowRecord,
        },
        {
          currentStep: currentStep + 1,
        },
      );
      // 继续调度
      await this.autoWorkflow(workflowRecord);
      return;
    } else {
      // 获取项目信息
      const _project = await this.projectsModel
        .findById(record.project)
        .populate({
          path: 'owner',
          select: ['name', 'email'],
        })
        .populate('repos')
        .populate({
          path: 'workflowSchedule',
          select: ['_id', 'job', 'interval', 'createdAt'],
          populate: [
            // {
            //   path: 'workflowRecord',
            //   options: {
            //     sort: {
            //       createdAt: -1,
            //     },
            //     limit: 1,
            //   },
            //   populate: [
            //     {
            //       path: 'nodes',
            //     },
            //   ],
            // },
            {
              path: 'workflow',
            },
          ],
        })
        .select([
          'name',
          'owner',
          'repos',
          'accessibleLink',
          'isDeleted',
          'updatedAt',
          'createdAt',
          'status',
          'workflowSchedule',
        ])
        .lean();

      // 移除ObjectId, 以兼容旧版本
      // ----------------------------------------------
      // const project = convertObjectIdToString(_project.toJSON());
      // project.workflowSchedule.map((item) => {
      //   item.workflowRecord.map((record) => {
      //     delete record.project;
      //     delete record.workflow;
      //   });
      // });
      // delete project.workflowSchedule.project;
      // const project = JSON.parse(JSON.stringify(_project));
      const project = JSON.parse(
        JSON.stringify(_project, (key, value) => {
          // 如果是 ObjectId，转换为字符串
          return value instanceof Types.ObjectId ? value.toString() : value;
        }),
      );
      // ----------------------------------------------
      // console.log('project', JSON.parse(JSON.stringify(_project)));
      // console.log('project', JSON.stringify(project, null, 2));
      // console.log('project', project);

      // 发起一个调度任务
      console.log('流水线进度：', currentStep + '/' + nodes.length);
      const node = record.nodes[currentStep] as ProjectWorkflowRecordNode;
      const jobId = await this.invokeAgendaService.callTaskImmediate(node.name, {
        payload: {
          workflowRecord,
          project,
        },
        triggerUser: 'project-workflow',
        triggerSource: ScheduleTriggerEnum.SYSTEM,
      });

      // 更新当前步骤的Node的jobId
      await this.projectWorkflowRecordNodeModel.updateOne(
        {
          _id: node._id,
        },
        {
          job: new Types.ObjectId(jobId.toString()),
        },
      );
    }
  }

  /**
   * 当前步骤完成
   * @param workflowRecord
   */
  async currentStepFinish(_workflowRecord: string) {
    // console.log('currentStepFinish._workflowRecord', _workflowRecord);
    const workSchedule = await this.projectWorkflowScheduleModel.findOne({
      workflowRecord: new Types.ObjectId(_workflowRecord),
    });
    const workflowRecord = (workSchedule.workflowRecord as Types.ObjectId[]).pop().toString();
    // console.log('currentStepFinish.workflowRecord', workflowRecord);
    const _record = await this.projectWorkflowRecordModel.findById(workflowRecord);
    const record = convertObjectIdToString(_record.toJSON());
    const currentStep = record.currentStep;
    const currentNode = record.nodes[currentStep] as ProjectWorkflowRecordNode;

    // 更新record的当前步骤的
    await this.projectWorkflowRecordModel.updateOne(
      {
        _id: workflowRecord,
      },
      {
        currentStep: currentStep + 1,
      },
    );

    // 更新node的状态true
    await this.projectWorkflowRecordNodeModel.updateOne(
      {
        _id: currentNode._id,
      },
      {
        status: true,
      },
    );

    // 继续调度
    await this.autoWorkflow(workflowRecord.toString());
  }
}

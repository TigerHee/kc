import { WorkflowService } from './../../workflow/workflow.service';
import { NotificationTeamsService } from 'src/notification/services/teams.notification.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InsightSecretReplaceJobDto } from 'src/agenda/dto/schedule-job-payload.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Projects, ProjectsDocument } from '../schemas/projects.schema';
import { Model, Types } from 'mongoose';
import { InsightReposService } from './repos.insight.service';
import { Routes, RoutesDocument } from '../schemas/route.schema';
import { UserService } from 'src/auth/services/user.service';
import { PuppeteerService } from 'src/puppeteer/services/puppeteer.service';
import { CreateProjectDto, CreateProjectSchedule } from '../dto/create-project.dto';
import { ProjectWorkflowRecord, ProjectWorkflowRecordDocument } from '../schemas/project-workflow-record.schema';
import { ProjectWorkflowSchedule, ProjectWorkflowScheduleDocument } from '../schemas/project-workflow-schedule.schema';
import { AgendaJobsService } from 'src/agenda/services/jobs.agenda.service';
import { plainToInstance } from 'class-transformer';
import { ProjectWorkflowRecordNode } from '../schemas/project-workflow-record-node.schema';
import { BitbucketPackageService } from 'src/bitbucket/services/package.bitbucket.service';
import { PackageJsScanDocument } from 'src/bitbucket/schemas/package-json-scans.schema';
import { BitbucketOfflineService } from 'src/bitbucket/services/offline.bitbucket.service';
import { BitbucketJscramblerService } from 'src/bitbucket/services/jscrambler.bitbucket.service';
import { NotificationLarkService } from 'src/notification/services/lark.notification.service';
import { UserDocument } from 'src/auth/schemas/user.schema';

@Injectable()
export class InsightProjectsService {
  constructor(
    private readonly notificationTeamsService: NotificationTeamsService,
    private readonly insightReposService: InsightReposService,
    private readonly workflowService: WorkflowService,
    private readonly userService: UserService,
    private readonly puppeteerService: PuppeteerService,
    private readonly agendaJobsService: AgendaJobsService,
    private readonly bitbucketJscramblerService: BitbucketJscramblerService,
    private readonly bitbucketOfflineService: BitbucketOfflineService,
    private readonly bitbucketPackageService: BitbucketPackageService,
    private readonly notificationLarkService: NotificationLarkService,
    @InjectModel(Projects.name)
    private readonly projectsModel: Model<ProjectsDocument>,
    @InjectModel(Routes.name)
    private readonly routeModel: Model<RoutesDocument>,
    @InjectModel(ProjectWorkflowSchedule.name)
    private readonly projectWorkflowScheduleModel: Model<ProjectWorkflowScheduleDocument>,
    @InjectModel(ProjectWorkflowRecord.name)
    private readonly projectWorkflowRecordModel: Model<ProjectWorkflowRecordDocument>,
    @InjectModel(ProjectWorkflowRecordNode.name)
    private readonly projectWorkflowRecordNodeModel: Model<ProjectWorkflowRecordNode>,
  ) {
    //
  }

  private async _create(data: CreateProjectDto) {
    const projectWorkflowSchedule = [];
    const projectWorkflowRecord = [];
    const _workflow = data?.workflow ?? [];
    const _schedule = plainToInstance(CreateProjectSchedule, data?.schedule ?? []);
    // 创建项目的工作流调度
    for (const _w of _workflow) {
      if (_schedule.hasOwnProperty(_w)) {
        // 获取工作流实体
        const workflow = await this.workflowService.getWorkflowById(_w);

        // 创建工作流记录节点
        const workflowRecordNode = workflow.node.map((node) => ({
          name: node.name,
          desc: node.desc,
          status: false,
          job: null,
        }));
        const _newWorkflowRecordNode = await this.projectWorkflowRecordNodeModel.insertMany(workflowRecordNode);

        // 创建工作流记录
        const workflowRecord = {
          project: null,
          currentStep: 0,
          nodes: _newWorkflowRecordNode.map((node) => node._id),
          status: false,
          name: workflow.name,
          createdAt: new Date(),
        };
        const _newWorkflowRecord = await new this.projectWorkflowRecordModel(workflowRecord).save();
        projectWorkflowRecord.push(_newWorkflowRecord._id);

        // 创建工作流的调度
        const workflowSchedule = {
          project: null,
          job: null,
          workflow: new Types.ObjectId(_w),
          interval: _schedule[_w],
          workflowRecord: [_newWorkflowRecord._id],
        };

        // 创建工作流调度
        const _newWorkflowSchedule = await new this.projectWorkflowScheduleModel(workflowSchedule).save();
        projectWorkflowSchedule.push(_newWorkflowSchedule._id);

        const jobId = await this.agendaJobsService.defineProjectScheduleTask(
          workflowSchedule.workflowRecord.toString(),
          _schedule[_w],
          {
            workflowRecord: _newWorkflowRecord._id.toString(),
          },
        );
        workflowSchedule.job = jobId;

        // 更新工作流调度的任务ID
        await this.projectWorkflowScheduleModel.findByIdAndUpdate(_newWorkflowSchedule._id, {
          job: new Types.ObjectId(jobId.toString()),
        });
      }
    }
    return {
      projectWorkflowRecord,
      projectWorkflowSchedule,
    };
  }

  /**
   * 创建项目
   * @param data
   * @returns
   */
  async create(data: CreateProjectDto): Promise<any> {
    const isExist = await this.projectsModel
      .findOne({ repos: new Types.ObjectId(data.repos), isDeleted: false })
      .exec();
    if (isExist) {
      throw new BadRequestException('项目已存在');
    }

    try {
      const { projectWorkflowSchedule, projectWorkflowRecord } = await this._create(data);

      // 获取仓库信息
      const _repos = await this.insightReposService.getRepo(data.repos.toString());

      // 创建项目
      const projectData = {
        name: _repos.name,
        repos: new Types.ObjectId(data.repos),
        owner: new Types.ObjectId(data.owner),
        workflowSchedule: projectWorkflowSchedule,
      };
      const newProject = await new this.projectsModel(projectData).save();

      // 更新对应的记录的项目信息
      await this.projectWorkflowRecordModel.updateMany(
        {
          _id: {
            $in: projectWorkflowRecord,
          },
        },
        {
          project: newProject._id,
        },
      );

      // 更新对应调度的项目信息
      await this.projectWorkflowScheduleModel.updateMany(
        {
          _id: {
            $in: projectWorkflowSchedule,
          },
        },
        {
          project: newProject._id,
        },
      );

      // 更新路由的，项目信息
      await this.routeModel.updateMany(
        {
          projectName: _repos.name,
        },
        {
          owner: data.owner,
          project: newProject._id,
          updatedAt: new Date(),
        },
      );
    } catch (error) {
      // 发生错误时回滚事务
      // 抛出错误以供进一步处理或日志记录
      throw error;
    }
  }

  /**
   * 更新项目
   * @param id
   * @param data
   * @returns
   */
  async update(id: string, data: CreateProjectDto): Promise<ProjectsDocument> {
    const _project = await this.projectsModel.findById(new Types.ObjectId(id)).populate({
      path: 'workflowSchedule',
    });

    // 当前项目的所有Job任务
    const scheduleJobs = _project.workflowSchedule.map((schedule) => schedule.job);
    await this.agendaJobsService.removeJobs(scheduleJobs);

    // 批量删除任务的调度
    await this.projectWorkflowScheduleModel.deleteMany({
      project: new Types.ObjectId(id),
    });

    const { projectWorkflowSchedule, projectWorkflowRecord } = await this._create(data);

    // 获取仓库信息
    const _repos = await this.insightReposService.getRepo(data.repos.toString());

    const res = this.projectsModel
      .findByIdAndUpdate(
        id,
        {
          name: _repos.name,
          accessibleLink: data?.accessibleLink ?? '',
          repos: new Types.ObjectId(data.repos),
          owner: new Types.ObjectId(data.owner),
          workflowSchedule: projectWorkflowSchedule,
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();

    // 更新对应的记录的项目信息
    await this.projectWorkflowRecordModel.updateMany(
      {
        _id: {
          $in: projectWorkflowRecord,
        },
      },
      {
        project: new Types.ObjectId(id),
      },
    );

    // 更新对应调度的项目信息
    await this.projectWorkflowScheduleModel.updateMany(
      {
        _id: {
          $in: projectWorkflowSchedule,
        },
      },
      {
        project: new Types.ObjectId(id),
      },
    );

    // 更新路由的，项目信息
    await this.routeModel.updateMany(
      {
        projectName: _repos.name,
      },
      {
        owner: data.owner,
        project: new Types.ObjectId(id),
        updatedAt: new Date(),
      },
    );
    return res;
  }

  /**
   * 删除项目
   * @param id
   * @returns
   */
  async delete(id: string): Promise<ProjectsDocument> {
    // 删除项目的所有任务的调度
    const _project = await this.projectsModel
      .findById(new Types.ObjectId(id))
      .populate({
        path: 'workflowSchedule',
      })
      .exec();
    const scheduleJobs = _project.workflowSchedule.map((schedule) => schedule.job);
    await this.agendaJobsService.removeJobs(scheduleJobs);

    return this.projectsModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).exec();
  }

  /**
   * 查询所有项目
   * @returns
   */
  async findAll(query?: { current?: number; pageSize?: number }): Promise<{
    list: ProjectsDocument[];
    total: number;
  }> {
    const { current = 1, pageSize = 10 } = query;
    const list = await this.projectsModel
      .find({ isDeleted: false })
      .populate('repos')
      .populate('owner')
      .populate({
        path: 'workflowSchedule',
        populate: [
          {
            path: 'workflowRecord',
            // 只取数组的最后一条record
            options: {
              sort: {
                createdAt: -1,
              },
              limit: 1,
            },
            populate: [
              {
                path: 'nodes',
              },
            ],
          },
          {
            path: 'workflow',
            populate: {
              path: 'createdBy',
            },
          },
        ],
      })
      .sort({ createdAt: -1 })
      .skip((current - 1) * pageSize)
      .limit(pageSize)
      .exec();
    const total = await this.projectsModel.countDocuments({
      isDeleted: false,
    });
    return {
      list,
      total,
    };
  }

  /**
   * 查询单个项目
   * @param id
   * @returns
   */
  async findOne(id: string | Types.ObjectId): Promise<ProjectsDocument> {
    return this.projectsModel.findOne({ _id: id, isDeleted: false }).exec();
  }

  /**
   * 查询单个项目（通过名字）
   * @param id
   * @returns
   */
  async findOneByName(name: string): Promise<ProjectsDocument> {
    const data = await this.projectsModel
      .findOne({ name, isDeleted: false })
      .populate('repos')
      .populate({
        path: 'workflowSchedule',
        populate: [
          {
            path: 'workflow',
          },
        ],
      })
      .populate('owner')
      .exec();
    return data;
  }

  /**
   * 通知Insight Secret 需要更换
   * @param data
   */
  async replaceSecretNotify(data: InsightSecretReplaceJobDto) {
    const { keyName, user } = data;
    // TODO: ---deprecated---
    await this.notificationTeamsService.sendMessageToUser(
      `<div><b>即将过期通知</b><br /></div><div>INSIGHT密钥「${keyName}」需要更换的</div>`,
      user,
    );
    await this.notificationLarkService.sendKeyChangeInform(
      {
        keyName,
      },
      user,
    );
  }

  /**
   * 获取项目配置列表
   */
  async getProjectsOptions() {
    const projects = await this.projectsModel
      .find(
        {
          isDeleted: false,
        },
        { _id: 1, name: 1 },
      )
      .exec();
    return projects.map((project) => ({
      value: project._id,
      label: project.name,
    }));
  }

  /**
   * 查询用户相关的项目
   * @param owner
   * @returns
   */
  async findUserRelatedProjects(owner: string) {
    // 返回 name 字段
    return this.projectsModel.find({ owner, isDeleted: false }).select(['accessibleLink', 'name', 'updatedAt']).exec();
  }

  /**
   * 更新路由数据
   * @param project
   * @returns
   */
  async updateRoutes(project: ProjectsDocument) {
    const { name: projectName, accessibleLink, owner } = project;
    const newRoutes = await this.puppeteerService.getProjectRoutes({
      projectName,
      accessibleLink,
    });
    const oldRoutes = await this.routeModel.find({ projectName, isDeleted: false }).lean().exec();
    // 计算差异
    const { routesToUpdate, routesToAdd } = await this.puppeteerService.diffRoutes(oldRoutes, newRoutes);
    // 批量操作
    const bulkOperations = [];

    // 更新需要修改的路由
    routesToUpdate.forEach((route) => {
      bulkOperations.push({
        updateOne: {
          filter: { _id: route._id },
          update: { $set: route },
        },
      });
    });

    // 新增需要插入的路由
    routesToAdd.forEach((route) => {
      bulkOperations.push({
        insertOne: {
          document: { project, projectName, user: owner, ...route },
        },
      });
    });

    // 执行批量操作
    if (bulkOperations.length > 0) {
      await this.routeModel.bulkWrite(bulkOperations);
    }
    if (routesToAdd.length > 0) {
      const user = await this.userService.getUserById(owner as unknown as string);
      return {
        projectName,
        count: routesToAdd.length,
        owner: user.email,
      };
    }
    await this.projectsModel.findByIdAndUpdate(project._id, {
      updatedAt: new Date(),
      metaRoutes: {
        status: true,
        total: newRoutes.length,
        routes: newRoutes.map((route) => route.path),
        updatedAt: new Date(),
      },
    });
  }

  /**
   * 刷新项目的路由列表
   * @param id
   * @returns
   */
  async refreshOneProjectRoute(id: string | Types.ObjectId) {
    const project = await this.findOne(id);
    return await this.updateRoutes(project);
  }

  /**
   * 刷新所有项目的路由列表
   * @returns
   */
  async refreshAllProjectRoute() {
    const projects = await this.projectsModel
      .find({ isDeleted: false, accessibleLink: { $exists: true, $ne: '' } })
      .exec();
    const reports = [];
    for (const project of projects) {
      const result = await this.updateRoutes(project);
      if (result) {
        reports.push(result);
      }
    }
    if (reports.length > 0) {
      // TODO: ---deprecated---
      await this.notificationTeamsService.sendProjectsRoutesReport(reports);
      await this.notificationLarkService.sendRouteNotExistReport({
        route_table: reports.map((item) => ({
          user: item.owner,
          route: item.projectName,
          count: item.count,
        })),
      });
    }
    // 检查是否存在未配置可访问链接的路由
    const noAccessibleLinRoute = await this.routeModel
      .find({
        isIgnore: false,
        isDeleted: false,
        accessibleLink: '',
      })
      .populate('user')
      .exec();

    if (noAccessibleLinRoute.length > 0) {
      // TODO: ---deprecated---
      await this.notificationTeamsService.sendRoutesUnConfiguredReport(noAccessibleLinRoute);
      await this.notificationLarkService.sendRouteUnlinkReport({
        route_table: noAccessibleLinRoute.map((item) => ({
          user: (item.user as UserDocument).email,
          route: item.path,
        })),
      });
    }
  }

  /**
   * 获取项目的路由列表
   * 查询项目下的所有路由，并计算路由数量
   * @returns
   */
  async gatherRoute(params: {
    current?: number;
    pageSize?: number;
    route: string;
    owner: string;
    createdAt: [Date, Date];
    updatedAt: [Date, Date];
  }) {
    const { current = 1, pageSize = 10, route, owner, createdAt, updatedAt } = params;
    const query = {};
    if (route) {
      query['routes.path'] = { $regex: new RegExp(route, 'i') };
    }
    if (owner) {
      query['owner._id'] = new Types.ObjectId(owner);
    }
    if (createdAt) {
      query['createdAt'] = {
        $gte: new Date(createdAt[0]),
        $lte: new Date(createdAt[1]),
      };
    }
    if (updatedAt) {
      query['updatedAt'] = {
        $gte: new Date(updatedAt[0]),
        $lte: new Date(updatedAt[1]),
      };
    }
    const data = await this.projectsModel
      .aggregate([
        {
          $lookup: {
            from: 'users', // 目标集合
            localField: 'owner', // 当前集合的字段
            foreignField: '_id', // 目标集合的字段
            as: 'owner', // 输出字段的名称
          },
        },
        {
          $unwind: {
            path: '$owner', // 解构数组
            preserveNullAndEmptyArrays: true, // 如果没有匹配项时保留原项
          },
        },
        {
          $lookup: {
            from: 'routes',
            localField: 'name',
            foreignField: 'projectName',
            as: 'routes',
          },
        },
        {
          $match: {
            isDeleted: {
              $eq: false,
            },
            // routes 数组长度大于0
            'routes.0': {
              $exists: true,
            },
            ...query,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $skip: (current - 1) * pageSize,
        },
        {
          $project: {
            _id: 1,
            name: 1,
            owner: 1,
            createdAt: 1,
            updatedAt: 1,
            route: 1,
            accessibleLink: 1,
            routes: {
              _id: 1,
              title: 1,
              project: 1,
              projectName: 1,
              user: 1,
              tenant: 1,
              path: 1,
              accessibleLink: 1,
              isNeedLogin: 1,
              competitor: 1,
              isIgnore: 1,
              originalOwner: 1,
            },
            routesCount: { $size: '$routes' },
          },
        },
        {
          $limit: Number(pageSize),
        },
      ])
      .exec();
    // .explain();
    const total = await this.projectsModel.countDocuments({
      isDeleted: false,
    });
    return {
      list: data,
      total,
    };
  }

  /**
   * 获取项目路由详情
   */
  async getProjectRouteDetail(projectName: string) {
    const project = await this.projectsModel.findOne({ name: projectName }).exec();
    const routes = await this.routeModel.find({ project: project._id }).populate('user').exec();
    return routes;
  }

  /**
   * 获取项目依赖
   * @param name
   */
  async getProjectDepsDetail(name: string): Promise<{
    report: PackageJsScanDocument;
    meta: {
      status: boolean;
      total: number;
    };
  }> {
    const project = await this.projectsModel.findOne({ name }).select(['metaDeps', 'name']).exec();
    const report = await this.bitbucketPackageService.getLatestPackageJsonScanResultByRepoName(project.name);
    return {
      report,
      meta: project.metaDeps,
    };
  }

  /**
   * 获取项目离线配置
   * @param name
   */
  async getProjectOfflineDetail(name: string): Promise<any> {
    const project = await this.projectsModel.findOne({ name }).select(['metaOfflineAppV3', 'name']).exec();
    const report = await this.bitbucketOfflineService.getLatestOfflineContentScanResultByRepoName(project.name);
    return {
      meta: project.metaOfflineAppV3,
      report,
    };
  }

  /**
   * 获取项目 jscrambler 配置
   * @param name
   */
  async getProjectJscramblerDetail(name: string): Promise<any> {
    const project = await this.projectsModel.findOne({ name }).select(['metaJscrambler', 'name']).exec();
    const report = await this.bitbucketJscramblerService.getLatestJscramblerContentScanResultByRepoName(project.name);
    return {
      meta: project.metaJscrambler,
      report,
    };
  }
}

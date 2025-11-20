import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tasks, TasksDocument, TasksRequestDocument } from '../schemas/tasks.schema';
import { RequestWithUser } from 'src/auth/auth.types';
import { UserService } from 'src/auth/services/user.service';
import { Types } from 'mongoose';
import { ConfluenceDocumentService } from 'src/confluence/services/confluence.page.service';
import { ReposDocument } from '../schemas/repos.schema';
import { UserDocument } from 'src/auth/schemas/user.schema';
import { generate } from 'random-words-commonjs';
import { BLACK_HOLE_TASK_ID, CURRENT_WIKI_CHECKER_VERSION } from '../constants/tasks.constant';

/**
 * insight 前端任务列表
 */
@Injectable()
export class InsightTasksServices {
  constructor(
    private readonly userService: UserService,
    private readonly confluenceDocumentService: ConfluenceDocumentService,
    @InjectModel(Tasks.name) private readonly insightTasksModel,
  ) {
    //
  }

  private genTaskId(): string {
    const random = generate({
      exactly: 1,
      wordsPerString: 2,
      separator: '-',
      maxLength: 6,
      minLength: 4,
    })[0];
    return `t-${random}`;
  }

  /**
   * 查询所有任务
   * @returns
   */
  async findAll(
    req: RequestWithUser,
    params: {
      scope: 'all' | 'self';
      current?: number;
      pageSize?: number;
      name: string;
      user: string[];
      status: string;
      taskId: string;
      createdAt: [string, string];
    },
  ): Promise<{
    list: TasksDocument[];
    total: number;
    allTotal: number;
    selfTotal: number;
  }> {
    const { current = 1, pageSize = 10, scope = 'all', status, name, user, taskId, createdAt } = params;
    const { user: _req_user } = req;
    const _user = await this.userService.getUserByEmail(_req_user.email);
    const userId = _user._id;
    const query = {
      isDeleted: false,
    };
    if (scope === 'self') {
      query['user'] = userId;
    }
    if (name) {
      query['taskName'] = { $regex: new RegExp(name, 'i') };
    }
    if (scope === 'all' && user) {
      query['user'] = { $in: user.map((u) => new Types.ObjectId(u)) };
    }
    if (status !== undefined) {
      query['status'] = status === 'true';
    }
    if (taskId) {
      query['taskId'] = { $regex: new RegExp(taskId, 'i') };
    }
    if (createdAt) {
      query['createdAt'] = {
        $gte: new Date(createdAt[0].replace('"', '').replace('"', '')),
        $lte: new Date(createdAt[1].replace('"', '').replace('"', '')),
      };
    }
    const list = await this.insightTasksModel
      .find(query)
      .populate('user')
      .populate('involveRepos')
      .populate('involveUsers')
      .sort({ createdAt: -1 })
      .skip((current - 1) * pageSize)
      .limit(pageSize)
      .exec();
    const total = await this.insightTasksModel.countDocuments(query);
    const allTotal = await this.insightTasksModel.countDocuments({
      isDeleted: false,
    });
    const selfTotal = await this.insightTasksModel.countDocuments({
      isDeleted: false,
      user: userId,
    });
    return {
      list,
      total,
      allTotal,
      selfTotal,
    };
  }

  /**
   * 查询单个任务
   * @param id
   * @returns
   */
  async findOne(id: string): Promise<TasksDocument> {
    return (
      this.insightTasksModel
        .findOne({ _id: id, isDeleted: false })
        .populate('user')
        // .populate('workflow')
        // .populate('workflowRecord')
        .populate('involveRepos')
        .populate('involveUsers')
        .exec()
    );
  }

  /**
   * 根据 taskId 查询任务并更新信息（仓库和 Wiki）
   * @param taskId
   * @param slug 仓库标识
   * @param author 提交人
   * @returns 更新后的任务文档
   */
  async getTaskWithUpdatedInfo(taskId: string, repo: ReposDocument, user: UserDocument): Promise<TasksDocument> {
    const task = await this.insightTasksModel.findOne({ taskId, isDeleted: false }).exec();

    if (!task) {
      return null;
    }

    const { involveRepos, involveUsers, wiki } = task;

    let updatedInvolveRepos = involveRepos;
    let updatedInvolveUsers = involveUsers;
    // 检查是否需要追加仓库
    if (repo) {
      const repoExists = involveRepos.some((id) => id.equals(repo._id));
      if (!repoExists) {
        updatedInvolveRepos = [...involveRepos, repo._id];
      }
    }
    // 检查是否需要追加使用人
    if (user) {
      const userExists = involveUsers.some((id) => id.equals(user._id));
      if (!userExists) {
        updatedInvolveUsers = [...involveUsers, user._id];
      }
    }

    // 如果 Wiki 状态未通过，更新 Wiki 数据
    let updatedWiki = wiki;
    if (!wiki?.status) {
      updatedWiki = await this.confluenceDocumentService.getWikiData(wiki?.pageId, task.wikiCheckerVersion ?? 1);
    }

    // 如果 Wiki 需要 H5 审核，且 H5 审核状态为未通过，更新 Wiki 数据
    if (
      wiki?.status &&
      wiki?.needH5Audit !== undefined &&
      wiki?.needH5Audit !== null
      // &&
      // wiki?.h5AuditStatus === false
    ) {
      updatedWiki = await this.confluenceDocumentService.getWikiData(wiki?.pageId, task.wikiCheckerVersion ?? 1);
    }

    // 合并更新一次数据库
    return this.insightTasksModel
      .findByIdAndUpdate(
        task._id,
        {
          involveUsers: updatedInvolveUsers,
          involveRepos: updatedInvolveRepos,
          wiki: updatedWiki,
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();
  }

  /**
   * 根据 taskId 查询任务
   */
  async findOneByJobId(taskId: string): Promise<TasksDocument | { wiki: { status: boolean } }> {
    if (taskId === BLACK_HOLE_TASK_ID) {
      return {
        wiki: {
          status: true,
        },
      };
    }
    const task = (await this.insightTasksModel.findOne({
      taskId,
    })) as TasksDocument;
    if (!task) {
      return null;
    }
    const { wiki } = task;
    // 如果 Wiki 状态未通过，更新 Wiki 数据
    let updatedWiki = wiki;
    if (!wiki?.status) {
      updatedWiki = await this.confluenceDocumentService.getWikiData(wiki?.pageId, task.wikiCheckerVersion ?? 1);
      return this.insightTasksModel
        .findByIdAndUpdate(
          task._id,
          {
            wiki: updatedWiki,
            updatedAt: new Date(),
          },
          { new: true },
        )
        .exec();
    }
    return task;
  }

  /**
   * 创建任务
   * @param data
   * @returns
   */
  async create(req: RequestWithUser, data: TasksRequestDocument) {
    const { user } = req;
    const _user = await this.userService.getUserByEmail(user.email);
    if (!_user) {
      throw new Error('用户不存在');
    }
    const { wikiPageId, taskName, taskId } = data;
    const wiki = await this.confluenceDocumentService.getWikiData(wikiPageId, CURRENT_WIKI_CHECKER_VERSION);
    if (wiki.title === undefined) {
      throw new Error('wiki 页面不存在');
    }
    const _newTasks = new this.insightTasksModel({
      taskId: taskId === '' || taskId === null || taskId === undefined ? this.genTaskId() : taskId,
      taskName: taskName === undefined || taskName === '' || taskName === null ? wiki.title : taskName,
      /**
       * 当前 Wiki 检查器版本
       */
      wikiCheckerVersion: CURRENT_WIKI_CHECKER_VERSION,
      wiki,
      user: _user._id,
    });

    const newTasks = await _newTasks.save();
    return newTasks;
  }

  /**
   * 更新任务
   * @param id
   * @param data
   * @returns
   */
  async update(id: string, data: TasksRequestDocument): Promise<TasksDocument> {
    const { wikiPageId } = data;
    // 先查找任务文档，获取 pageId
    const task = (await this.insightTasksModel.findById(id).exec()) as TasksDocument;
    const wiki = await this.confluenceDocumentService.getWikiData(wikiPageId, task.wikiCheckerVersion ?? 1);
    return this.insightTasksModel
      .findByIdAndUpdate(
        id,
        {
          ...data,
          wiki,
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();
  }

  /**
   * 刷新任务
   * @param id
   * @returns
   */
  async refresh(id: string): Promise<TasksDocument> {
    // 先查找任务文档，获取 pageId
    const task = (await this.insightTasksModel.findById(id).exec()) as TasksDocument;

    const wikiPageId = task.wiki?.pageId;
    // 获取 wiki 数据
    const wiki = await this.confluenceDocumentService.getWikiData(wikiPageId, task.wikiCheckerVersion ?? 1);

    // 更新任务文档
    return this.insightTasksModel
      .findByIdAndUpdate(
        id,
        {
          wiki,
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();
  }

  /**
   * 删除任务
   * @param id
   * @returns
   */
  async softDelete(id: string): Promise<TasksDocument> {
    return this.insightTasksModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).exec();
  }

  /**
   * 查询我的任务
   * @param email
   * @returns
   */
  async findMyTasks(email: string): Promise<TasksDocument[]> {
    const user = await this.userService.getUserByEmail(email);
    return this.insightTasksModel.find({ user: user._id, isDeleted: false }).sort({ createdAt: -1 }).exec();
  }

  /**
   * 根据 Wiki PageId 查询任务
   * @param wikiPageIds
   * @returns
   */
  async getTaskByWikis(wikiPageIds: number[]): Promise<TasksDocument[]> {
    return await this.insightTasksModel
      .find({
        'wiki.pageId': { $in: wikiPageIds },
        isDeleted: false,
      })
      .exec();
  }
}

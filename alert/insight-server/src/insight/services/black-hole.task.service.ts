import { InsightReposService } from './repos.insight.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlackHoleCommit, BlackHoleCommitType } from '../schemas/black-hole-commit.tasks.schema';
import { BLACK_HOLE_TASK_ID } from '../constants/tasks.constant';
import { Model, Types } from 'mongoose';

@Injectable()
export class BlackHoleTaskService {
  constructor(
    @InjectModel(BlackHoleCommit.name) private blackHoleCommitModel: Model<BlackHoleCommit>,
    private readonly InsightReposService: InsightReposService,
  ) {
    //
  }

  /**
   * 获取任务信息
   * @returns
   */
  async getTasksInfo() {
    const repo_list = await this.InsightReposService.getAllRepos({ current: 1, pageSize: 1000 });
    const repos_res = await this.blackHoleCommitModel.aggregate([
      { $group: { _id: '$slug' } },
      { $project: { _id: 0, repos: '$_id' } },
      {
        $lookup: {
          from: 'repos',
          localField: 'repos',
          foreignField: 'slug',
          as: 'repos',
        },
      },
      {
        $project: {
          _id: 0,
          repos: {
            _id: 1,
            slug: 1,
            name: 1,
            description: 1,
          },
        },
      },
      {
        $unwind: {
          path: '$repos', // 指定要展开的字段
          preserveNullAndEmptyArrays: false, // 仅保留有匹配的 document， `false` 则移除没有匹配的 document
        },
      },
    ]);

    const users_res = await this.blackHoleCommitModel.aggregate([
      { $group: { _id: '$author' } },
      { $project: { _id: 0, users: '$_id' } },
      {
        $lookup: {
          from: 'users',
          localField: 'users',
          foreignField: '_id',
          as: 'users',
        },
      },
      { $unwind: { path: '$users', preserveNullAndEmptyArrays: false } },
      {
        $project: {
          _id: 0,
          users: {
            _id: 1,
            name: 1,
            email: 1,
          },
        },
      },
    ]);

    const lastCommitAt = await this.blackHoleCommitModel.findOne().sort({ createdAt: -1 }).exec();

    return {
      taskId: BLACK_HOLE_TASK_ID,
      lastCommitAt: lastCommitAt?.createdAt,
      repos: repos_res
        .map((item) => item.repos)
        .sort((a, b) => a.slug.localeCompare(b.slug))
        .map((item) => ({
          ...item,
          group: repo_list.list.find((repo) => repo.name === item.slug)?.group,
        })),
      users: users_res.map((item) => item.users).sort((a, b) => a.email.localeCompare(b.email)),
    };
  }

  /**
   * 获取任务提交信息，分页数据
   * @returns
   */
  async getTasksCommits(params: {
    current?: number;
    pageSize?: number;
    author: string;
    branch: string;
    commitId: string;
    slug: string;
    createdAt: [string, string];
    readStatus: boolean;
  }) {
    const { current = 1, pageSize = 10, author, branch, commitId, slug, readStatus } = params;
    const query = {};

    if (author) {
      query['author'] = new Types.ObjectId(author);
    }

    if (branch) {
      query['branch'] = {
        $regex: new RegExp(branch, 'i'),
      };
    }

    if (commitId) {
      query['commitId'] = {
        $regex: new RegExp(commitId, 'i'),
      };
    }

    if (slug) {
      query['slug'] = {
        $regex: new RegExp(slug, 'i'),
      };
    }

    if (readStatus !== undefined) {
      query['readStatus'] = Boolean(readStatus);
    }

    // 时间范围搜索
    if (params.createdAt && params.createdAt.length === 2) {
      query['createdAt'] = {
        $gte: new Date(params.createdAt[0]),
        $lte: new Date(params.createdAt[1]),
      };
    }

    const list = await this.blackHoleCommitModel
      .find(query)
      .populate('author')
      .sort({ createdAt: -1 })
      .skip((current - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const total = await this.blackHoleCommitModel.countDocuments(query);

    return {
      list,
      total,
    };
  }

  /**
   * 新增任务提交信息
   */
  async addTasksCommits(data: BlackHoleCommitType) {
    if (data.taskId !== BLACK_HOLE_TASK_ID) {
      throw new Error('非万能任务的提交信息');
    }
    const res = await this.blackHoleCommitModel.create(data);
    return res;
  }

  /**
   * 更新任务提交信息的阅读状态
   */
  async updateReadStatus(id: string, readStatus: boolean) {
    const res = await this.blackHoleCommitModel.updateOne({ _id: id }, { $set: { readStatus } });
    return res;
  }
}

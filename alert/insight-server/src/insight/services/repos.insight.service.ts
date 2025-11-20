import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Repos, ReposDocument } from '../schemas/repos.schema';
import { Model } from 'mongoose';
import { BitbucketService } from 'src/bitbucket/services/bitbucket.service';

@Injectable()
export class InsightReposService {
  constructor(
    @InjectModel(Repos.name) private insightReposModel: Model<ReposDocument>,
    private readonly bitbucketService: BitbucketService,
  ) {
    //
  }

  /**
   * 获取所有仓库
   */
  async getAllRepos(params: { current?: number; pageSize?: number; name?: string; slug?: string; group?: string }) {
    const { current = 1, pageSize = 10, name, slug, group } = params;
    const query = {
      isDeleted: false,
    };
    if (name) {
      query['name'] = name;
    }
    if (slug) {
      query['slug'] = slug;
    }
    if (group) {
      query['group'] = group;
    }
    const data = await this.insightReposModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip((current - 1) * pageSize)
      .limit(pageSize)
      .exec();
    const total = await this.insightReposModel.countDocuments(query);
    return {
      list: data,
      total,
    };
  }

  /**
   * 获取单个仓库
   * @param id
   * @returns
   */
  async getRepo(id: string) {
    return await this.insightReposModel.findById(id).exec();
  }

  /**
   * 根据名称获取仓库
   * @param name
   * @returns
   */
  async getRepoByName(name: string) {
    return await this.insightReposModel
      .findOne({
        name,
      })
      .exec();
  }

  async getRepoBySlug(slug: string) {
    return await this.insightReposModel.findOne({ slug }).exec();
  }

  /**
   * 创建仓库
   */
  async createRepo(repo: ReposDocument) {
    return await new this.insightReposModel(repo).save();
  }

  /**
   * 删除仓库
   */
  async deleteRepo(id: string) {
    return await this.insightReposModel.findByIdAndUpdate(id, { isDeleted: true });
  }

  /**
   * 更新仓库信息
   */
  async updateRepo(id: string, repo: ReposDocument) {
    return await this.insightReposModel.findByIdAndUpdate(id, {
      ...repo,
      updatedAt: new Date(),
    });
  }

  /**
   * 获取仓库选项
   */
  async getRepoOptions() {
    const data = await this.insightReposModel.find({ isDeleted: false }).exec();
    return data.map((item) => ({
      label: item.name,
      value: item.slug,
      desc: item.description,
      group: item.group,
      // project: item.project,
    }));
  }
}

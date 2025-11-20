import { Injectable, Logger } from '@nestjs/common';
import { BitbucketService } from './bitbucket.service';
import { rawLineObjectToJson } from '../bitbucket.utils';
import { InjectModel } from '@nestjs/mongoose';
import { JscramblerConfigJson, JscramblerConfigJsonDocument } from '../schemas/jscrambler-config-json.schema';
import { Model } from 'mongoose';
import { Projects, ProjectsDocument } from 'src/insight/schemas/projects.schema';
import { Repos, ReposDocument } from 'src/insight/schemas/repos.schema';

@Injectable()
export class BitbucketJscramblerService {
  logger = new Logger(BitbucketJscramblerService.name);

  constructor(
    private readonly bitbucketService: BitbucketService,
    @InjectModel(JscramblerConfigJson.name)
    private readonly jscramblerConfigJson: Model<JscramblerConfigJsonDocument>,
    @InjectModel(Projects.name)
    private readonly projectModel: Model<ProjectsDocument>,
    @InjectModel(Repos.name)
    private readonly reposModel: Model<ReposDocument>,
  ) {
    //
  }

  /**
   * 获取 jscrambler.config.json 文件内容
   * @param repo
   * @returns
   */
  async getJscramblerContent({ repo }: { repo: string }) {
    try {
      const _repos = await this.reposModel.findOne({
        slug: repo,
      });
      if (!_repos) {
        this.logger.error('任务执行上下文错误');
        const _project = await this.projectModel.findOne({ name: repo });
        if (_project) {
          await this.projectModel.updateOne(
            {
              _id: _project._id,
            },
            {
              metaJscrambler: {
                status: false,
                updatedAt: new Date(),
              },
              updatedAt: new Date(),
            },
          );
        }
        return false;
      }
      const group = _repos.toJSON().group;
      const jsonRaw = await this.bitbucketService.getProjectContent(group, repo, 'jscrambler.config.json');
      const json = rawLineObjectToJson(jsonRaw.data);
      await this.jscramblerConfigJson.create({
        repo: repo,
        branch: 'master',
        slug: group,
        config: json?.fileMatcher,
      });
      const _project = await this.projectModel.findOne({ name: repo });
      if (_project) {
        await this.projectModel.updateOne(
          {
            _id: _project._id,
          },
          {
            metaJscrambler: {
              status: true,
              updatedAt: new Date(),
            },
            updatedAt: new Date(),
          },
        );
      }
      return json;
    } catch (error) {
      this.logger.error('解析 jscrambler.config.json 失败:', error);
      const _project = await this.projectModel.findOne({ name: repo });
      if (_project) {
        await this.projectModel.updateOne(
          {
            _id: _project._id,
          },
          {
            metaJscrambler: {
              status: false,
              updatedAt: new Date(),
            },
            updatedAt: new Date(),
          },
        );
      }
      return false;
    }
  }

  /**
   * 获取所有 jscrambler.config.json 文件内容
   * @param params
   * @returns
   */
  async getJscramblerContentAllScans(
    params: { current: number; pageSize: number },
    query: {
      repo: string;
      slug: string;
      branch: string;
    },
  ) {
    const _query = {};
    const { current, pageSize } = params;
    const { repo, slug, branch } = query;
    if (repo) {
      _query['repo'] = repo;
    }
    if (slug) {
      _query['slug'] = slug;
    }
    if (branch) {
      _query['branch'] = branch;
    }
    const list = await this.jscramblerConfigJson
      .find(_query)
      .sort({ createdAt: -1 })
      .skip((current - 1) * pageSize)
      .limit(pageSize);
    const total = await this.jscramblerConfigJson.countDocuments(_query);
    return {
      list,
      total,
    };
  }

  /**
   * 通过 repo 名称
   * 获取最新的 jscrambler.config.json 文件内容
   * @param repo
   * @returns
   */
  async getLatestJscramblerContentScanResultByRepoName(repo: string) {
    return await this.jscramblerConfigJson.findOne({ repo }).sort({ createdAt: -1 });
  }
}

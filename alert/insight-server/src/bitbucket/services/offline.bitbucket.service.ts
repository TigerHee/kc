import { Injectable, Logger } from '@nestjs/common';
import { BitbucketService } from './bitbucket.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as babelParser from '@babel/parser';
import traverse from '@babel/traverse';
import { OffconfigJs, OffconfigJsDocument } from '../schemas/offconfig-js.schema';
import { Projects, ProjectsDocument } from 'src/insight/schemas/projects.schema';
import { Repos, ReposDocument } from 'src/insight/schemas/repos.schema';
@Injectable()
export class BitbucketOfflineService {
  logger = new Logger(BitbucketOfflineService.name);

  constructor(
    private readonly bitbucketService: BitbucketService,
    @InjectModel(OffconfigJs.name)
    private readonly offconfigJsModel: Model<OffconfigJsDocument>,
    @InjectModel(Projects.name)
    private readonly projectModel: Model<ProjectsDocument>,
    @InjectModel(Repos.name)
    private readonly reposModel: Model<ReposDocument>,
  ) {
    //
  }

  /**
   * 获取 .offconfig.js 文件内容
   * @param repo
   * @returns
   */
  async getOfflineContent({ repo }: { repo: string }) {
    try {
      const _repos = await this.reposModel.findOne({ slug: repo });
      if (!_repos) {
        this.logger.error('任务执行上下文错误');
        const _project = await this.projectModel.findOne({ name: repo });
        if (_project) {
          await this.projectModel.updateOne(
            {
              _id: _project._id,
            },
            {
              metaOfflineAppV3: {
                status: false,
                maximumFileSizeToCacheInBytes: null,
                updatedAt: new Date(),
              },
              updatedAt: new Date(),
            },
          );
        }
        return false;
      }
      const group = _repos.toJSON().group;
      const jsonRaw = await this.bitbucketService.getProjectContent(group, repo, '.offconfig.js');
      const json = this.getConfigContentObject(jsonRaw.data);
      await this.offconfigJsModel.create({
        repo: repo,
        branch: 'master',
        slug: group,
        ...(json || {}),
      });
      const _project = await this.projectModel.findOne({ name: repo });
      if (_project) {
        await this.projectModel.updateOne(
          {
            _id: _project._id,
          },
          {
            metaOfflineAppV3: {
              status: true,
              maximumFileSizeToCacheInBytes: json?.maximumFileSizeToCacheInBytes,
              updatedAt: new Date(),
            },
            updatedAt: new Date(),
          },
        );
      }
      return json;
    } catch (error) {
      const _project = await this.projectModel.findOne({ name: repo });
      if (_project) {
        await this.projectModel.updateOne(
          {
            _id: _project._id,
          },
          {
            metaOfflineAppV3: {
              status: false,
              maximumFileSizeToCacheInBytes: null,
              updatedAt: new Date(),
            },
            updatedAt: new Date(),
          },
        );
      }
      this.logger.error('解析 offline.js 失败:', error);
      // throw new InternalServerErrorException('解析 offline.js 失败' + error);
      // return false;
    }
  }

  /**
   * 获取所有 .offconfig.js 文件内容
   * @param params
   * @returns
   */
  async getOfflineContentAllScans(
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
    const total = await this.offconfigJsModel.countDocuments(_query);
    const list = await this.offconfigJsModel
      .find(_query)
      .sort({ createdAt: -1 })
      .skip((current - 1) * pageSize)
      .limit(pageSize);
    return {
      total,
      list,
    };
  }

  private getConfigContentObject(data) {
    if (data?.lines) {
      const configCode = data.lines.map((line: any) => line.text).join('\n');

      // 使用 Babel 解析器将代码解析为 AST
      const ast = babelParser.parse(configCode, {
        sourceType: 'module', // 设置为 'module' 以支持 ES6 模块语法
        plugins: [
          // 'classProperties', // 如果你的代码使用了类属性，启用这个插件
          'optionalChaining', // 如果你的代码使用了可选链，启用这个插件
          'nullishCoalescingOperator', // 支持空合并操作符
        ],
      });

      // 定义一个变量来存储配置对象
      let configObject = null;

      // 遍历 AST
      traverse(ast, {
        VariableDeclaration(path) {
          path.get('declarations').forEach((declarationPath) => {
            if (declarationPath.isVariableDeclarator() && declarationPath.get('id').isIdentifier()) {
              const variable = declarationPath.get('id').node as any;
              const variableName = variable.name;
              if (variableName === 'config') {
                // 检查是否有初始化的对象
                const init = declarationPath.get('init');
                if (init.isObjectExpression()) {
                  configObject = init;
                }
              }
            }
          });
        },
      });

      // 获取并输出 config 对象的值
      if (configObject) {
        const configValues = configObject.node.properties.reduce((acc, property) => {
          const key = property.key.name || property.key.value;
          // console.log('key', key);
          // console.log('property', property);
          if (property.type === 'ObjectProperty') {
            if (
              property.value.type === 'StringLiteral' ||
              property.value.type === 'NumericLiteral' ||
              property.value.type === 'BooleanLiteral'
            ) {
              acc[key] = property.value.value;
            } else if (property.value.type === 'ArrayExpression') {
              acc[key] = property.value.elements.map((item: any) => {
                return item.value;
              });
            } else if (property.value.type === 'ObjectExpression') {
              acc[key] = property.value.properties.reduce((innerAcc, innerProperty) => {
                const innerKey = innerProperty.key.name || innerProperty.key.value; // 内部键
                if (
                  innerProperty.value.type === 'StringLiteral' ||
                  innerProperty.value.type === 'NumericLiteral' ||
                  innerProperty.value.type === 'BooleanLiteral'
                ) {
                  innerAcc[innerKey] = innerProperty.value.value;
                } else if (innerProperty.value.type === 'ArrayExpression') {
                  innerAcc[innerKey] = innerProperty.value.elements.map((item: any) => {
                    return item.value;
                  });
                } else if (innerProperty.value.type === 'ObjectExpression') {
                  innerAcc[innerKey] = innerProperty.value.properties.reduce((innerInnerAcc, innerInnerProperty) => {
                    const innerInnerKey = innerInnerProperty.key.name || innerInnerProperty.key.value; // 内部键
                    innerInnerAcc[innerInnerKey] = innerInnerProperty.value.value;
                    return innerInnerAcc;
                  }, {});
                }
                return innerAcc;
              }, {});
            } else {
            }
          }
          return acc; // 返回累加的结果
        }, {});
        return configValues;
      } else {
        return null;
      }
    }
  }

  /**
   * 通过 repo 获取
   * 获取最新的 .offconfig.js 扫描结果
   */
  async getLatestOfflineContentScanResultByRepoName(repo: string) {
    const data = await this.offconfigJsModel.findOne({ repo, branch: 'master' }).sort({ createdAt: -1 });
    return data;
  }
}

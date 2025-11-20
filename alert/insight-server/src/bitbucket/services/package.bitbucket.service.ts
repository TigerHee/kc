import { Injectable, Logger } from '@nestjs/common';
import { BitbucketService } from './bitbucket.service';
import { checkDependenciesIsLock, rawLineObjectToJson } from '../bitbucket.utils';
import { DependencyItem, PackageJsonType } from '../types/repo.types';
import { InjectModel } from '@nestjs/mongoose';
import { PackageJsScan, PackageJsScanDocument } from '../schemas/package-json-scans.schema';
import { Model } from 'mongoose';
import { Projects, ProjectsDocument } from 'src/insight/schemas/projects.schema';
import { Repos, ReposDocument } from 'src/insight/schemas/repos.schema';

@Injectable()
export class BitbucketPackageService {
  logger = new Logger(BitbucketPackageService.name);

  constructor(
    private readonly bitbucketService: BitbucketService,
    @InjectModel(PackageJsScan.name)
    private readonly packageJsReportModel: Model<PackageJsScanDocument>,
    @InjectModel(Projects.name)
    private readonly projectModel: Model<ProjectsDocument>,
    @InjectModel(Repos.name)
    private readonly reposModel: Model<ReposDocument>,
  ) {
    //
  }

  /**
   * 获取 package.json 文件内容
   * @param repo
   * @returns
   */
  async getPackageJsonContent({ repo }: { repo: string }) {
    const _repo = await this.reposModel.findOne({ slug: repo });
    if (!_repo) {
      return {
        'web-checker': false,
        'web-test': false,
        'app-offline': false,
        deps: [],
      };
    }
    const group = _repo.toJSON().group;
    const jsonRaw = await this.bitbucketService.getProjectContent(group, repo, 'package.json');
    const json = rawLineObjectToJson(jsonRaw.data);
    const deps = this.extractDependencies(json);
    const hasUseWebChecker = this.hasUseWebChecker(json);
    const hasUseWebTest = this.hasUseWebTest(json);
    const hasUseOffline = this.hasUseOffline(json);

    // 保存扫描结果报告
    await this.packageJsReportModel.create({
      slug: group,
      repo: repo,
      webChecker: hasUseWebChecker,
      webTest: hasUseWebTest,
      appOffline: hasUseOffline,
      deps,
    });

    // 更新项目的 package.json 扫描结果
    const _project = await this.projectModel.findOne({ name: repo });
    if (_project) {
      await this.projectModel.updateOne(
        {
          _id: _project._id,
        },
        {
          metaOfflineAppV3: {
            status: hasUseOffline,
            updatedAt: new Date(),
          },
          metaWebTest: {
            status: hasUseWebTest,
            updatedAt: new Date(),
          },
          metaWebChecker: {
            status: hasUseWebChecker,
            updatedAt: new Date(),
          },
          metaDeps: {
            status: true,
            total: deps.filter((dep) => dep.type === 'dependencies').length,
            unLockTotal: deps.filter((dep) => dep.type === 'dependencies').filter((dep) => !dep.isLock).length,
            lockTotal: deps.filter((dep) => dep.type === 'dependencies').filter((dep) => dep.isLock).length,
            updatedAt: new Date(),
          },
          updatedAt: new Date(),
        },
      );
    }

    return {
      'web-checker': hasUseWebChecker,
      'web-test': hasUseWebTest,
      'app-offline': hasUseOffline,
      deps,
    };
  }

  /**
   * 获取所有扫描的 package.json 文件内容
   * @param params
   * @returns
   */
  async getPackageJsonContentAllScans(
    params: { current: number; pageSize: number },
    query: {
      repo?: string;
      slug?: string;
      branch?: string;
      webChecker?: boolean;
      webTest?: boolean;
      appOffline?: boolean;
    },
  ) {
    const _query = {};
    const { current, pageSize } = params;
    const { repo, slug, branch, webChecker, webTest, appOffline } = query;
    if (repo) {
      _query['repo'] = repo;
    }
    if (slug) {
      _query['slug'] = slug;
    }
    if (branch) {
      _query['branch'] = branch;
    }
    if (webChecker !== undefined) {
      _query['webChecker'] = webChecker;
    }
    if (webTest !== undefined) {
      _query['webTest'] = webTest;
    }
    if (appOffline !== undefined) {
      _query['appOffline'] = appOffline;
    }

    const total = await this.packageJsReportModel.countDocuments(_query);
    const list = await this.packageJsReportModel
      .find(_query)
      .sort({ createdAt: -1 })
      .skip((current - 1) * pageSize)
      .limit(pageSize);
    return {
      total,
      list,
    };
  }

  /**
   * 是否接入 web-checker
   * 1. scripts.ci 里面有 kc-web-checker
   * 2. devDependencies 里面有 kc-web-checker
   * @param packageJson
   * @returns
   */
  hasUseWebChecker(packageJson: PackageJsonType) {
    return (
      packageJson.scripts?.ci?.includes('kc-web-checker') &&
      (Object.keys(packageJson.devDependencies || {}).includes('kc-web-checker') ||
        Object.keys(packageJson.dependencies || {}).includes('kc-web-checker'))
    );
  }

  /**
   * 是否接入 kc-web-test
   * 1. scripts.test 里面有 kc-web-test
   * 2. devDependencies 里面有 kc-web-test
   * @param packageJson
   * @returns
   */
  hasUseWebTest(packageJson: PackageJsonType) {
    return (
      packageJson.scripts?.test?.includes('kc-web-test') &&
      (Object.keys(packageJson.devDependencies || {}).includes('kc-web-test') ||
        Object.keys(packageJson.dependencies || {}).includes('kc-web-test'))
    );
  }

  /**
   * 是否接入离线包
   * 1. scripts 里面有 build:offline
   * 2. dependencies 里面有 offline-sources
   * @param packageJson
   * @returns
   */
  hasUseOffline(packageJson: PackageJsonType) {
    return (
      packageJson.scripts?.['build:offline'] !== undefined &&
      Object.keys(packageJson.dependencies || {}).includes('offline-sources')
    );
  }

  /**
   * 萃取 package.json 中的依赖
   * @param packageJson
   * @returns
   */
  extractDependencies(packageJson: PackageJsonType): DependencyItem[] {
    const dependencies = Object.entries(packageJson.dependencies || {}).map(([name, version]) => ({
      name,
      version,
      isLock: checkDependenciesIsLock(version),
      type: 'dependencies' as DependencyItem['type'],
    }));
    const devDependencies = Object.entries(packageJson.devDependencies || {}).map(([name, version]) => ({
      name,
      version,
      isLock: checkDependenciesIsLock(version),
      type: 'devDependencies' as DependencyItem['type'],
    }));
    const peerDependencies = Object.entries(packageJson.peerDependencies || {}).map(([name, version]) => ({
      name,
      version,
      isLock: checkDependenciesIsLock(version),
      type: 'peerDependencies' as DependencyItem['type'],
    }));
    return [...dependencies, ...devDependencies, ...peerDependencies];
  }

  /**
   * 根据仓库名称
   * 获取最新一份 package.json 扫描结果
   */
  async getLatestPackageJsonScanResultByRepoName(repo: string) {
    return await this.packageJsReportModel.findOne({ repo, branch: 'master' }).sort({ createdAt: -1 });
  }
}

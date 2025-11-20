import { BitbucketOfflineService } from '../services/offline.bitbucket.service';
import { BitbucketPackageService } from '../services/package.bitbucket.service';
import { Controller, Get, HttpException, Logger, Param, Query } from '@nestjs/common';
import { RepoEnum } from '../types/repo.types';
import SCAN_REPO_LIST from '../constants/repo.constants';
import { BitbucketJscramblerService } from '../services/jscrambler.bitbucket.service';
import { BitbucketService } from '../services/bitbucket.service';
import { BitbucketComplianceService } from '../services/compliance.bitbucket.service';

@Controller('bitbucket')
export class BitbucketController {
  logger = new Logger(BitbucketController.name);

  constructor(
    private readonly bitbucketPackageService: BitbucketPackageService,
    private readonly bitbucketJscramblerService: BitbucketJscramblerService,
    private readonly bitbucketOfflineService: BitbucketOfflineService,
    private readonly bitbucketService: BitbucketService,
    private readonly bitbucketComplianceService: BitbucketComplianceService,
  ) {
    //
  }
  @Get('scan/package.json/list')
  async scanAllReposPackageJson(
    @Query('current') current: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('repo') repo: string,
    @Query('slug') slug: string,
    @Query('branch') branch: string,
    @Query('webChecker') webChecker: boolean,
    @Query('webTest') webTest: boolean,
    @Query('appOffline') appOffline: boolean,
  ) {
    const res = await this.bitbucketPackageService.getPackageJsonContentAllScans(
      {
        current,
        pageSize,
      },
      {
        repo,
        slug,
        branch,
        webChecker,
        webTest,
        appOffline,
      },
    );
    return res;
  }

  @Get('scan/jscrambler.config.json/list')
  async scanAllReposJscrambler(
    @Query('current') current: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('repo') repo: string,
    @Query('slug') slug: string,
    @Query('branch') branch: string,
  ) {
    const res = await this.bitbucketJscramblerService.getJscramblerContentAllScans(
      {
        current,
        pageSize,
      },
      {
        repo,
        slug,
        branch,
      },
    );
    return res;
  }

  @Get('scan/offconfig.js/list')
  async scanAllReposOffline(
    @Query('current') current: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('repo') repo: string,
    @Query('slug') slug: string,
    @Query('branch') branch: string,
  ) {
    const res = await this.bitbucketOfflineService.getOfflineContentAllScans(
      {
        current,
        pageSize,
      },
      {
        repo,
        slug,
        branch,
      },
    );
    return res;
  }

  @Get('scan/package.json/:repo')
  async scanRepoPackageJson(@Param('repo') repo: RepoEnum) {
    if (SCAN_REPO_LIST?.[repo] === undefined) {
      throw new HttpException('Repo not found', 404);
    }
    const res = await this.bitbucketPackageService.getPackageJsonContent({ repo });
    return res;
  }

  @Get('scan/jscrambler.config.json/:repo')
  async scanRepoJscrambler(@Param('repo') repo: RepoEnum) {
    if (SCAN_REPO_LIST?.[repo] === undefined) {
      throw new HttpException('Repo not found', 404);
    }
    const res = await this.bitbucketJscramblerService.getJscramblerContent({ repo });
    return res;
  }

  @Get('scan/offconfig.js/:repo')
  async scanRepoOffline(@Param('repo') repo: RepoEnum) {
    if (SCAN_REPO_LIST?.[repo] === undefined) {
      throw new HttpException('Repo not found', 404);
    }
    const res = await this.bitbucketOfflineService.getOfflineContent({ repo });
    return res;
  }

  @Get('searchByProjectKey/:projectKey')
  async searchByProjectKey(@Param('projectKey') projectKey: string) {
    const res = await this.bitbucketService.getReposForProject(projectKey);
    return res;
  }

  @Get('code-zip/:slug/:repo')
  async getRepos(@Param('slug') slug: string, @Param('repo') repo: string) {
    console.log('slug', slug);
    console.log('repo', repo);
    // const codeBasePath = await this.bitbucketComplianceService.getProjectArchive(slug, repo);
    // console.log('codeBasePath', codeBasePath);
    // const codeBasePath = '/Users/kakarot1874/KupoCode/insight-server/.code/brisk-web';
    // const res = await this.bitbucketComplianceService.scanRepoComplianceCode(codeBasePath, 'src');
    // return res;
  }
}

import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { BITBUCKET_HTTP_SERVICE_TOKEN } from '../bitbucket.http.module';

@Injectable()
export class BitbucketService {
  logger = new Logger(BitbucketService.name);
  version = '/rest/api/1.0';

  constructor(@Inject(BITBUCKET_HTTP_SERVICE_TOKEN) private readonly httpService: HttpService) {
    //
  }

  /**
   * 获取文件内容
   * @param project_key
   * @param file
   * @returns
   */
  async getProjectContent(
    slug: string,
    repo: string,
    file: string,
    options?: {
      start?: number;
      limit?: number;
    },
  ) {
    const limit = options?.limit || 1000;
    const start = options?.start || 0;
    const res = await this.httpService
      .get(`${this.version}/projects/${slug}/repos/${repo}/browse/${file}?limit=${limit}&start=${start}`)
      .toPromise();
    return res;
  }

  /**
   * 获取项目文件夹
   * @param project_key
   * @param path
   * @returns
   */
  async getProjectFileDir(
    slug: string,
    repo: string,
    path: string,
    options?: {
      start?: number;
      limit?: number;
    },
  ) {
    const limit = options?.limit || 1000;
    const start = options?.start || 0;
    const res = await this.httpService
      .get(`${this.version}/projects/${slug}/repos/${repo}/files${path}?limit=${limit}&start=${start}`)
      .toPromise();
    return res;
  }

  /**
   * 获取仓库列表
   * @param projectKey
   * @returns
   */
  async getReposForProject(projectKey: string) {
    const url = `${this.version}/projects/${projectKey}/repos?limit=100`;
    try {
      const res = await this.httpService.get(url).toPromise();
      return res.data.values || [];
    } catch (err) {
      const errMsg = `bitbucket api ${url} with error: ${err.message || err}`;
      throw new Error(errMsg);
    }
  }
}

import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { BITBUCKET_HTTP_SERVICE_TOKEN } from '../bitbucket.http.module';
import { CommentItem } from '../types/webhook.types';

@Injectable()
export class BitbucketWebhookService {
  logger = new Logger(BitbucketWebhookService.name);
  latestVersion = '/rest/api/latest';

  constructor(@Inject(BITBUCKET_HTTP_SERVICE_TOKEN) private readonly httpService: HttpService) {
    //
  }
  /**
   * Retrieves details of a commit in a Bitbucket repository.
   *
   * @param slug - The project key or slug identifier for the Bitbucket project.
   * @param repo - The name of the repository within the project.
   * @param commitId - The unique identifier of the commit to retrieve.
   * @returns A promise that resolves to the HTTP response containing commit details.
   */
  async getCommitById(slug: string, repo: string, commitId: string) {
    try {
      const res = await this.httpService
        .get(`${this.latestVersion}/projects/${slug}/repos/${repo}/commits/${commitId}`)
        .toPromise();
      return res.data;
    } catch (error) {
      this.logger.error('bitbucket api push:', error);
      return false;
    }
  }
  /**
   * Retrieves details of a commit in a Bitbucket repository.
   *
   * @param slug - The project key or slug identifier for the Bitbucket project.
   * @param repo - The name of the repository within the project.
   * @param commitId - The unique identifier of the commit to retrieve.
   * @returns A promise that resolves to the HTTP response containing commit details.
   */
  async getCommitChangesbyId(slug: string, repo: string, commitId: string, fromHash: string) {
    try {
      const res = await this.httpService
        .get(
          `${this.latestVersion}/projects/${slug}/repos/${repo}/commits/${commitId}/changes?since=${fromHash}&whitespace=ignore-all`,
        )
        .toPromise();
      return res.data;
    } catch (error) {
      this.logger.error('bitbucket api push:', error);
      return false;
    }
  }
  /**
   * Retrieves details of a commit in a Bitbucket repository.
   *
   * @param slug - The project key or slug identifier for the Bitbucket project.
   * @param repo - The name of the repository within the project.
   * @param commitId - The unique identifier of the commit to retrieve.
   * @returns A promise that resolves to the HTTP response containing commit details.
   */
  async getCommitDiff(slug: string, repo: string, commitId: string, fromHash: string, path = '**/*.js') {
    try {
      const res = await this.httpService
        .get(
          `${this.latestVersion}/projects/${slug}/repos/${repo}/commits/${commitId}/diff/${path}?since=${fromHash}&whitespace=ignore-all`,
        )
        .toPromise();
      return res.data;
    } catch (error) {
      this.logger.error('bitbucket api push:', error);
      return false;
    }
  }

  /**
   * Retrieves details of a specific pull request in a Bitbucket repository.
   *
   * @param slug - The project key or slug identifier for the Bitbucket project.
   * @param repo - The name of the repository within the project.
   * @param pullRequestId - The unique identifier of the pull request to retrieve.
   * @returns A promise that resolves to the HTTP response containing pull request details.
   */
  async getPullRequestById(
    slug: string,
    repo: string,
    pullRequestId: number,
    options?: {
      start?: number;
      limit?: number;
    },
  ) {
    try {
      const limit = options?.limit || 1000;
      const start = options?.start || 0;
      const res = await this.httpService
        .get(
          `${this.latestVersion}/projects/${slug}/repos/${repo}/pull-requests/${pullRequestId}?limit=${limit}&start=${start}`,
        )
        .toPromise();
      return res.data;
    } catch (error) {
      this.logger.error('bitbucket api pr:', error);
      return false;
    }
  }
  /**
   * Retrieves the commits associated with a specific pull request in a Bitbucket repository.
   *
   * @param slug - The project key or slug identifier for the Bitbucket project.
   * @param repo - The name of the repository within the project.
   * @param pullRequestId - The unique identifier of the pull request to retrieve commits from.
   * @param options - Optional parameters for pagination.
   * @param options.start - The starting index for pagination (default: 0).
   * @param options.limit - The maximum number of commits to retrieve (default: 1000).
   * @returns A promise that resolves to the HTTP response containing the commits of the pull request.
   */
  async getPullRequestCommitsById(
    slug: string,
    repo: string,
    pullRequestId: number,
    options?: {
      start?: number;
      limit?: number;
    },
  ) {
    try {
      const limit = options?.limit || 1000;
      const start = options?.start || 0;
      const res = await this.httpService
        .get(
          `${this.latestVersion}/projects/${slug}/repos/${repo}/pull-requests/${pullRequestId}/commits?limit=${limit}&start=${start}`,
        )
        .toPromise();
      return res.data;
    } catch (error) {
      this.logger.error('bitbucket api pr:', error);
      return false;
    }
  }
  /**
   * 处理pr diff code.
   *
   * @param slug - The project key or slug identifier for the Bitbucket project.
   * @param repo - The name of the repository within the project.
   * @param pullRequestId - The unique identifier of the pull request to retrieve diff from.
   * @returns A promise that resolves to the HTTP response containing the diff of the pull request.
   */
  async getPullRequestDiff(
    slug: string,
    repo: string,
    pullRequestId: number,
    // fromHash,
  ) {
    try {
      const res = await this.httpService
        .get(
          `${this.latestVersion}/projects/${slug}/repos/${repo}/pull-requests/${pullRequestId}/diff?whitespace=ignore-all`,
        )
        .toPromise();
      return res.data;
    } catch (error) {
      this.logger.error('bitbucket api pr diff:', error);
      return false;
    }
  }

  /**
   *  获取 pr 提交.
   * @param slug
   * @param repo
   * @param pullRequestId
   * @param options
   * @returns
   */
  async getPullRequestCommits(
    slug: string,
    repo: string,
    pullRequestId: number,
    options?: {
      start?: number;
      limit?: number;
    },
  ) {
    try {
      const limit = options?.limit || 200;
      const start = options?.start || 0;
      const res = await this.httpService
        .get(
          `${this.latestVersion}/projects/${slug}/repos/${repo}/pull-requests/${pullRequestId}/commits?limit=${limit}&start=${start}`,
        )
        .toPromise();
      return res.data;
    } catch (error) {
      this.logger.error('bitbucket api pr commits:', error);
      return false;
    }
  }

  /**
   * 获取 pr 评论.
   *
   * @param slug - The project key or slug identifier for the Bitbucket project.
   * @param repo - The name of the repository within the project.
   * @param pullRequestId - The unique identifier of the pull request to retrieve Comments from.
   * @returns A promise that resolves to the HTTP response containing the Comments of the pull request.
   */
  async getPullRequestComments(
    slug: string,
    repo: string,
    pullRequestId: number,
    options?: {
      start?: number;
      limit?: number;
    },
  ) {
    try {
      const limit = options?.limit || 100;
      const start = options?.start || 0;
      const res = await this.httpService
        .get(
          `/rest/ui/latest/projects/${slug}/repos/${repo}/pull-requests/${pullRequestId}/comments?limit=${limit}&start=${start}`,
        )
        .toPromise();
      return res.data;
    } catch (error) {
      this.logger.error('bitbucket api pr comments:', error);
      return false;
    }
  }
  /**
   * 添加 pr 评论.
   *
   * @param slug - The project key or slug identifier for the Bitbucket project.
   * @param repo - The name of the repository within the project.
   * @param pullRequestId - The unique identifier of the pull request to retrieve Comments from.
   * @returns A promise that resolves to the HTTP response containing the Comments of the pull request.
   */

  async addPullRequestComments(slug: string, repo: string, pullRequestId: number, comment: CommentItem) {
    try {
      const res = await this.httpService
        .post(`${this.latestVersion}/projects/${slug}/repos/${repo}/pull-requests/${pullRequestId}/comments`, comment)
        .toPromise();
      return res.data;
    } catch (error) {
      this.logger.error('bitbucket api pr:', error);
      return false;
    }
  }

  /**
   * 拒绝 pr.
   * @param slug
   * @param repo
   * @param pullRequestId
   * @param version
   * @param msg
   * @returns
   */
  async declinePullRequest(slug: string, repo: string, pullRequestId: number, version: number, msg: string) {
    try {
      const res = await this.httpService
        .post(`${this.latestVersion}/projects/${slug}/repos/${repo}/pull-requests/${pullRequestId}/decline`, {
          // comment: `您的pr含有不符合规范的提交：${msg}`,
          comment: `${msg}`,
          version: version,
        })
        .toPromise();
      return res.data;
    } catch (error) {
      this.logger.error('bitbucket api pr:', error);
      return false;
    }
  }
}

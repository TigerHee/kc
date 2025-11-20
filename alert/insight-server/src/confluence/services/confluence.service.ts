import { Inject, Injectable, Logger } from '@nestjs/common';
import { CONFLUENCE_HTTP_SERVICE_TOKEN } from '../confluence.http.module';
import { ContentAnalyticsViewsByUser, WikiUser } from '../types/wiki.types';
/**
 * ConfluenceService
 * REST API
 * https://developer.atlassian.com/cloud/confluence/rest/v2/intro/#about
 */
@Injectable()
export class ConfluenceService {
  logger = new Logger(ConfluenceService.name);
  constructor(@Inject(CONFLUENCE_HTTP_SERVICE_TOKEN) private readonly confluenceHttpService) {
    //
  }

  /**
   * 获取文章内容
   * @param pageId
   * @returns
   */
  async getArticleContent(pageId: number) {
    try {
      const { data } = await this.confluenceHttpService
        .get(`/wiki/api/v2/pages/${pageId}?body-format=view`)
        .toPromise();
      return data;
    } catch (error) {
      this.logger.error(`confluence api ${pageId}:`, error);
      return false;
    }
  }

  /**
   * 获取文章用户
   * @param accountId
   * @returns
   */
  async getUserInfoByApi(accountId: string): Promise<WikiUser> {
    try {
      const { data } = await this.confluenceHttpService.get(`/wiki/rest/api/user?accountId=${accountId}`).toPromise();
      return data;
    } catch (error) {
      this.logger.error(`confluence api ${accountId}:`, error);
    }
  }

  /**
   * 获取文章的阅读用户列表
   */
  async getArticleViewer(pageId: number): Promise<{
    id: number;
    version: { number: number };
    contentAnalyticsViewsByUser: ContentAnalyticsViewsByUser;
  }> {
    try {
      const query = [
        {
          operationName: 'AnalyticsViewersQuery',
          variables: {
            contentId: pageId,
          },
          query:
            'query AnalyticsViewersQuery($contentId: ID!, $limit: Int, $accountIds: [String]) {\n  singleContent(id: $contentId) {\n    id\n    version {\n      number\n      __typename\n    }\n    contentAnalyticsViewsByUser(limit: $limit, accountIds: $accountIds) {\n      pageViews {\n        userProfile {\n          displayName\n          id\n          displayName\n          photos {\n            value\n            isPrimary\n            __typename\n          }\n          isActive\n          confluence {\n            permissionType\n            __typename\n          }\n          __typename\n        }\n        views\n        lastViewedAt\n        lastVersionViewedNumber\n        lastVersionViewedUrl\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n',
        },
      ];
      const { data } = await this.confluenceHttpService.post(`/cgraphql?q=AnalyticsViewersQuery`, query).toPromise();
      return data[0]?.data?.singleContent;
    } catch (error) {
      this.logger.error(`confluence api ${pageId}:`, error);
      // return false;
    }
  }
}

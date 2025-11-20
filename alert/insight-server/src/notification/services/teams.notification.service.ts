import { Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ulid } from 'ulid';
import { TeamsMessageAdaptiveCards, TeamsMessageAttachments, TeamsMessageHeroCards } from '../types/teams.types';
import {
  genOnetrustCookieDiffTemplate,
  genRoutesHtml,
  genSafebrowsingHtml,
  genUnConfiguredAccessibleLinkHtml,
  genVirustotalHtml,
  genWarnInfoHTML,
  WarnType,
} from '../utils/template.utils';
import { TEAMS_HTTP_SERVICE_TOKEN } from '../teams.http.module';
import { ConfigService } from '@nestjs/config';
import { WebhookInfoType } from 'src/bitbucket/types/webhook.types';
import { RoutesDocument } from 'src/insight/schemas/route.schema';
import { UserDocument } from 'src/auth/schemas/user.schema';

/**
 * https://k-devdoc.atlassian.net/wiki/spaces/develop/pages/2657639
 */
@Injectable()
export class NotificationTeamsService {
  logger: Logger = new Logger(NotificationTeamsService.name);
  path = '/api/notify';

  constructor(
    @Inject(TEAMS_HTTP_SERVICE_TOKEN) private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    //
  }

  /**
   * 发送[文本消息]到指定会话
   * @param message
   * @param conversation
   * @returns
   */
  async sendMessageToConversation(
    text: string,
    conversation: string,
    options?: {
      mentions?: string[];
      attachments?: TeamsMessageAttachments;
      herocards?: TeamsMessageHeroCards;
      adaptivecards?: TeamsMessageAdaptiveCards;
    },
  ) {
    try {
      const res = await this.httpService
        .post(this.path, {
          message: [
            {
              text,
              mentions: options?.mentions,
              attachments: options?.attachments,
              herocards: options?.herocards,
              adaptivecards: options?.adaptivecards,
            },
          ],
          receiver: {
            conversation,
          },
          id: ulid(),
        })
        .toPromise();
      return res;
    } catch (error) {
      console.error('error.config.baseURL:', error.config);
      this.logger.error('发送消息失败:', error.message);
    }
  }

  /**
   * 发送消息到指定用户
   * @param message
   * @param user
   * @returns
   */
  async sendMessageToUser(
    text: string,
    user: string | string[],
    options?: {
      attachments?: TeamsMessageAttachments;
      herocard?: TeamsMessageHeroCards;
    },
  ) {
    let receiver;
    if (Array.isArray(user)) {
      receiver = user.map((u) => ({ email: u }));
    }
    if (typeof user === 'string') {
      receiver = { email: user };
    }
    try {
      const res = await this.httpService
        .post(this.path, {
          message: [
            {
              text,
              attachments: options?.attachments,
              herocard: options?.herocard,
            },
          ],
          receiver,
          id: ulid(),
        })
        .toPromise();
      return res;
    } catch (error) {
      this.logger.error('Teams发送消息失败:', error.message);
    }
  }

  /**
   * 查询消息发送状态
   * @param id
   * @returns
   */
  async checkPushIdStatus(id: string) {
    try {
      const res = await this.httpService.get(`/api/bot/push-requests/current-app?id=${id}`).toPromise();
      return res;
    } catch (error) {
      this.logger.error('查询Teams消息发送状态失败:', error.message);
    }
  }

  /**
   * 查询邮箱发送状态
   * @param email
   * @returns
   */
  async checkEmailStatus(email: string) {
    try {
      const res = await this.httpService.get(`/api/bot/push-requests/current-app?email=${email}`).toPromise();
      return res;
    } catch (error) {
      this.logger.error('查询Teams消息发送状态失败:', error.message);
    }
  }

  /**
   * 发送Onetrust Cookie Diff消息
   * @param data
   * @param conversation
   * @param mentions
   */
  async sendOnetrustCookieDiffMessage(
    messageData: {
      data: {
        line: string;
        color: string;
      }[];
      last_latest_scan_time: string;
      domain: string;
      verbose: boolean;
    },
    conversation,
    mentions?: string[],
  ) {
    const text = genOnetrustCookieDiffTemplate(messageData);
    await this.sendMessageToConversation(text, conversation, {
      mentions,
    });
  }

  /**
   * 发送Webhook 的告警消息
   * @param info
   * @param warns
   */
  async sendWebhookWarnReport(info: Partial<WebhookInfoType> = {}, warns?: WarnType[]) {
    const herocard = genWarnInfoHTML(info, warns);
    const conversation = this.configService.get<string>('TEAMS_WEBHOOK_CONVERSATION');

    await this.sendMessageToConversation('', conversation, {
      mentions: [info.authorEmail],
      herocards: [herocard],
    });
  }

  /**
   * 发送路由新增 的告警消息
   * @param projects
   */
  async sendProjectsRoutesReport(projects) {
    const herocard = genRoutesHtml(projects);
    const conversation = this.configService.get<string>('TEAMS_WEBHOOK_CONVERSATION');
    const mentions = projects.map((item) => item.owner);
    await this.sendMessageToConversation('', conversation, {
      mentions: mentions,
      herocards: [herocard],
    });
  }

  /**
   * 发送路由未配置 可访问链接的消息
   */
  async sendRoutesUnConfiguredReport(routes: RoutesDocument[]) {
    const herocard = genUnConfiguredAccessibleLinkHtml(routes);
    const conversation = this.configService.get<string>('TEAMS_WEBHOOK_CONVERSATION');
    const mentions = routes.map((item) => (item.user as UserDocument).email);
    // 去重
    const uniqueMentions = [...new Set(mentions)];
    await this.sendMessageToConversation('', conversation, {
      mentions: uniqueMentions,
      herocards: [herocard],
    });
  }

  /**
   * 发送 Safebrowsing 的告警消息
   * @param info
   * @param warns
   */
  async sendSafebrowsingReport(domains) {
    const insightUrl = this.configService.get<string>('INSIGHT_URL');
    const herocard = genSafebrowsingHtml(domains, insightUrl);
    const conversation = this.configService.get<string>('TEAMS_WEBHOOK_CONVERSATION');

    await this.sendMessageToConversation('', conversation, {
      herocards: [herocard],
    });
  }

  /**
   * 发送 Virustotal 的告警消息
   * @param info
   * @param warns
   */
  async sendVirustotalReport(domains) {
    const insightUrl = this.configService.get<string>('INSIGHT_URL');
    const herocard = genVirustotalHtml(domains, insightUrl);
    const conversation = this.configService.get<string>('TEAMS_WEBHOOK_CONVERSATION');

    await this.sendMessageToConversation('', conversation, {
      herocards: [herocard],
    });
  }
}

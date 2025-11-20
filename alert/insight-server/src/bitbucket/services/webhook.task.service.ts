import { Injectable } from '@nestjs/common';
import { IGNORE_TASK_REPO_LIST } from '../constants/ignore.repo.constants';
import { NotificationTeamsService } from 'src/notification/services/teams.notification.service';
import { InsightTasksServices } from 'src/insight/services/tasks.insight.service';
import { WebhookInfoType } from '../types/webhook.types';
import { BlackHoleTaskService } from 'src/insight/services/black-hole.task.service';
import { BLACK_HOLE_TASK_ID } from 'src/insight/constants/tasks.constant';
import { AlarmNotificationService } from 'src/notification/services/alarm.notification.service';
import { AlarmMessageTypeEnum } from 'src/notification/constants/alarm.notification.constant';
import { Types } from 'mongoose';
import { ConfluenceService } from 'src/confluence/services/confluence.service';
import { APP_HYBRID_AUDIT_RECORD_PAGE_ID } from 'src/confluence/constants/document.constants';
import { NotificationLarkService } from 'src/notification/services/lark.notification.service';

@Injectable()
export class WebhookTaskService {
  constructor(
    private readonly insightTasksServices: InsightTasksServices,
    private readonly notificationTeamsService: NotificationTeamsService,
    private readonly alarmNotificationService: AlarmNotificationService,
    private readonly blackHoleTaskService: BlackHoleTaskService,
    private readonly confluenceService: ConfluenceService,
    private readonly notificationLarkService: NotificationLarkService,
  ) {
    //
  }

  /**
   * 处理任务相关提交的入口方法
   * @param webhookInfo - Webhook 提交的基本信息
   */
  async handleCommitsForTaskId(webhookInfo: Partial<WebhookInfoType>, parsedMessage) {
    try {
      const { slug } = webhookInfo;

      // 忽略非技术方案要求的项目
      if (this.isIgnoredTaskRepo(slug)) return;

      const { scope } = parsedMessage;
      if (scope) {
        if (scope === BLACK_HOLE_TASK_ID) {
          this.handleBlackHoleTaskScope(webhookInfo);
        } else {
          this.handleTaskScope(scope, webhookInfo);
        }
      } else {
        this.sendCommitLintWarning(webhookInfo, '请使用正确格式的任务ID提交', '请使用正确格式的任务ID提交');
      }
    } catch (error) {
      console.error('Error Handle Commits For TaskId:', error);
      throw error;
    }
  }

  /**
   * 检查项目是否在忽略列表中
   * @param slug - 项目唯一标识
   */
  private isIgnoredTaskRepo(slug: string): boolean {
    return IGNORE_TASK_REPO_LIST.includes(slug);
  }

  /**
   * 根据任务 ID 处理万能任务
   * @param scope - 任务 ID
   * @param webhookInfo - Webhook 信息
   */
  private async handleBlackHoleTaskScope(webhookInfo: Partial<WebhookInfoType>) {
    await this.blackHoleTaskService.addTasksCommits({
      taskId: BLACK_HOLE_TASK_ID,
      slug: webhookInfo.slug,
      branch: webhookInfo.branch,
      author: webhookInfo.user._id as Types.ObjectId,
      authorOriginal: webhookInfo.authorEmail,
      commitId: webhookInfo.commitId,
      commitUrl: webhookInfo.commitUrl,
      createdAt: new Date(),
      updatedAt: null,
      readStatus: false,
    });
  }

  /**
   * 根据任务 ID 处理任务
   * @param scope - 任务 ID
   * @param webhookInfo - Webhook 信息
   */
  private async handleTaskScope(scope: string, webhookInfo: Partial<WebhookInfoType>) {
    const task = await this.insightTasksServices.getTaskWithUpdatedInfo(scope, webhookInfo.repo, webhookInfo.user);
    if (!task) {
      this.sendCommitLintWarning(
        webhookInfo,
        `任务 ID: ${scope} 的技术方案未找到，请检查`,
        `任务 ID: ${scope} 的技术方案未找到，请检查`,
      );
      return;
    }

    if (!task.wiki?.status) {
      this.sendCommitLintWarning(
        webhookInfo,
        `任务 ID: ${scope} 的技术方案不通过<br/><a href="${task.wiki.url}">${task.wiki.title}</a>`,
        `任务 ID: ${scope} 的技术方案不通过`,
        {
          title: task.wiki.title,
          url: task.wiki.url,
        },
      );
    } else {
      if (task.wiki.needH5Audit && !task.wiki.h5AuditStatus) {
        const wikiPage = await this.confluenceService.getArticleContent(APP_HYBRID_AUDIT_RECORD_PAGE_ID);
        const title = wikiPage.title;
        const url = wikiPage._links.base + wikiPage._links.webui;
        this.sendCommitLintWarning(
          webhookInfo,
          'Hybrid页面未通过App商店内容审批, 请检查' + `<br/><a href="${url}">${title}</a>`,
          'Hybrid页面未通过App商店内容审批, 请检查',
          {
            title,
            url,
            standard_wiki: 'https://k-devdoc.atlassian.net/wiki/spaces/frontend/whiteboard/685965442',
          },
        );
      }
    }
  }

  /**
   * 发送提交不符合规范的警告
   * @param webhookInfo - Webhook 信息
   * @param message - 警告信息
   */
  private async sendCommitLintWarning(
    webhookInfo: Partial<WebhookInfoType>,
    message: string,
    plainMessage: string,
    wiki?: {
      title: string;
      url: string;
      standard_wiki?: string;
    },
  ) {
    await this.alarmNotificationService.addAlarmNotification({
      ...webhookInfo,
      warnText: message,
      alarmType: AlarmMessageTypeEnum.COMMIT_LINT,
    });
    // TODO: ---deprecated---
    this.notificationTeamsService.sendWebhookWarnReport({
      ...webhookInfo,
      commitLint: message,
    });

    this.notificationLarkService.sendGitCommitWarning({
      project: webhookInfo.slug,
      branch: webhookInfo.branch,
      author: webhookInfo.user.email,
      standard: plainMessage,
      commit_id: webhookInfo.commitId,
      commit_url: webhookInfo.commitUrl,
      plan_name: wiki?.title ?? '#',
      plan_url: wiki?.url ?? '#',
      message: webhookInfo.message,
      standard_wiki: wiki?.standard_wiki ?? '#',
    });
  }
}

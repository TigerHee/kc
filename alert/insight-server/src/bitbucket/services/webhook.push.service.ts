import { Injectable } from '@nestjs/common';
import { RepoRefsChangedEvent } from '../../insight/types/repo_refs_changed.webhook.types';
import { IGNORE_ACTORS } from 'src/bitbucket/constants/ignore.actor.constants';
import { handleDiffHunks, shouldSkipFile } from 'src/bitbucket/bitbucket.utils';
import { PUSH_DIFF, ZERO_HASH } from 'src/bitbucket/constants/webhook.constants';
import { BitbucketWebhookService } from 'src/bitbucket/services/webhook.bitbucket.service';
import { NotificationTeamsService } from 'src/notification/services/teams.notification.service';
import { WebhookInfoType } from '../types/webhook.types';
import { WebhookTaskService } from './webhook.task.service';
import * as conventionalCommitsParser from 'conventional-commits-parser';
import { COMMIT_OPTIONS } from '../constants/commit.constants';
import { AlarmNotificationService } from 'src/notification/services/alarm.notification.service';
import { UserService } from 'src/auth/services/user.service';
import { AuthRoleEnum } from 'src/auth/constants/user.constant';
import { InjectModel } from '@nestjs/mongoose';
import { Repos } from 'src/insight/schemas/repos.schema';
import { IGNORE_REPO_LIST } from '../constants/ignore.repo.constants';
import { NotificationLarkService } from 'src/notification/services/lark.notification.service';
import { genCodeChangeMarkdown } from 'src/notification/utils/lark.template.utils';

@Injectable()
export class WebhookPushService {
  constructor(
    @InjectModel(Repos.name) private readonly insightReposModel,
    private readonly webhookTaskService: WebhookTaskService,
    private readonly bitbucketWebhookService: BitbucketWebhookService,
    private readonly notificationTeamsService: NotificationTeamsService,
    private readonly notificationLarkService: NotificationLarkService,
    private readonly alarmNotificationService: AlarmNotificationService,
    private readonly userService: UserService,
  ) {
    //
  }

  /**
   * 检查项目是否在忽略列表中
   * @param slug - 项目唯一标识
   */
  private isIgnoredRepo(slug: string): boolean {
    return IGNORE_REPO_LIST.includes(slug);
  }

  /**
   * 解析提交信息
   * @param message - 提交的 commit 信息
   */
  private parseCommitMessage(message: string) {
    return conventionalCommitsParser.sync(message, COMMIT_OPTIONS);
  }

  /**
   * 检查提交是否是允许的类型
   * @param parsedMessage - 解析后的提交信息
   */
  private isAllowedCommit(parsedMessage): boolean {
    const { merge, references, revert } = parsedMessage;
    return merge || references.some(({ issue }) => !!issue) || (revert && revert.hash);
  }

  /**
   * 处理提交差异
   * @param fromHash
   * @param toHash
   * @param webhookInfo
   * @returns
   */
  async handleCommitDiff(fromHash, toHash, webhookInfo) {
    try {
      if (!fromHash) {
        return;
      }
      const { diffs = [] } = await this.bitbucketWebhookService.getCommitDiff(
        webhookInfo.projectKey,
        webhookInfo.slug,
        toHash,
        fromHash,
      );
      if (diffs.length > 0) {
        const warns = [];
        diffs.map(({ destination, hunks }) => {
          const { toString, name, parent } = destination || {};
          PUSH_DIFF.map(({ matchLine, warnText, alarmType, diffTypes, parentSrc, fileNames, ignoredParents }) => {
            // 查看是否需要跳过的文件
            if (
              !hunks ||
              hunks.length === 0 ||
              shouldSkipFile(name, parent, { parentSrc, fileNames, ignoredParents })
            ) {
              return;
            }
            if (hunks && hunks.length > 0) {
              const diffPath = handleDiffHunks(hunks, matchLine, diffTypes);
              if (diffPath.length > 0) {
                warns.push({
                  srcPath: toString,
                  diffPath,
                  warnText,
                  alarmType,
                });
              }
            }
          });
        });
        if (warns.length > 0) {
          for (const { warnText, alarmType } of warns) {
            await this.alarmNotificationService.addAlarmNotification({ ...webhookInfo, warnText, alarmType });
          }

          // TODO: ---deprecated---
          this.notificationTeamsService.sendWebhookWarnReport(webhookInfo, warns);

          this.notificationLarkService.sendGitPushCodeStandardWarning({
            project: webhookInfo.slug,
            branch: webhookInfo.branch,
            author: webhookInfo.user.email,
            message: webhookInfo.message,
            commit_id: webhookInfo.commitId,
            commit_url: webhookInfo.commitUrl,
            plan_name: webhookInfo.prId ?? '#',
            plan_url: webhookInfo.prUrl ?? '#',
            issue_table: warns.map((warn) => ({
              standard: warn.warnText,
              path: warn.srcPath,
              content: warn.diffPath
                .flatMap(({ type, lines }) => lines.map((line) => genCodeChangeMarkdown(line, type)))
                .join(''),
            })),
          });
        }
      }
    } catch (error) {
      console.error('Error Handle Commit Diff:', error);
      throw error;
    }
  }

  async handleRefsChanged(payload: RepoRefsChangedEvent): Promise<void> {
    const { fromHash, toHash, ref } = payload.changes[0] || {};
    const { project, slug } = payload.repository;
    const { emailAddress, displayName } = payload.actor || {};
    if (toHash === ZERO_HASH || !toHash || IGNORE_ACTORS.includes(emailAddress) || this.isIgnoredRepo(slug)) {
      return;
    }

    const { message } = await this.bitbucketWebhookService.getCommitById(project.key, slug, toHash);
    let user = await this.userService.getUserByEmail(emailAddress);
    if (!user) {
      user = await this.userService.createUser({
        role: AuthRoleEnum.USER,
        email: emailAddress,
        name: displayName,
      });
    }
    const repo = await this.insightReposModel.findOne({ slug, isDeleted: false }).exec();
    const webhookInfo: Partial<WebhookInfoType> = {
      eventKey: payload.eventKey,
      projectKey: project.key,
      slug,
      branch: ref.displayId || '',
      message: message,
      commitId: toHash.substring(0, 10),
      commitUrl: `${project.links.self[0].href}/repos/${slug}/commits/${toHash}`,
      user,
      repo,
      authorEmail: emailAddress,
    };
    // 解析提交信息
    const parsedMessage = this.parseCommitMessage(message);
    // 如果是merge, references, revert 不进行检查
    if (this.isAllowedCommit(parsedMessage)) {
      return;
    }
    //diff 变化告警提示
    await this.handleCommitDiff(fromHash, toHash, webhookInfo);
    // 处理任务相关的内容
    this.webhookTaskService.handleCommitsForTaskId(webhookInfo, parsedMessage);
  }
}

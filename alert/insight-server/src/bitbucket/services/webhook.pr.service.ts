import { Injectable } from '@nestjs/common';
import { PrOpenedEvent } from '../../insight/types/pr_opened.webhook.types';
import { PrFromRefUpdatedEvent } from '../../insight/types/pr_from_ref_updated.webhook.types';
import { PrMergedEvent } from '../../insight/types/pr_merged.webhooks.types';
import { IGNORE_ACTORS } from 'src/bitbucket/constants/ignore.actor.constants';
import { normalizeString, handleDiffHunks, shouldSkipFile } from 'src/bitbucket/bitbucket.utils';
import { COMMENTS_DIFF } from 'src/bitbucket/constants/webhook.constants';
import { BitbucketWebhookService } from 'src/bitbucket/services/webhook.bitbucket.service';
import { CommentItem } from 'src/bitbucket/types/webhook.types';
import { UserService } from 'src/auth/services/user.service';

@Injectable()
export class WebhookPrService {
  constructor(
    private readonly BitbucketWebhookService: BitbucketWebhookService,
    private readonly userService: UserService,
  ) {
    //
  }

  private findMatchingComment(comments, warnText) {
    return comments.some((item) => normalizeString(item.text) === normalizeString(warnText));
  }

  private async addComments(projectKey: string, slug: string, prId: number, comments: CommentItem[]) {
    if (comments.length === 0) return;
    // 批量提交评论
    await Promise.all(
      comments.map((comment) => this.BitbucketWebhookService.addPullRequestComments(projectKey, slug, prId, comment)),
    );
  }

  private async handlePrDiffAddComments(projectKey, slug, prId) {
    const comments = [];
    const { diffs = [] } = await this.BitbucketWebhookService.getPullRequestDiff(projectKey, slug, prId);
    if (diffs.length === 0) return;

    const { values = [] } = await this.BitbucketWebhookService.getPullRequestComments(projectKey, slug, prId);
    for (const diffConfig of COMMENTS_DIFF) {
      for (const { destination, hunks } of diffs) {
        const { name, toString, parent } = destination || {};
        const { matchLine, warnText, diffTypes, diffLineOnly, parentSrc, fileNames } = diffConfig;

        if (!hunks || hunks.length === 0 || shouldSkipFile(name, parent, { parentSrc, fileNames })) {
          continue;
        }

        const diffPath = handleDiffHunks(hunks, matchLine, diffTypes);
        if (diffPath.length === 0) continue;

        if (diffLineOnly) {
          // 单行检查
          if (!this.findMatchingComment(values, warnText)) {
            comments.push({ text: warnText, severity: 'BLOCKER' });
            break; // 一个有效路径即可
          }
        } else {
          // 逐行处理
          for (const { lines, type } of diffPath) {
            for (const { destination, commentIds = [] } of lines) {
              const isSameLineComment = values.find((item) => commentIds.find((id) => id === item.id));
              if (!isSameLineComment) {
                comments.push({
                  text: warnText,
                  severity: 'BLOCKER',
                  anchor: {
                    diffType: 'EFFECTIVE',
                    path: toString,
                    lineType: type,
                    line: destination,
                    fileType: type === 'REMOVED' ? 'FROM' : 'TO',
                  },
                });
              }
            }
          }
        }
      }
    }

    await this.addComments(projectKey, slug, prId, comments);
  }
  /**
   * 处理 PR Opened 和 FromRefUpdated 公共逻辑
   */
  async handlePrOpenedOrUpdated(payload: PrOpenedEvent | PrFromRefUpdatedEvent): Promise<void> {
    const { toRef, id } = payload.pullRequest;
    const { emailAddress } = payload.actor || {};
    const { project, slug } = toRef.repository;

    // 忽略kufox 自动合入
    if (IGNORE_ACTORS.includes(emailAddress)) {
      return;
    }

    // release 和 hotfix 分支自动添加评论
    if (toRef.displayId && /^(release|hotfix)/.test(toRef.displayId)) {
      this.handlePrDiffAddComments(project.key, slug, id);
    }

    // PR链接
    const prLink = `${project.links.self[0].href}/repos/${slug}/pull-requests/${id}`;
    // // PR作者邮箱
    // const pullRequestAuthorEmail = payload.pullRequest.author.user.emailAddress;
    // // PR作者是否有权限
    // const prAuth = await this.userService.getUserPrAuth(pullRequestAuthorEmail);

    const commits = await this.BitbucketWebhookService.getPullRequestCommits(project.key, slug, id);

    if (commits.values.length !== 0) {
      const _commitAuthorEmails = commits.values.map((commit) => commit.author.emailAddress);
      // 去重复数据
      const commitAuthorEmails: string[] = Array.from(new Set(_commitAuthorEmails));
      const prRejectUser = await this.userService.getPrRejectInEmails(commitAuthorEmails);
      if (prRejectUser.length > 0) {
        const insertRecordData = [];
        const prAuthData = [];
        prRejectUser.forEach(async (user) => {
          insertRecordData.push({
            user: user._id,
            link: prLink,
            email: user.email,
            reason: user.prAuth.rejectReason,
          });
          prAuthData.push({
            username: user.name,
            reason: user.prAuth.rejectReason,
          });
        });
        const res = await this.BitbucketWebhookService.declinePullRequest(
          project.key,
          slug,
          id,
          payload.pullRequest.version,
          '「INSIGHT」PR自动拒绝:  ' + prAuthData.map((p) => `${p.username}(${p.reason})`).join(', ') + ' 没有权限',
        );
        if (res) {
          await this.userService.addPrRejectRecords(insertRecordData);
        }
      }
    }

    // const branchInfo = `${fromRef.displayId} ${toRef.displayId}`;
    // console.log(branchInfo);
    // 非技术方案要求的项目忽略
    // if (IGNORE_PROJECTS.includes(slug)) {
    //   return payload;
    // }

    // const parsedMessages = await parseCommitMessages(project.key, slug, id);
    // const [message, errorMsg] = formatParsedMessages(parsedMessages, taskIds);

    // const prUrl = `${project.links.self[0].href}/repos/${slug}/pull-requests/${id}`;
    // const pr = {
    //   status: errorMsg === "",
    //   eventKey: payload.eventKey,
    //   slug,
    //   branch: branchInfo,
    //   message: errorMsg,
    //   commitId: properties ? properties.mergeCommit.displayId : "",
    //   commitUrl: properties
    //     ? `${project.links.self[0].href}/repos/${slug}/commits/${properties.mergeCommit.id}`
    //     : "",
    //   author: prAuthor,
    //   prId: id,
    //   prUrl,
    //   prSlug: slug,
    //   warnText: "提交不符合规范",
    // };
    // taskChanged.pr = pr;
    // taskChanged.prId = id;
    // taskChanged.prSlug = slug;

    // if (errorMsg) {
    //   await sendTeamsReport(app, pr);
    //   await declinePullRequest(project.key, slug, id, version, errorMsg);
    // }
  }

  /**
   * 处理 PR Merged 逻辑
   */
  handlePrMerged(payload: PrMergedEvent): void {
    console.log('Handling PR Merged Event:', payload.eventKey);
    // TODO: 填入处理逻辑
  }
}

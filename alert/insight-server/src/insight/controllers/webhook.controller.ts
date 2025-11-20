import { Body, Controller, Param, Post } from '@nestjs/common';
import { PrOpenedEvent } from '../types/pr_opened.webhook.types';
import { RepoRefsChangedEvent } from '../types/repo_refs_changed.webhook.types';
import { PrMergedEvent } from '../types/pr_merged.webhooks.types';
import { PrFromRefUpdatedEvent } from '../types/pr_from_ref_updated.webhook.types';
import { WebhookEventEnum } from '../constants/insight.constant';
import { WebhookPrService } from '../../bitbucket/services/webhook.pr.service';
import { WebhookPushService } from '../../bitbucket/services/webhook.push.service';

@Controller('test')
export class InsightWebhookController {
  constructor(
    private readonly webhookPrService: WebhookPrService,
    private readonly webhookPushService: WebhookPushService,
  ) {
    //
  }
  @Post(':webhook')
  async insightWebhook(
    @Param('webhook') webhook: string,
    @Body() payload: PrFromRefUpdatedEvent | PrMergedEvent | PrOpenedEvent | RepoRefsChangedEvent,
  ): Promise<void> {
    if (webhook === 'for-test') {
      // 测试仓库接口
      return;
    }
    switch (payload.eventKey) {
      case WebhookEventEnum.EVENT_PR_MERGED:
        break;
      case WebhookEventEnum.EVENT_PR_OPENED:
        await this.webhookPrService.handlePrOpenedOrUpdated(payload);
        break;
      case WebhookEventEnum.EVENT_PR_FROM_REF_UPDATED:
        await this.webhookPrService.handlePrOpenedOrUpdated(payload);
        break;
      case WebhookEventEnum.EVENT_REFS_CHANGED:
        await this.webhookPushService.handleRefsChanged(payload);
        break;
      default:
        throw new Error('Unknown event');
    }
  }
}

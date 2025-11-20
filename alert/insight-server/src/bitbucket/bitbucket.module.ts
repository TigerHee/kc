import { Module } from '@nestjs/common';
import { BitbucketService } from './services/bitbucket.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BitbucketPackageService } from './services/package.bitbucket.service';
import { BitbucketJscramblerService } from './services/jscrambler.bitbucket.service';
import { BitbucketOfflineService } from './services/offline.bitbucket.service';
import { BitbucketWebhookService } from './services/webhook.bitbucket.service';
import { BitbucketHttpModule } from './bitbucket.http.module';
import { WebhookPrService } from './services/webhook.pr.service';
import { WebhookPushService } from './services/webhook.push.service';
import { NotificationTeamsService } from 'src/notification/services/teams.notification.service';
import { WebhookTaskService } from './services/webhook.task.service';
import { InsightTasksServices } from 'src/insight/services/tasks.insight.service';
import { UserService } from 'src/auth/services/user.service';
import { ConfluenceDocumentService } from 'src/confluence/services/confluence.page.service';
import { ConfluenceService } from 'src/confluence/services/confluence.service';
import { Tasks, TasksSchema } from 'src/insight/schemas/tasks.schema';
import { User, UserSchema } from 'src/auth/schemas/user.schema';
import { Repos, ReposSchema } from 'src/insight/schemas/repos.schema';
import { BlackHoleTaskService } from 'src/insight/services/black-hole.task.service';
import { BlackHoleCommit } from 'src/insight/schemas/black-hole-commit.tasks.schema';
import { AlarmNotificationService } from 'src/notification/services/alarm.notification.service';
import { AlarmMessage, AlarmMessageSchema } from 'src/notification/schemas/alarm-message.schema';
import { PackageJsScan, PackageJsScanSchema } from './schemas/package-json-scans.schema';
import { JscramblerConfigJson, JscramblerConfigJsonSchema } from './schemas/jscrambler-config-json.schema';
import { OffconfigJs, OffconfigJsSchema } from './schemas/offconfig-js.schema';
import { Projects, ProjectsSchema } from 'src/insight/schemas/projects.schema';
import { InsightReposService } from 'src/insight/services/repos.insight.service';
import { PrRejectRecord, PrRejectRecordSchema } from 'src/auth/schemas/pr-reject-record.user.schema';
import { UserLog, UserLogSchema } from 'src/auth/schemas/user-log.schema';
import { NotificationLarkService } from 'src/notification/services/lark.notification.service';
import { BitbucketComplianceService } from './services/compliance.bitbucket.service';
import { BitbucketController } from './controllers/bitbucket.controller';

@Module({
  controllers: [BitbucketController],
  imports: [
    BitbucketHttpModule.register(),
    MongooseModule.forFeature([
      { name: Tasks.name, schema: TasksSchema },
      { name: User.name, schema: UserSchema },
      { name: Repos.name, schema: ReposSchema },
      { name: BlackHoleCommit.name, schema: BlackHoleCommit },
      { name: AlarmMessage.name, schema: AlarmMessageSchema },
      { name: PackageJsScan.name, schema: PackageJsScanSchema },
      { name: JscramblerConfigJson.name, schema: JscramblerConfigJsonSchema },
      { name: OffconfigJs.name, schema: OffconfigJsSchema },
      { name: Projects.name, schema: ProjectsSchema },
      { name: PrRejectRecord.name, schema: PrRejectRecordSchema },
      { name: UserLog.name, schema: UserLogSchema },
    ]),
  ],
  providers: [
    BitbucketService,
    BitbucketPackageService,
    BitbucketJscramblerService,
    BitbucketOfflineService,
    BitbucketWebhookService,
    WebhookPrService,
    WebhookPushService,
    WebhookTaskService,
    BitbucketComplianceService,
    // 外部服务
    NotificationTeamsService,
    InsightTasksServices,
    BlackHoleTaskService,
    UserService,
    ConfluenceDocumentService,
    ConfluenceService,
    AlarmNotificationService,
    InsightReposService,
    NotificationLarkService,
  ],
  exports: [
    BitbucketService,
    BitbucketPackageService,
    BitbucketJscramblerService,
    BitbucketOfflineService,
    BitbucketWebhookService,
    WebhookPrService,
    WebhookPushService,
    WebhookTaskService,
    InsightReposService,
  ],
})
export class BitbucketModule {
  //
}

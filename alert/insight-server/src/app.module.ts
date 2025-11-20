import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AgendaModule } from './agenda/agenda.module';
import { AgendaTaskController } from './agenda/controller/job.agenda.controller';
import { AgendaActionController } from './agenda/controller/action.agenda.controller';
import { AgendaJobLogController } from './agenda/controller/log.job.agenda.controller';
import { AgendaInvokeController } from './agenda/controller/invoke.agenda.controller';
import { BitbucketModule } from './bitbucket/bitbucket.module';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from './notification/notification.module';
import { NotificationController } from './notification/controller/notification.controller';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { OnetrustModule } from './onetrust/onetrust.module';
import { OnetrustController } from './onetrust/onetrust.controller';
import { InsightModule } from './insight/insight.module';
import { AgendaDashBoardController } from './agenda/controller/dashboard.agenda.controller';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { AuthGuard } from './auth/guards/auth.guard';
import { RouterInspectorInterceptor } from './common/router.inspector.interceptor';
import { ConfluenceModule } from './confluence/confluence.module';
import { InsightWebhookController } from './insight/controllers/webhook.controller';
import { InsightTasksController } from './insight/controllers/tasks.controller';
import { InsightProjectsController } from './insight/controllers/projects.controller';
import { KufoxModule } from './kufox/kufox.module';
import { WorkflowModule } from './workflow/workflow.module';
import { InsightReposController } from './insight/controllers/repos.controller';
import { WorkflowController } from './workflow/workflow.controller';
import { OncallController } from './insight/controllers/oncall.controller';
import { InsightRoutesController } from './insight/controllers/route.controller';
import { BlackHoleTaskController } from './insight/controllers/black-hole.task.controller';
import { AlarmNotificationController } from './notification/controller/alarm.notification.controller';
import { SystemNotificationController } from './notification/controller/system.notification.controller';
import { SourcemapController } from './insight/controllers/sourcemap.controller';
import { WebSocketModule } from './websocket/websocket.module';
import { PuppeteerModule } from './puppeteer/puppeteer.module';
import { CheckerModule } from './checker/checker.module';
import { CheckerController } from './checker/checker.controller';
import { LottieModule } from './lottie/lottie.module';
import { TerminalModule } from './terminal/terminal.module';
import { RagController } from './insight/controllers/rag.controller';
import { AlertModule } from './alert/alert.module';
import { PipelineModule } from './pipeline/pipeline.module';
import { AnnouncementModule } from './announcement/announcement.module';
import { ComplianceModule } from './compliance/compliance.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    AgendaModule.forRoot({
      db: { address: process.env.MONGODB_URL, collection: 'jobs' },
      processEvery: process.env.JOB_CORE_PROCESS_EVERY,
      maxConcurrency: Number(process.env.JOB_CORE_MAX_CONCURRENCY),
      defaultConcurrency: Number(process.env.JOB_CORE_DEFAULT_CONCURRENCY),
    }),
    WebSocketModule,
    BitbucketModule,
    NotificationModule,
    OnetrustModule,
    AuthModule,
    InsightModule,
    ConfluenceModule,
    KufoxModule,
    WorkflowModule,
    PuppeteerModule,
    CheckerModule,
    LottieModule,
    TerminalModule,
    AlertModule,
    PipelineModule,
    AnnouncementModule,
    ComplianceModule,
  ],
  controllers: [
    AgendaDashBoardController,
    AgendaTaskController,
    AgendaActionController,
    AgendaJobLogController,
    AgendaInvokeController,
    NotificationController,
    AppController,
    OnetrustController,
    InsightWebhookController,
    InsightTasksController,
    InsightProjectsController,
    InsightReposController,
    WorkflowController,
    OncallController,
    InsightRoutesController,
    BlackHoleTaskController,
    AlarmNotificationController,
    SystemNotificationController,
    SourcemapController,
    CheckerController,
    RagController,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_INTERCEPTOR, useClass: RouterInspectorInterceptor },
  ],
  exports: [],
})
export class AppModule {
  //
}

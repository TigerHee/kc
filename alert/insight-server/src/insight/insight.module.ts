import { Global, Module } from '@nestjs/common';
import { InsightService } from './insight.service';
import { NotificationTeamsService } from 'src/notification/services/teams.notification.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Projects, ProjectsSchema } from './schemas/projects.schema';
import { OnCall, OnCallSchema } from './schemas/oncall.schema';
import { Tasks, TasksSchema } from './schemas/tasks.schema';
import { InsightTasksServices } from './services/tasks.insight.service';
import { InsightProjectsService } from './services/projects.insight.service';
import { Repos, ReposSchema } from './schemas/repos.schema';
import { InsightReposService } from './services/repos.insight.service';
import { InsightOncallService } from './services/oncall.insight.service';
import { ProjectWorkflowRecord, ProjectWorkflowRecordSchema } from './schemas/project-workflow-record.schema';
import { AuthModule } from 'src/auth/auth.module';
import { Workflow, WorkflowSchema } from 'src/workflow/schemas/workflow.schema';
import { Routes, RoutesSchema } from './schemas/route.schema';
import { InsightRoutesService } from './services/routes.insight.service';
import { ConfluenceService } from 'src/confluence/services/confluence.service';
import { ConfluenceDocumentService } from 'src/confluence/services/confluence.page.service';
import { BlackHoleCommit, BlackHoleCommitSchema } from './schemas/black-hole-commit.tasks.schema';
import { BlackHoleTaskService } from './services/black-hole.task.service';
import { SourcemapService } from './services/sourcemap.service';
import { PuppeteerService } from 'src/puppeteer/services/puppeteer.service';
import { BitbucketService } from 'src/bitbucket/services/bitbucket.service';
import { WorkflowService } from 'src/workflow/workflow.service';
import { ProjectWorkflowSchedule, ProjectWorkflowScheduleSchema } from './schemas/project-workflow-schedule.schema';
import { AutoProjectsInsightService } from './services/auto.project.insight.service';
import {
  ProjectWorkflowRecordNode,
  ProjectWorkflowRecordNodeSchema,
} from './schemas/project-workflow-record-node.schema';
import ProjectWorkflowInsightService from './services/workflow.projects.insight.service';
import { ProjectsScheduleInsightService } from './services/schedule.projects.insight.service';
import { ProjectsLogsInsightService } from './services/logs.projects.insight.service';
import { JobLog } from 'src/agenda/schemas/job-log.schema';
import { BitbucketPackageService } from 'src/bitbucket/services/package.bitbucket.service';
import { PackageJsScan, PackageJsScanSchema } from 'src/bitbucket/schemas/package-json-scans.schema';
import { BitbucketOfflineService } from 'src/bitbucket/services/offline.bitbucket.service';
import { OffconfigJs, OffconfigJsSchema } from 'src/bitbucket/schemas/offconfig-js.schema';
import { BitbucketJscramblerService } from 'src/bitbucket/services/jscrambler.bitbucket.service';
import { JscramblerConfigJson, JscramblerConfigJsonSchema } from 'src/bitbucket/schemas/jscrambler-config-json.schema';
import { MustReadWikiList, MustReadWikiListSchema } from './schemas/must-read-wiki-list.schema';
import { MustReadInsightService } from './services/must-read.insight.service';
import MustReadController from './controllers/must-read.controller';
import { User, UserSchema } from 'src/auth/schemas/user.schema';
import { NotificationLarkService } from 'src/notification/services/lark.notification.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Projects.name, schema: ProjectsSchema },
      { name: OnCall.name, schema: OnCallSchema },
      { name: Tasks.name, schema: TasksSchema },
      { name: Repos.name, schema: ReposSchema },
      { name: ProjectWorkflowRecord.name, schema: ProjectWorkflowRecordSchema },
      { name: Workflow.name, schema: WorkflowSchema },
      { name: Routes.name, schema: RoutesSchema },
      { name: BlackHoleCommit.name, schema: BlackHoleCommitSchema },
      { name: ProjectWorkflowSchedule.name, schema: ProjectWorkflowScheduleSchema },
      { name: ProjectWorkflowRecordNode.name, schema: ProjectWorkflowRecordNodeSchema },
      { name: JobLog.name, schema: JobLog },
      { name: PackageJsScan.name, schema: PackageJsScanSchema },
      { name: OffconfigJs.name, schema: OffconfigJsSchema },
      { name: JscramblerConfigJson.name, schema: JscramblerConfigJsonSchema },
      { name: MustReadWikiList.name, schema: MustReadWikiListSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
  ],
  providers: [
    // 内部服务
    InsightService,
    InsightTasksServices,
    InsightReposService,
    InsightOncallService,
    InsightRoutesService,
    BlackHoleTaskService,
    SourcemapService,
    InsightProjectsService,
    ProjectWorkflowInsightService,
    ProjectsScheduleInsightService,
    ProjectsLogsInsightService,
    MustReadInsightService,
    // 外部服务
    NotificationTeamsService,
    ConfluenceService,
    ConfluenceDocumentService,
    PuppeteerService,
    BitbucketService,
    WorkflowService,
    AutoProjectsInsightService,
    BitbucketPackageService,
    BitbucketOfflineService,
    BitbucketJscramblerService,
    NotificationLarkService,
  ],
  exports: [
    InsightService,
    InsightTasksServices,
    InsightReposService,
    InsightOncallService,
    InsightRoutesService,
    BlackHoleTaskService,
    ConfluenceService,
    ConfluenceDocumentService,
    SourcemapService,
    InsightProjectsService,
    ProjectWorkflowInsightService,
    ProjectsScheduleInsightService,
    ProjectsLogsInsightService,
    BitbucketService,
    WorkflowService,
    AutoProjectsInsightService,
    MustReadInsightService,
  ],
  controllers: [MustReadController],
})
export class InsightModule {
  //
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrRejectRecord, PrRejectRecordSchema } from 'src/auth/schemas/pr-reject-record.user.schema';
import { UserLog, UserLogSchema } from 'src/auth/schemas/user-log.schema';
import { User, UserSchema } from 'src/auth/schemas/user.schema';
import { UserService } from 'src/auth/services/user.service';
import { ConfluenceDocumentService } from 'src/confluence/services/confluence.page.service';
import { ConfluenceService } from 'src/confluence/services/confluence.service';
import { Repos, ReposSchema } from 'src/insight/schemas/repos.schema';
import { Tasks, TasksSchema } from 'src/insight/schemas/tasks.schema';
import { InsightTasksServices } from 'src/insight/services/tasks.insight.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tasks.name, schema: TasksSchema },
      { name: Repos.name, schema: ReposSchema },
      { name: User.name, schema: UserSchema },
      { name: PrRejectRecord.name, schema: PrRejectRecordSchema },
      { name: UserLog.name, schema: UserLogSchema },
    ]),
  ],
  providers: [InsightTasksServices, UserService, ConfluenceDocumentService, ConfluenceService],
})
export class CheckerModule {
  //
}

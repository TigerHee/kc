import { Module } from '@nestjs/common';
import { KufoxService } from './kufox.service';
import { KufoxController } from './kufox.controller';
import { KufoxHttpModule } from './kufox.http.module';
import { InsightTasksServices } from 'src/insight/services/tasks.insight.service';
import { AuthModule } from 'src/auth/auth.module';
import { ConfluenceModule } from 'src/confluence/confluence.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Tasks, TasksSchema } from 'src/insight/schemas/tasks.schema';
import { Repos, ReposSchema } from 'src/insight/schemas/repos.schema';

@Module({
  imports: [
    KufoxHttpModule.register(),
    MongooseModule.forFeature([
      { name: Tasks.name, schema: TasksSchema },
      { name: Repos.name, schema: ReposSchema },
    ]),
    AuthModule,
    ConfluenceModule,
  ],
  providers: [KufoxService, InsightTasksServices],
  controllers: [KufoxController],
})
export class KufoxModule {
  //
}

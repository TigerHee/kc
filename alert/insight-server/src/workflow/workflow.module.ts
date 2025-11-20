import { Module } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Workflow, WorkflowSchema } from './schemas/workflow.schema';
import { AuthModule } from 'src/auth/auth.module';
import {
  ProjectWorkflowSchedule,
  ProjectWorkflowScheduleSchema,
} from 'src/insight/schemas/project-workflow-schedule.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Workflow.name, schema: WorkflowSchema },
      {
        name: ProjectWorkflowSchedule.name,
        schema: ProjectWorkflowScheduleSchema,
      },
    ]),
    // 外部模块
    AuthModule,
  ],
  providers: [WorkflowService],
  exports: [WorkflowService],
})
export class WorkflowModule {
  //
}

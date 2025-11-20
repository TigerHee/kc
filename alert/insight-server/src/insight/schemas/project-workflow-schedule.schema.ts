import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { Jobs } from 'src/agenda/schemas/jobs.schema';
import { ProjectWorkflowRecord } from './project-workflow-record.schema';
import { Workflow } from 'src/workflow/schemas/workflow.schema';
import { Projects } from './projects.schema';

export type ProjectWorkflowScheduleDocument = ProjectWorkflowSchedule & Document;

@Schema({ collection: 'projects-workflow-schedule' })
export class ProjectWorkflowSchedule {
  @Prop({ required: false, type: Types.ObjectId, ref: 'Projects' })
  project: Types.ObjectId | Projects;

  @Prop({
    required: false,
    type: [Types.ObjectId],
    ref: 'ProjectWorkflowRecord',
  })
  workflowRecord: Types.ObjectId[] | ProjectWorkflowRecord[];

  @Prop({ required: true, type: String })
  interval: string;

  /**
   * 定时任务调度这个工作
   */
  @Prop({ required: false, type: Types.ObjectId, ref: 'Jobs' })
  job: Types.ObjectId | Jobs;

  @Prop({ type: Types.ObjectId, ref: Workflow.name })
  workflow: Types.ObjectId | Workflow;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const ProjectWorkflowScheduleSchema = SchemaFactory.createForClass(ProjectWorkflowSchedule);

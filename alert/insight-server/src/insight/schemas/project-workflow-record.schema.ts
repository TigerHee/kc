import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ProjectWorkflowRecordNode } from './project-workflow-record-node.schema';
import { Projects } from './projects.schema';

export type ProjectWorkflowRecordDocument = ProjectWorkflowRecord & Document;

@Schema({ collection: 'project-workflow-record' })
export class ProjectWorkflowRecord {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({ required: false, type: Types.ObjectId, ref: Projects.name })
  project: Types.ObjectId | Projects;

  @Prop({ default: 0, type: Number })
  currentStep: number;

  @Prop({
    required: true,
    type: [Types.ObjectId],
    ref: ProjectWorkflowRecordNode.name,
  })
  nodes: [Types.ObjectId | ProjectWorkflowRecordNode];

  @Prop({ type: Boolean, default: false })
  status: boolean;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const ProjectWorkflowRecordSchema = SchemaFactory.createForClass(ProjectWorkflowRecord);

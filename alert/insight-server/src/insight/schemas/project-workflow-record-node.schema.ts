import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { Jobs } from 'src/agenda/schemas/jobs.schema';

export type ProjectWorkflowRecordNodeDocument = ProjectWorkflowRecordNode & Document;

@Schema({ collection: 'project-workflow-record-node' })
export class ProjectWorkflowRecordNode extends Document {
  /** 任务定义的名字 */
  @Prop({ required: true })
  name: string;

  /** 是否完成的状态 */
  @Prop({ required: true })
  status: boolean;

  /** 任务定义的描述 */
  @Prop({ required: true })
  desc: string;

  /** 执行的实例 */
  @Prop({ required: false, type: Types.ObjectId, ref: Jobs.name, default: null })
  job: Types.ObjectId | Jobs;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const ProjectWorkflowRecordNodeSchema = SchemaFactory.createForClass(ProjectWorkflowRecordNode);

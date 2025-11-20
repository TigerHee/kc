import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
// import { WorkflowRecord } from './workflow-record.schema';
// import { Workflow } from 'src/workflow/schemas/workflow.schema';
import { Repos } from './repos.schema';

export type TasksDocument = Tasks & Document;
export type TasksRequestDocument = {
  wikiPageId: number;
  taskName: string;
  taskId: string;
  status: boolean;
} & Document;

@Schema({ collection: 'tasks' })
export class Tasks {
  @Prop({ required: true })
  taskName: string;

  @Prop({
    required: false,
    type: String,
    default: '',
    index: true,
    unique: true,
  })
  taskId: string;
  @Prop({
    required: true,
    type: Object,
    default: {
      pageId: 0,
      status: false,
      title: '',
      url: '',
      errors: [],
    },
  })
  wiki: {
    pageId?: number;
    status: boolean;
    title?: string;
    url?: string;
    errors: Array<{ title: string; content: string | string[] }>;
    needH5Audit?: boolean;
    h5AuditStatus?: boolean;
  };

  @Prop({ required: true, type: Number, default: 1 })
  wikiCheckerVersion: number;

  @Prop({ required: false, type: Types.ObjectId, ref: User.name })
  user: Types.ObjectId | User;

  @Prop({ type: Boolean, default: false })
  status: boolean;

  @Prop({ type: [Types.ObjectId], ref: Repos.name, default: [] })
  involveRepos: Types.ObjectId[] | Repos[];

  @Prop({ type: [Types.ObjectId], ref: User.name, default: [] })
  involveUsers: Types.ObjectId[] | User[];

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const TasksSchema = SchemaFactory.createForClass(Tasks);

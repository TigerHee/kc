import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { Repos } from './repos.schema';
import { ProjectWorkflowSchedule, ProjectWorkflowScheduleDocument } from './project-workflow-schedule.schema';

export type ProjectsDocument = Projects & Document;

@Schema({ collection: 'projects' })
export class Projects extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false, type: Types.ObjectId, ref: User.name })
  owner: Types.ObjectId | User;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: Repos.name,
  })
  repos: Types.ObjectId | Repos;

  @Prop({ required: false, default: '', type: String })
  accessibleLink: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  updatedAt: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: false, types: Number, default: true })
  status: boolean;

  @Prop({
    required: false,
    type: Object,
    default: {
      status: null,
      total: 0,
      routes: [],
      updatedAt: null,
    },
  })
  metaRoutes: {
    status: boolean;
    total: number;
    routes: string[];
    updatedAt: Date;
  };

  @Prop({
    required: false,
    type: Object,
    default: {
      status: null,
      unLockTotal: 0,
      lockTotal: 0,
      total: 0,
      updatedAt: null,
    },
  })
  metaDeps: {
    status: boolean;
    total: number;
    unLockTotal: number;
    lockTotal: number;
    updatedAt: Date;
  };

  @Prop({
    required: false,
    type: Object,
    default: {
      status: null,
      updatedAt: null,
    },
  })
  metaOfflineAppV3: {
    status: boolean;
    maximumFileSizeToCacheInBytes: number;
    updatedAt: Date;
  };

  @Prop({
    required: false,
    type: Object,
    default: {
      status: null,
      updatedAt: null,
    },
  })
  metaJscrambler: {
    status: boolean;
    updatedAt: Date;
  };

  @Prop({
    required: false,
    type: Object,
    default: {
      status: null,
      updatedAt: null,
    },
  })
  metaWebChecker: {
    status: boolean;
    updatedAt: Date;
  };

  @Prop({
    required: false,
    type: Object,
    default: {
      status: null,
      updatedAt: null,
    },
  })
  metaWebTest: {
    status: boolean;
    updatedAt: Date;
  };

  @Prop({
    required: false,
    type: Object,
    default: {
      status: null,
      tenant: ['KC'],
      updatedAt: null,
    },
  })
  metaTenant: {
    status: boolean;
    tenant: string[];
    updatedAt: Date;
  };

  @Prop({
    required: false,
    type: Object,
    default: {
      status: null,
      updatedAt: null,
    },
  })
  metaUnitTests: {
    status: boolean;
    updatedAt: Date;
  };

  @Prop({
    required: false,
    type: [Types.ObjectId],
    ref: ProjectWorkflowSchedule.name,
  })
  workflowSchedule: Types.ObjectId[] | ProjectWorkflowScheduleDocument[];
}

export const ProjectsSchema = SchemaFactory.createForClass(Projects);

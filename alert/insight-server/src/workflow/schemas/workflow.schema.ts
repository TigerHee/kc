import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';

export type WorkflowDocument = Workflow & Document;

@Schema({ collection: 'workflow' })
export class Workflow {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  desc: string;

  @Prop({ required: true, default: 'project', type: String })
  scope: string;

  @Prop({
    required: true,
    type: [
      {
        name: String,
        desc: String,
      },
    ],
  })
  node: Array<{
    name: string;
    desc: string;
  }>;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ required: false, type: Types.ObjectId, ref: User.name })
  createdBy: User | Types.ObjectId;

  @Prop({ required: false, default: Date.now })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt: Date;
}

export const WorkflowSchema = SchemaFactory.createForClass(Workflow);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';

export type BlackHoleCommitDocument = BlackHoleCommit & Document;
export type BlackHoleCommitType = BlackHoleCommit;

@Schema({ collection: 'black-hole-task-commits' })
export class BlackHoleCommit {
  @Prop({ required: false, type: Types.ObjectId, ref: User.name })
  author: Types.ObjectId | User | string;

  @Prop({ required: false, type: String })
  authorOriginal: string;

  @Prop({ required: true, type: String })
  branch: string;

  @Prop({ required: true, type: String })
  commitId: string;

  @Prop({ required: true, type: String })
  commitUrl: string;

  @Prop({ required: false, type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ required: false, type: Date, default: null })
  updatedAt: Date;

  @Prop({ required: true, type: String })
  slug: string;

  @Prop({ required: true, type: String })
  taskId: string;

  @Prop({ required: false, type: Boolean, default: false })
  readStatus: boolean;
}

export const BlackHoleCommitSchema = SchemaFactory.createForClass(BlackHoleCommit);

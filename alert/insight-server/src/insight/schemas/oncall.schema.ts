import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { Repos } from './repos.schema';

export type OnCallDocument = OnCall & Document;

@Schema({ collection: 'oncall' })
export class OnCall {
  @Prop({ required: true })
  business: string;

  @Prop({ required: false })
  desc: string;

  @Prop({
    type: [Types.ObjectId],
    ref: User.name,
    required: true,
  })
  groupUsers: User[] | Types.ObjectId[];

  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  currentUser: User | Types.ObjectId;

  @Prop({ required: false })
  updatedAt: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: false, default: true })
  isActive: boolean;

  @Prop({ required: false, type: [Types.ObjectId], ref: Repos.name })
  relatedRepos: Repos[] | Types.ObjectId[];
}

export const OnCallSchema = SchemaFactory.createForClass(OnCall);

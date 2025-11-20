import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserDocument } from './user.schema';
import { Types, Document } from 'mongoose';

export type UserLogDocument = UserLog & Document;

@Schema({ collection: 'user-logs' })
export class UserLog {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId | UserDocument;

  @Prop({ required: true, type: String })
  action: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  actionBy: Types.ObjectId | UserDocument;

  @Prop({ required: true, type: String })
  prev: string;

  @Prop({ required: true, type: String })
  current: string;

  @Prop({ required: false, type: Date, default: Date.now })
  createdAt: Date;
}

export const UserLogSchema = SchemaFactory.createForClass(UserLog);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SystemMessageTypeEnum } from '../constants/system.notification.constant';
import { User } from 'src/auth/schemas/user.schema';

export type SystemMessageDocument = SystemMessage & Document;

@Schema({ collection: 'system-messages' })
export class SystemMessage {
  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  content: string;

  @Prop({ required: true, type: String })
  type: SystemMessageTypeEnum;

  @Prop({ required: false, type: Boolean, default: false })
  readStatus: boolean;

  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  sendTo: Types.ObjectId | User;

  @Prop({ required: false, type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ required: false, type: Date, default: null })
  updatedAt: Date;
}

export const SystemMessageSchema = SchemaFactory.createForClass(SystemMessage);

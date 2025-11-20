import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AlarmMessageTypeEnum } from '../constants/alarm.notification.constant';
import { User } from 'src/auth/schemas/user.schema';

export type AlarmMessageDocument = AlarmMessage & Document;

@Schema({ collection: 'alarm-messages' })
export class AlarmMessage {
  @Prop({ required: false, type: Types.ObjectId, ref: User.name })
  author: Types.ObjectId | User;

  @Prop({ required: false, type: String })
  authorOriginal: string;

  @Prop({ required: true, type: String })
  branch: string;

  @Prop({ required: false, type: String })
  commitId: string;

  @Prop({ required: false, type: String })
  commitUrl: string;

  @Prop({ required: false, type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ required: false, type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ required: true, type: String })
  eventKey: string;

  @Prop({ required: false, type: String, default: '' })
  message: string;

  @Prop({ required: true, type: String })
  slug: string;

  @Prop({ required: true, type: String })
  warnText: string;

  @Prop({ required: false, type: String, enum: AlarmMessageTypeEnum })
  alarmType: AlarmMessageTypeEnum;

  @Prop({ required: false, type: Boolean, default: false })
  readStatus: boolean;
}

export const AlarmMessageSchema = SchemaFactory.createForClass(AlarmMessage);

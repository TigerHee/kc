import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AlarmGroupDocument = AlarmGroup & Document;

@Schema({ timestamps: true })
export class AlarmGroup {
  @Prop({ required: true, unique: true, default: '' })
  name: string;
}

export const AlarmGroupSchema = SchemaFactory.createForClass(AlarmGroup);

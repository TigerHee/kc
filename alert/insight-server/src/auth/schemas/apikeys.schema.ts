import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type ApiKeysDocument = ApiKeys & Document;

@Schema({ collection: 'apikeys' })
export class ApiKeys {
  @Prop({ required: true, unique: true })
  remark: string;

  @Prop({ required: true })
  secret: string;

  @Prop({ default: 0 })
  duration: number;

  @Prop({ default: 1 })
  status: number;

  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  owner: User | Types.ObjectId;

  @Prop({ required: false, type: Date })
  lastUsedAt: Date;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ApiKeysSchema = SchemaFactory.createForClass(ApiKeys);

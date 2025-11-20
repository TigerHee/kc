import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

type PrRejectRecordDocument = PrRejectRecord & Document;

@Schema({ collection: 'pr-reject-record' })
class PrRejectRecord extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  user: User | Types.ObjectId;

  @Prop({ required: true, type: String, default: '' })
  reason: string;

  @Prop({ required: true, type: String, default: '' })
  link: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

const PrRejectRecordSchema = SchemaFactory.createForClass(PrRejectRecord);

export { PrRejectRecord, PrRejectRecordSchema, PrRejectRecordDocument };

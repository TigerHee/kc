import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OnetrustCookieScanDocument = OnetrustCookieScan & Document;

@Schema({ collection: 'onetrust-cookie-scans' })
export class OnetrustCookieScan {
  @Prop({ required: true })
  domain: string;

  @Prop({ required: true })
  data: Array<string>;

  @Prop({ required: true })
  executor: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const OnetrustCookieScanSchema = SchemaFactory.createForClass(OnetrustCookieScan);

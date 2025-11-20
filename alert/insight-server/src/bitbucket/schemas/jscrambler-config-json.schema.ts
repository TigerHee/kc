import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JscramblerConfigJsonDocument = JscramblerConfigJson & Document;

@Schema({ collection: 'jscrambler-config-json-scans' })
export class JscramblerConfigJson {
  @Prop({ required: true, type: String })
  repo: string;

  @Prop({ required: false, type: String, default: 'master' })
  branch: string;

  @Prop({ required: true, type: String })
  slug: string;

  @Prop({ required: true, type: Array, default: [] })
  config: string[];

  @Prop({ required: true, type: Date, default: Date.now })
  createdAt: Date;
}

const JscramblerConfigJsonSchema = SchemaFactory.createForClass(JscramblerConfigJson);

export { JscramblerConfigJsonSchema };

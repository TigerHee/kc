import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type JobsDocument = Jobs & Document;

@Schema({ collection: 'jobs' })
export class Jobs {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['normal', 'single'] })
  type: string;

  @Prop({ required: true, type: Types.Map })
  data: object;

  @Prop({ required: false, default: Date.now, type: Date })
  lastModifiedBy: string;

  @Prop({ required: false, type: Date })
  nextRunAt: Date;

  @Prop({ required: true })
  priority: number;

  @Prop({ required: false })
  repeatInterval: string;

  @Prop({ required: false })
  repeatTimezone: string;

  @Prop({ required: false })
  lockedAt: string;

  @Prop({ required: false })
  failCount: number;

  @Prop({ required: false })
  failedReason: string;

  @Prop({ required: false })
  failedAt: string;

  @Prop({ required: false })
  lastFinishedAt: string;

  @Prop({ required: false })
  lastRunAt: string;

  @Prop({ required: false })
  progress: number;

  @Prop({ required: false })
  disabled: boolean;

  @Prop({ required: false })
  completed: boolean;
}

const JobsSchema = SchemaFactory.createForClass(Jobs);

export { JobsSchema };

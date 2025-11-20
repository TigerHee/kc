import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { IJobLogStatus } from '../types';
import { Types } from 'mongoose';
import { Jobs } from './jobs.schema';

// const opts = { toJSON: { virtuals: true } };
@Schema({ collection: 'job-logs' })
export class JobLog {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Types.ObjectId, ref: Jobs.name })
  jobId: Types.ObjectId;

  @Prop({ required: true })
  status: IJobLogStatus;

  @Prop({ type: Object, default: {} })
  data: object;

  @Prop()
  error: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

const JobLogSchema = SchemaFactory.createForClass(JobLog);

JobLogSchema.virtual('job')
  .get(function () {
    return this.jobId;
  })
  .set(function (v) {
    this.jobId = v;
  });

export type JobLogDocument = JobLog & Document;

export { JobLogSchema };

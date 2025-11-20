import { SetMetadata } from '@nestjs/common';
import { AGENDA_SCHEDULE_JOB_METADATA } from '../constants/agenda.constants';

export const ScheduleJob = (when: Date | string, isEvery?: boolean, data?: Record<string, any>) =>
  SetMetadata(AGENDA_SCHEDULE_JOB_METADATA, { when, isEvery, data });

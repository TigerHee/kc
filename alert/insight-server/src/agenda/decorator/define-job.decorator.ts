import { SetMetadata } from '@nestjs/common';
import type { JobOptions } from '../types';
import { AGENDA_DEFINE_JOB_METADATA } from '../constants/agenda.constants';

export const DefineJob = (name: string, desc: string, options?: JobOptions) =>
  SetMetadata(AGENDA_DEFINE_JOB_METADATA, { name, desc, options });

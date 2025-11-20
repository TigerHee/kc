import { IsObject, IsString } from 'class-validator';

/**
 * 立即执行任务参数
 */
export class ImmediateJobDto {
  @IsString()
  readonly name: string;

  @IsObject()
  readonly payload: object;
}

/**
 * 调用周期任务参数
 */
export class IntervalJobDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly interval: string;

  @IsObject()
  readonly payload: object;
}

/**
 * 调用定时任务参数
 */
export class ScheduleJobDto {
  @IsString()
  readonly cron: string;

  @IsString()
  readonly name: string;

  @IsObject()
  readonly payload: object;
}

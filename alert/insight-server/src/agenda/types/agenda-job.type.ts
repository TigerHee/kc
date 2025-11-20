export type IJobLogStatus = JobExecutionType | JobActionType;

/**
 * 任务执行状态
 */
type JobExecutionType = 'start' | 'complete' | 'fail' | 'error';
/**
 * 任务操作类型
 */
type JobActionType = 'create' | 'disable' | 'enable' | 'remove' | 'cancel' | 'manual-complete';

/**
 * 调度类型
 */
export enum ScheduleTypeEnum {
  /**
   * 立即执行
   */
  IMMEDIATE = 'immediate',
  /**
   * 定时执行
   */
  SCHEDULE = 'schedule',
  /**
   * 间隔执行
   */
  INTERVAL = 'interval',
}

/**
 * 触发源
 */
export enum ScheduleTriggerEnum {
  API = 'api',
  SYSTEM = 'system',
}

/**
 * 任务执行数据
 */
export type JobExecutionData<D> = {
  payload?: D;
  triggerUser?: string;
  scheduleType: ScheduleTypeEnum;
  triggerSource?: ScheduleTriggerEnum;
};

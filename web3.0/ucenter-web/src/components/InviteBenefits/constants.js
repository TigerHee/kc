/**
 * Owner: vijay.zhou@kupotech.com
 * 拷贝自 platform-operation-web: src/components/$/KuRewards/config/task.js
 */
export const NEW_CUSTOMER_TASK_STATUS = {
  INIT: 'INIT', // 未完成,
  AUDIT: 'AUDIT', // 任务已做，但是处于审核中（比如KYC任务）
  PROCESSING: 'PROCESSING', // 进行中
  EXPIRE: 'EXPIRE', // 已过期
  COMPLETE: 'COMPLETE', // 已完成
};

export const NEW_CUSTOMER_PRIZE_STATUS = {
  WAIT_DRAW: 'WAIT_DRAW',
  DRAWED: 'DRAWED',
  EXPIRE: 'EXPIRE',
  PROCESSING: 'PROCESSING', // 领奖完成，但是库存不足
  RISK_AUDITING: 'RISK_AUDITING', //风控审核中
  RISK_AUDIT_REJECT: 'RISK_AUDIT_REJECT', //风控审核失败
};

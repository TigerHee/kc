export const ACTION_TYPE_SET_STEP = 'ACTION_TYPE_SET_STEP';

/**  申请交易专家 useReducer ApplyStep   */
export const APPLY_TRADER_STEPS = {
  /** 未申请  */
  UN_APPLY: 'UN_APPLY',
  /**  申请审核中  */
  PENDING_REVIEW: 'PENDING_REVIEW',
  /** 实盘考核中 */
  LIVE_ASSESSMENT: 'LIVE_ASSESSMENT',
  /**  申请未通过  */
  APPLICATION_DENIED: 'APPLICATION_DENIED',
  /** 申请通过  */
  APPLICATION_APPROVED: 'APPLICATION_APPROVED',
};

/**
 * Owner: john.zhang@kupotech.com
 */

/**
 * 一键处理表格模块的状态
 */
// -1-无需处理
export const SKIP_STATUS = -1;
// 0-禁止处理
export const FORBID_STATUS = 0;
// 1-可以处理
export const CAN_RESOLVE_STATUS = 1;
// 2-进行中
export const RESOLVING_STATUS = 2;
// 3-已完成
export const DONE_STATUS = 3;

// 用户迁移一键处理 默认状态列表
export const DEFAULT_ONE_CLICK_PROGRESS = [0, 0, 0, 0, 0, 0];

export const REPORT_SUCCESS = 'Success';
export const REPORT_FAIL = 'Failure';
export const PROCESS_CONTENT_TYPE = {
  resolveBizData: 1,
  assetsTax: 2,
  checking: 3,
};

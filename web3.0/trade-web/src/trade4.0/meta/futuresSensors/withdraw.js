/**
 * Owner: garuda@kupotech.com
 * 提取保证金埋点
 */

export const ADJ_LEVERAGE = 'AdjLeverage'; // 调整杠杆弹框-曝光
export const ADJ_MARGIN = 'AdjMargin'; // 调整保证金-曝光

/**
 * locationId
 * 1 - 输入数字 -- 点击输入框
 * 2 - 向上微调
 * 3 - 向下微调
 * 4 - 滑杆拖动
 * 5 - 杠杆限制介绍点击
 * 6 - 确认按钮点击
 * 7 - 提交后的结果
 * 8 - 输入超过杠杆边界后提醒
 * 9 - 无法调整  -- 初始化上报一次
 */
export const ADJUST_LEVERAGE = 'AdjustLeverage'; // 调整杠杆

/**
 * locationId
 * 1 - tab点击
 * 2 - 数值输入
 * 3 - 确认按钮点击
 * 4 - 最大值问号点击
 * 5 - 了解更多
 * 6 - 提交后的结果
 * 7 - 输入超过最大边界反馈
 */
export const ADJUST_MARGIN = 'AdjustMargin'; // 调整保证金

// add margin
export const SK_ADD_KEY = 'AddMargin';
// reducer margin
export const SK_REDUCER_KEY = 'ReduceMargin';

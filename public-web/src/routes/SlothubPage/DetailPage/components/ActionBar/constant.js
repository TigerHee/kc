import { _t } from 'src/tools/i18n';

/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-05-30 21:16:34
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-19 17:55:12
 */
const ACTIVITY_ACTION_TIP_MAP = {
  beforeStartApplyTime: () => _t('22d73ff6b6784000a8fa'),
  beforeStart: () => _t('920b7c27020a4000a725'), // '距活动开始',
  beforeEnd: () => _t('593d71b2d6494000afa3'), //'距活动结束',
  activityIsEnd: () => _t('ed59eb6fc4014000a224'), //'活动已结束',
  activityIsEndAndUnJoin: () => _t('57de5362a61d4000ac09'), //'很遗憾，您未参与本次活动，无法获得瓜分奖励。',
};

const ACTIVITY_ACTION_BUTTON_TEXT_MAP = {
  apply: () => _t('371e1a74535c4000ad95'), //'立即报名',
  reserve: () => _t('ce816d5874634000a576'), // '立即预约',
  ended: () => _t('ed59eb6fc4014000a224'), //'活动已结束',
  isReserved: () => _t('a989f67835fa4000aa75'), //'已预约',
  loginAndReserve: () => _t('e5fbd8e57c5d4000a3fa'), // '登录并预约',
  loginAndApplication: () => _t('e143e205451b4000afd1'), // '登录并报名',
  loginAndFetchScore: () => _t('7cf83f6bc4624000a9ce'), // '登录查看战绩',
};

export const ShowCountDownTimeType = {
  toStartTime: 'toStartTime',
  toEndTime: 'toEndTime',
  hidden: 'hidden',
};

export const ActionButtonStyleType = {
  default: 'default',
  disabled: 'disabled',
  fullGrayDisabled: 'fullGrayDisabled',
};

export const BUSINESS_TYPE = {
  canApply: 'canApply',
  canReserve: 'canReserve',
  isReserved: 'isReserved',
  isEndAndNotJoin: 'isEndAndNotJoin',
  loginAndApplication: 'loginAndApplication',
  loginAndReserve: 'loginAndReserve',
  loginAndViewResult: 'loginAndViewResult',
};

export const ACTIVITY_ACTION_BUTTON_CONFIG_BY_BUSINESS_MAP = {
  /** 已登陆 活动开始-立即报名 */
  [BUSINESS_TYPE.canApply]: {
    tip: ACTIVITY_ACTION_TIP_MAP.beforeEnd,
    btnText: ACTIVITY_ACTION_BUTTON_TEXT_MAP.apply,
    timeType: ShowCountDownTimeType.toEndTime,
    styleType: ActionButtonStyleType.default,
  },
  /** 已登陆 活动未开始-立即预约 */
  [BUSINESS_TYPE.canReserve]: {
    tip: ACTIVITY_ACTION_TIP_MAP.beforeStartApplyTime,
    btnText: ACTIVITY_ACTION_BUTTON_TEXT_MAP.reserve,
    timeType: ShowCountDownTimeType.toStartTime,
    styleType: ActionButtonStyleType.default,
  },
  /** 已登陆 活动未开始-已预约 */
  [BUSINESS_TYPE.isReserved]: {
    tip: ACTIVITY_ACTION_TIP_MAP.beforeStart,
    btnText: ACTIVITY_ACTION_BUTTON_TEXT_MAP.isReserved,
    timeType: ShowCountDownTimeType.toStartTime,
    styleType: ActionButtonStyleType.disabled,
  },

  /** 已登陆 活动已结束-未参与 */
  [BUSINESS_TYPE.isEndAndNotJoin]: {
    tip: ACTIVITY_ACTION_TIP_MAP.activityIsEndAndUnJoin,
    btnText: ACTIVITY_ACTION_BUTTON_TEXT_MAP.ended,
    timeType: ShowCountDownTimeType.hidden,
    styleType: ActionButtonStyleType.fullGrayDisabled,
  },

  /** 未登陆 活动开始-登陆报名 */
  [BUSINESS_TYPE.loginAndApplication]: {
    tip: ACTIVITY_ACTION_TIP_MAP.beforeEnd,
    btnText: ACTIVITY_ACTION_BUTTON_TEXT_MAP.loginAndApplication,
    timeType: ShowCountDownTimeType.toEndTime,
    styleType: ActionButtonStyleType.default,
  },

  /** 未登陆 活动未开始-登陆预约 */
  [BUSINESS_TYPE.loginAndReserve]: {
    tip: ACTIVITY_ACTION_TIP_MAP.beforeStartApplyTime,
    btnText: ACTIVITY_ACTION_BUTTON_TEXT_MAP.loginAndReserve,
    timeType: ShowCountDownTimeType.toStartTime,
    styleType: ActionButtonStyleType.default,
  },

  /** 未登陆 活动已经结束 -查看结果 */
  [BUSINESS_TYPE.loginAndViewResult]: {
    tip: ACTIVITY_ACTION_TIP_MAP.activityIsEnd,
    tipCenterLayout: true,
    btnText: ACTIVITY_ACTION_BUTTON_TEXT_MAP.loginAndFetchScore,
    timeType: ShowCountDownTimeType.hidden,
    styleType: ActionButtonStyleType.default,
  },
};

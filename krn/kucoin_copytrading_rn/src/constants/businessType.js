export const TRADER_ACTIVE_STATUS = {
  Disabled: 0, //停用，0
  Available: 1, //可用，1
  Freeze: 2, //冻结，2
};

export const CLOSE_POSITION_STATUS_TEXT_KEY = {
  0: '72e120e1f6e94000a5bb',
  1: 'c61faa75f2a04000acf0',
};

// 跟单的订单相关状态
export const CANCEL_COPY_STATUS = {
  CLOSED_WAIT_CONFIRM: 4, // "已关闭，待用户最后确认"
  SETTLING: 3, // '结算中'
  CLOSING: 2, // '关闭中'),
  NORMAL: 1, // '正常'),
  CLOSED: 0, // '已关闭'),
  FAILED: -1, // '解除跟单失败');
};

// 带单的订单相关状态
export const LEAD_CONFIG_STATUS = {
  SETTLING: 3, // "结算中"
  CLOSING: 2, // "关闭中")
  NORMAL: 1, //"正常"
  CLOSED: 0, // "已关闭"
};

/** 校验 带单员订单状态是否为撤销中, 是否正常 */
export const validateLeaderConfigHelper = {
  isUndoing: leadStatus =>
    [LEAD_CONFIG_STATUS.CLOSING, LEAD_CONFIG_STATUS.SETTLING].includes(
      leadStatus,
    ),
  isUnNormal: leadStatus =>
    [
      LEAD_CONFIG_STATUS.CLOSING,
      LEAD_CONFIG_STATUS.CLOSED,
      LEAD_CONFIG_STATUS.SETTLING,
    ].includes(leadStatus),
};

export const BUS_RESP_CODE_MAP = {
  //合规失败
  restrictFail: 400303,

  //合规地区受限
  restrictAreaLimit: 400010,

  //kyc 未通过
  kycUnPass: 370004,

  //昵称重复错误码
  EditNickNameReplyError: 290003,

  // 跟单/带单操作 协议未签署校验未通过
  AgreeSignUnPass: 180101,
};

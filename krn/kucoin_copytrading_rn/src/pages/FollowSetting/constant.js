export const FOLLOW_MODE_ENUM = {
  fixedRate: 'fixedRate',
  fixedAmount: 'fixedAmount',
};

export const makeModeTabList = _t => [
  {
    label: _t('ac10631ee6b74000a1de'),
    itemKey: FOLLOW_MODE_ENUM.fixedRate,
  },
  {
    label: _t('ac78f8ba5e5d4000acdb'),
    itemKey: FOLLOW_MODE_ENUM.fixedAmount,
  },
];

export const SETTING_SCENE = {
  create: 'create',
  readonly: 'readonly',
  edit: 'edit',
};

export const LeveragePatternType = {
  FOLLOW: 'FOLLOW',
  FIX: 'FIX',
};

export const CopyModePayloadType = {
  fixedRate: 1,
  fixedAmount: 2,
};

export const RespCopyModeType2FollowModeEnum = {
  [CopyModePayloadType.fixedRate]: FOLLOW_MODE_ENUM.fixedRate,
  [CopyModePayloadType.fixedAmount]: FOLLOW_MODE_ENUM.fixedAmount,
};

export const CopyModePayloadDescTranKeyMap = {
  [CopyModePayloadType.fixedRate]: 'ac10631ee6b74000a1de',
  [CopyModePayloadType.fixedAmount]: 'ac78f8ba5e5d4000acdb',
};

export const CANCEL_DIALOG_STATUS = {
  pending: 'pending',
  warn: 'warn',
};
export const TransferCopyMaxAmountDirections = {
  IN: 'IN',
  OUT: 'OUT',
};

/** 接口定义止盈止损类型  */
export const StopTakeTypeEnum = {
  OVERALL: 'OVERALL', // 整仓，仓位
  ACCOUNT: 'ACCOUNT', // 跟单账户
};

/** 默认杠杠倍数 */
export const DEFAULT_LEVERAGE_VALUE = 2;

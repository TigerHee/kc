import {BUS_RESP_CODE_MAP} from 'constants/businessType';

export const RestrictType = {
  copyTradeRestrictFail: 'copyTradeRestrictFail',
  restrictAreaLimit: 'restrictAreaLimit',
};

export const RestrictByBusCodeType = {
  [BUS_RESP_CODE_MAP.restrictFail]: RestrictType.copyTradeRestrictFail,
  [BUS_RESP_CODE_MAP.restrictAreaLimit]: RestrictType.restrictAreaLimit,
};

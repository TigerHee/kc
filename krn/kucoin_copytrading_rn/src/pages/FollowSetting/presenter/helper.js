import {isNil} from 'lodash';

import {CANCEL_COPY_STATUS} from 'constants/businessType';
import {isValidNumber, numberFixed} from 'utils/helper';
import {dividedBy, equals, greaterThan, minus, multiply} from 'utils/operation';
import {
  CopyModePayloadType,
  FOLLOW_MODE_ENUM,
  LeveragePatternType,
  StopTakeTypeEnum,
  TransferCopyMaxAmountDirections,
} from '../constant';

export const convertFormValue2Payload = ({formValue, leadBizNo, tabValue}) => {
  const isFixedAmount = tabValue === FOLLOW_MODE_ENUM.fixedAmount;
  const {
    leverage,
    leveragePattern,
    perAmount,
    maxAmount,
    stopProfitPercent,
    copyLeadAddMargin,
    stopLossPercent,
  } = formValue;
  return {
    leadBizNo,
    maxAmount,
    leveragePattern,
    stopProfitPercent,
    symbols: undefined, // （如果是全跟，就不传）一期全跟 无配置项

    perAmount: isFixedAmount ? perAmount : '',
    copyMode: CopyModePayloadType[tabValue],
    stopLossPercent: dividedBy(stopLossPercent)(100),
    leverage:
      leveragePattern === LeveragePatternType.FIX ? leverage : undefined,
    copyLeadAddMargin,

    stopTakeDetailVOList: convertFormValue2stopTakeDetailVOList(formValue),
  };
};

export const convertInfoData2FormValue = info => {
  const {maxAmount, perAmount, stopTakeDetailVOList, ...others} = info || {};
  const accountTPSLInfo =
    stopTakeDetailVOList?.find(i => i.type === StopTakeTypeEnum.ACCOUNT) || {};

  const positionTPSLInfo =
    stopTakeDetailVOList?.find(i => i.type === StopTakeTypeEnum.OVERALL) || {};

  return {
    ...others,
    maxAmount: numberFixed(maxAmount, 2),
    perAmount: numberFixed(perAmount, 2),
    stopTakeDetailVOList,
    PositionStopTake: {
      takeProfitRatio: isValidNumber(positionTPSLInfo?.takeProfitRatio)
        ? multiply(positionTPSLInfo?.takeProfitRatio)(100).toString()
        : null,
      stopLossRatio: isValidNumber(positionTPSLInfo?.stopLossRatio)
        ? multiply(positionTPSLInfo?.stopLossRatio)(100).toString()
        : null,
    },
    AccountStopTake: {
      takeProfitRatio: isValidNumber(accountTPSLInfo?.takeProfitRatio)
        ? multiply(accountTPSLInfo?.takeProfitRatio)(100).toString()
        : null,
      stopLossRatio: isValidNumber(accountTPSLInfo?.stopLossRatio)
        ? multiply(accountTPSLInfo?.stopLossRatio)(100).toString()
        : null,
    },
  };
};

export const genNumberRangePlaceholder = (left, right) =>
  [left, right].some(i => isNil(i)) ? '' : `${left}~${right}`;

export const convertTraderInfo2UserInfo = (traderInfo = {}) => ({
  nickName: traderInfo?.nickName,
  avatarUrl: traderInfo?.avatar,
});
export const getUpdateMaxAmountOperatorAndAdjustAmount = ({
  updateMaxAmount,
  originMaxAmount,
}) => {
  const isEqual = equals(updateMaxAmount)(originMaxAmount);
  const isIncrease = greaterThan(updateMaxAmount)(originMaxAmount);

  if (isEqual) {
    return {
      direction: '',
      targetAdjustAmount: 0,
    };
  }

  if (isIncrease) {
    return {
      direction: TransferCopyMaxAmountDirections.OUT,
      targetAdjustAmount: minus(updateMaxAmount)(originMaxAmount).toFixed(),
    };
  }
  return {
    direction: TransferCopyMaxAmountDirections.IN,
    targetAdjustAmount: minus(originMaxAmount)(updateMaxAmount).toFixed(),
  };
};
export const getIsCancelOrCloseByStatus = status =>
  +status !== CANCEL_COPY_STATUS.NORMAL;

const convertRatio = val => dividedBy(val)(100);
export const convertFormValue2stopTakeDetailVOList = formValues => {
  const stopTakeDetailVOList = [];

  // 处理 Account 类型的止盈止损（跟单）
  if (formValues.AccountStopTake) {
    const {takeProfitRatio, stopLossRatio} = formValues.AccountStopTake;
    stopTakeDetailVOList.push({
      type: StopTakeTypeEnum.ACCOUNT, // 对应枚举的跟单类型
      takeProfitRatio: takeProfitRatio ? convertRatio(takeProfitRatio) : null,
      stopLossRatio: stopLossRatio ? convertRatio(stopLossRatio) : null,
    });
  }

  // 处理 Overall 类型的止盈止损（整仓）
  if (formValues.PositionStopTake) {
    const {takeProfitRatio, stopLossRatio} = formValues.PositionStopTake;

    stopTakeDetailVOList.push({
      type: StopTakeTypeEnum.OVERALL, // 对应枚举的整仓类型
      takeProfitRatio: takeProfitRatio ? convertRatio(takeProfitRatio) : null,
      stopLossRatio: stopLossRatio ? convertRatio(stopLossRatio) : null,
    });
  }

  return stopTakeDetailVOList;
};

export const validateFormValueTPSLExistError = formValues => {
  const {AccountStopTake, PositionStopTake} = formValues || {};
  // 处理 Account 类型的止盈止损（跟单）,处理 Overall 类型的止盈止损（整仓）

  return AccountStopTake?.existError || PositionStopTake?.existError;
};

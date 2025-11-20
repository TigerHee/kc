import {useLockFn, useMemoizedFn} from 'ahooks';
import {StopTakeTypeEnum} from 'pages/FollowSetting/constant';
import React from 'react';
import {Pressable} from 'react-native';
import {getBaseCurrency} from 'site/tenant';
import {css} from '@emotion/native';
import {useTheme} from '@krn/ui';

import NumberFormat from 'components/Common/NumberFormat';
import {TPSLCloseIc} from 'components/Common/SvgIcon';
import TipTrigger from 'components/Common/TipTrigger';
import {Percent} from 'components/Common/UpOrDownNumber';
import {mediumHitSlop} from 'constants/index';
import {RowWrap} from 'constants/styles';
import {useGetFuturesInfoBySymbol} from 'hooks/useGetFuturesInfoBySymbol';
import useLang from 'hooks/useLang';
import {getDigit, isUndef, isValidNumber} from 'utils/helper';
import {multiply} from 'utils/operation';
import {useGetPositionSize} from '../PositionInfoComponents/hooks/useGetPositionSize';
import {useCancelStopTakeOrderMutation} from './hooks/useCancelStopTakeOrderMutation';
import {useUpdateCopyConfigMutation} from './hooks/useUpdateCopyConfigMutation';
import {ControlDirection} from './constant';
import {getIsTpDirection} from './helper';
import {
  ConfigValueText,
  ControlItemWrap,
  makeLabelTextStyle,
  PositionDirectionPrice,
  PositionLabelText,
} from './styles';

const CloseIc = ({onPress}) => (
  <Pressable
    onPress={onPress}
    hitSlop={mediumHitSlop}
    style={css`
      margin-left: 8px;
    `}>
    <TPSLCloseIc />
  </Pressable>
);
export const CopyTraderControlItem = ({
  direction = ControlDirection.TP,
  traderInfo,
}) => {
  const theme = useTheme();
  const {_t} = useLang();
  const isTP = direction === ControlDirection.TP;
  const {takeProfitRatio, stopLossRatio, copyAmount, copyConfigId} =
    traderInfo || {};
  const targetRatio = isTP ? takeProfitRatio : stopLossRatio;
  const {colorV2} = useTheme();
  const targetAmount = `${multiply(targetRatio)(copyAmount)}`;
  const {mutateAsync} = useUpdateCopyConfigMutation();
  const {numberFormat} = useLang();
  const cancelAccountConfig = useLockFn(async () => {
    await mutateAsync({
      copyConfigId,
      stopTakeDetailVOList: [
        {
          type: StopTakeTypeEnum.ACCOUNT, // 对应枚举的跟单类型
          takeProfitRatio: !isTP ? takeProfitRatio : null,
          stopLossRatio: isTP ? stopLossRatio : null,
        },
      ],
    });
  });

  if (isUndef(targetRatio)) {
    return null;
  }

  return (
    <ControlItemWrap>
      <TipTrigger
        showUnderLine
        showIcon={false}
        textStyle={makeLabelTextStyle(theme)}
        text={_t(isTP ? '1c29f6cc47584000ac2b' : 'a6df84f38eeb4000a367', {
          unit: getBaseCurrency(),
        })}
        message={_t(isTP ? 'b7d999e4f71a4000ae81' : '780393e12d7c4000a216', {
          num_1: numberFormat(targetRatio, {
            options: {
              style: 'percent',
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            },
          }),
        })}
      />

      <RowWrap>
        <ConfigValueText>
          <Percent
            hiddenPositiveChar
            style={css`
              font-weight: 500;
              color: ${isTP ? colorV2.chartUpColor : colorV2.chartDownColor};
            `}>
            {targetRatio}
          </Percent>
          <ConfigValueText>{' / '}</ConfigValueText>
          <NumberFormat isAumNumber style={{fontWeight: '500'}}>
            {targetAmount}
          </NumberFormat>
        </ConfigValueText>

        <CloseIc onPress={cancelAccountConfig} />
      </RowWrap>
    </ControlItemWrap>
  );
};

export const CopyPositionControlItem = ({
  config,
  subUid,
  positionInfo,
  // isLeadPosition true 表示 我的带单仓位，false 则为我的跟单仓位
  isLeadPosition,
}) => {
  const {_t} = useLang();
  const {symbol, positionSide} = positionInfo || {};
  const {price, shortcut, size, orderId, stop} = config || {};

  // 止盈止损方向
  const isTpDirection = getIsTpDirection({positionSide, configStop: stop});

  const {mutateAsync} = useCancelStopTakeOrderMutation({isLeadPosition});
  const {tickSize} = useGetFuturesInfoBySymbol(symbol);
  const symbolPrecision = getDigit(tickSize);
  const {baseCurrency, size: baseAmount} = useGetPositionSize({
    symbol,
    value: size,
  });

  const cancelOrder = useMemoizedFn(async () => {
    await mutateAsync({
      orderId,
      subUid,
    });
  });

  const lockCancelOrder = useLockFn(cancelOrder);

  if (!config || !Object.keys(config || {}).length) {
    return null;
  }
  return (
    <ControlItemWrap>
      <PositionLabelText>
        {_t(isTpDirection ? '97e52470aeca4000a436' : '60f8586a8e024000adda')}
        <PositionLabelText>/</PositionLabelText>
        {/* //此处不显示+符号 因此用isAumNumber */}
        <PositionDirectionPrice
          isTP={isTpDirection}
          isAumNumber
          hiddenPositiveChar
          options={{
            minimumFractionDigits: symbolPrecision,
            maximumFractionDigits: symbolPrecision,
          }}>
          {price}
        </PositionDirectionPrice>
      </PositionLabelText>

      <RowWrap>
        {shortcut ? (
          <ConfigValueText>{_t('7f3e71875c2d4000a534')}</ConfigValueText>
        ) : (
          <ConfigValueText>
            {`${size} ${_t('global.unit')} `}
            {isValidNumber(baseAmount) && (
              <>
                <ConfigValueText>/</ConfigValueText>
                <NumberFormat
                  afterText={` ${baseCurrency}`}
                  style={{fontWeight: '500'}}>
                  {baseAmount}
                </NumberFormat>
              </>
            )}
          </ConfigValueText>
        )}
        <CloseIc onPress={lockCancelOrder} />
      </RowWrap>
    </ControlItemWrap>
  );
};

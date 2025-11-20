import React from 'react';
import {View} from 'react-native';

import {ControlDirection, TPSLControlType} from './constant';
import {CopyTraderControlItem} from './ControlItem';
import {PositionContent} from './PositionContent';
import {DividerLine} from './styles';

export const TPSLControlBar = props => {
  //isLeadPosition true 表示带单仓位，false 表示 我的跟单仓位
  const {
    controlType,
    stopTakeOrderInfos,
    positionInfo,
    subUid,
    traderInfo,
    isLeadPosition,
  } = props;
  const [isTrader, isPosition] = [
    controlType === TPSLControlType.CopyTrader,
    controlType === TPSLControlType.CopyPosition,
  ];

  // 默认折叠
  if (!controlType) {
    return null;
  }

  return (
    <View>
      <DividerLine />
      {isTrader && (
        <>
          <CopyTraderControlItem
            direction={ControlDirection.TP}
            traderInfo={traderInfo}
          />
          <CopyTraderControlItem
            direction={ControlDirection.SL}
            traderInfo={traderInfo}
          />
        </>
      )}

      {isPosition && (
        <PositionContent
          stopTakeOrderInfos={stopTakeOrderInfos}
          positionInfo={positionInfo}
          subUid={subUid}
          isLeadPosition={isLeadPosition}
        />
      )}
    </View>
  );
};

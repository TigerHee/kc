import {noop} from 'lodash';
import React, {memo, useMemo} from 'react';
import {TouchableWithoutFeedback, View} from 'react-native';
import {useSelector} from 'react-redux';
import {css} from '@emotion/native';
import {Button} from '@krn/ui';

import {TPSLControlBar} from 'components/copyTradeComponents/TPSLControlBar';
import {TPSLControlType} from 'components/copyTradeComponents/TPSLControlBar/constant';
import useLang from 'hooks/useLang';
import useTracker from 'hooks/useTracker';
import {usePositionHandler} from '../hooks/usePositionHandler';
import {ActionFooterWrap} from './styles';

const StyledButton = props => {
  return (
    <Button
      style={css`
        flex: 1;
        margin: ${props.isLeft ? '0 6px 0 0' : '0 0 0 6px'};
      `}
      styles={{
        buttonBox: css`
          border-radius: 24px;
        `,
        buttonText: css`
          font-size: 12px;
          font-weight: 500;
        `,
      }}
      {...props}
    />
  );
};
const CurrentPositionActionFooter = ({
  isLeadPosition = false,
  needTpSlBtn = false,
  onPressCallback,
  positionInfo,
}) => {
  const {_t} = useLang();
  const {onClickTrack} = useTracker();
  const {
    subUid: copyTradeSubUid,
    extendPositionResponse,
    stopTakeOrderInfos,
    symbol,
  } = positionInfo || {};
  const {uid: myLeadSubUID} =
    useSelector(state => state.leadInfo.activeLeadSubAccountInfo) || {};

  const positionBelongToSubUid = useMemo(
    () => (isLeadPosition ? myLeadSubUID : copyTradeSubUid),
    [copyTradeSubUid, isLeadPosition, myLeadSubUID],
  );

  const {openClosePosition, openTpSl} = usePositionHandler({
    isLeadPosition,
    extendPositionResponse,
    positionBelongToSubUid,
    onPressCallback,
  });

  const onClosePosition = () => {
    onClickTrack({
      blockId: 'myPosition',
      locationId: 'positionMarketClose',
    });
    openClosePosition();
  };

  if (!extendPositionResponse) return null;

  return (
    <View>
      <TPSLControlBar
        isLeadPosition={isLeadPosition}
        positionInfo={positionInfo}
        controlType={TPSLControlType.CopyPosition}
        stopTakeOrderInfos={stopTakeOrderInfos}
        subUid={positionBelongToSubUid}
      />
      <TouchableWithoutFeedback onPress={noop}>
        <ActionFooterWrap>
          {needTpSlBtn && (
            <StyledButton
              onPress={openTpSl}
              isLeft
              size="small"
              type="secondary">
              {_t('7de0821fd3d84000a3b3')}
            </StyledButton>
          )}
          <StyledButton onPress={onClosePosition} size="small" type="secondary">
            {_t('1a67e222af5d4000a7f1')}
          </StyledButton>
        </ActionFooterWrap>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default memo(CurrentPositionActionFooter);

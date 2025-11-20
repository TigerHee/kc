import React, {memo} from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {css} from '@emotion/native';

import closeCircleIc from 'assets/common/close-with-circle.png';
import closeCircleDarkIc from 'assets/common/close-with-circle-dark.png';
import clockIc from 'assets/common/ic-clock.png';
import Button from 'components/Common/Button';
import {CANCEL_COPY_STATUS} from 'constants/businessType';
import {mediumHitSlop} from 'constants/index';
import {RowWrap} from 'constants/styles';
import {useIsLight} from 'hooks/useIsLight';
import useLang from 'hooks/useLang';
import {useCloseWaitConfirmMutation} from '../hooks/useCloseWaitConfirmMutation';
import {CancelText, TraderCardWaitIc} from './styles';

const CancelTip = () => {
  const {_t} = useLang();

  return (
    <RowWrap>
      <TraderCardWaitIc source={clockIc} />
      <CancelText>{_t('0e65f3f53ba84000af43')}</CancelText>
    </RowWrap>
  );
};

const CloseWaitConfirm = ({copyConfigId}) => {
  const {mutate} = useCloseWaitConfirmMutation({copyConfigId});
  const isLight = useIsLight();

  return (
    <TouchableOpacity
      hitSlop={mediumHitSlop}
      activeOpacity={0.9}
      onPress={mutate}>
      <Image
        style={css`
          width: 24px;
          height: 24px;
        `}
        source={isLight ? closeCircleIc : closeCircleDarkIc}
      />
    </TouchableOpacity>
  );
};

export const UserInfoBarRightArea = memo(
  ({copyStatus, traderInfo, gotoViewFollowSetting}) => {
    const {_t} = useLang();
    const {copyConfigId} = traderInfo;
    const isCancelling = [
      CANCEL_COPY_STATUS.CLOSING,
      CANCEL_COPY_STATUS.SETTLING,
    ].includes(copyStatus);

    const isClosedWaitConfirm =
      CANCEL_COPY_STATUS.CLOSED_WAIT_CONFIRM === copyStatus;
    const isCancelFail = copyStatus === CANCEL_COPY_STATUS.FAILED;

    if (isClosedWaitConfirm) {
      return <CloseWaitConfirm copyConfigId={copyConfigId} />;
    }

    if (isCancelFail) {
      return null;
    }

    return (
      <RowWrap>
        {isCancelling ? (
          <CancelTip />
        ) : (
          <Button size="mini" type="secondary" onPress={gotoViewFollowSetting}>
            {_t('0ff2cfa5547f4000a2c1')}
          </Button>
        )}
      </RowWrap>
    );
  },
);

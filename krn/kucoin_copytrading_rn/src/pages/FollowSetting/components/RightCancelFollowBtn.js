import {useMemoizedFn} from 'ahooks';
import React, {memo, useRef} from 'react';
import {TouchableOpacity} from 'react-native';
import styled from '@emotion/native';

import {CANCEL_COPY_STATUS} from 'constants/businessType';
import useLang from 'hooks/useLang';
import useTracker from 'hooks/useTracker';
import {getEnhanceColorByType} from 'utils/color-helper';
import CancelCopyDialog from '../CancelCopyDialog';
import {CANCEL_DIALOG_STATUS} from '../constant';
import {useGetFormSceneStatus} from '../hooks/useGetFormSceneStatus';
import {useRewriteFormDetail} from '../hooks/useRewriteFormDetail';

const CancelFollowBtn = styled.Text`
  color: ${({theme}) => getEnhanceColorByType(theme.type, 'brandRed')};
  font-size: 14px;
  font-weight: 400;
  line-height: 18.2px;
  max-width: 90px;
`;

const RightCancelFollowBtn = () => {
  const cancelCopyDialogRef = useRef(null);
  const {data: configInfoResp} = useRewriteFormDetail();
  const {isReadonly} = useGetFormSceneStatus();

  const {status} = configInfoResp || {};
  const {_t} = useLang();
  const isCloseConfig = status === CANCEL_COPY_STATUS.CLOSED;
  const {onClickTrack} = useTracker();

  const isCanceling = [
    CANCEL_COPY_STATUS.CLOSING,
    CANCEL_COPY_STATUS.SETTLING,
  ].includes(status);
  const handlePressCancelBtn = useMemoizedFn(() => {
    if (isCloseConfig) {
      return;
    }
    // 跟单进行中 与 解除失败 展示 解除跟单提示 ，其他展示解除中
    const dialogStatus = [
      CANCEL_COPY_STATUS.NORMAL,
      CANCEL_COPY_STATUS.FAILED,
    ].includes(status)
      ? CANCEL_DIALOG_STATUS.warn
      : CANCEL_DIALOG_STATUS.pending;

    onClickTrack({
      blockId: 'stop',
      locationId: 'stopCopy',
    });

    cancelCopyDialogRef.current.openByDialogStatus(dialogStatus);
  });

  if (!isReadonly || isCanceling) {
    return null;
  }

  return (
    <>
      <TouchableOpacity activeOpacity={0.9} onPress={handlePressCancelBtn}>
        <CancelFollowBtn numberOfLines={2}>
          {isCloseConfig
            ? _t('07fc7150fbbc4000a3cb')
            : _t('8139ed20063e4000ab81')}
        </CancelFollowBtn>
      </TouchableOpacity>
      <CancelCopyDialog ref={cancelCopyDialogRef} />
    </>
  );
};
export default memo(RightCancelFollowBtn);

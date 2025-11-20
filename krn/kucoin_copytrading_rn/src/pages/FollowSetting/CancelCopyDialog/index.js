import {useMemoizedFn, useToggle} from 'ahooks';
import React, {
  forwardRef,
  memo,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import styled from '@emotion/native';

import {ConfirmPopup} from 'components/Common/Confirm';
import {CommonStatusImageMap} from 'constants/image';
import {useIsLight} from 'hooks/useIsLight';
import useLang from 'hooks/useLang';
import {CANCEL_DIALOG_STATUS} from '../constant';
import {useCancelCopyConfig} from '../hooks/useCancelCopyConfig';

const PopContent = styled.View`
  padding: 0px 16px;
`;

export const SuccessIcon = styled.Image`
  width: 148px;
  height: 148px;
  margin-left: auto;
  margin-right: auto;
`;

export const SuccessText = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  line-height: 26px;
  margin-bottom: 4px;
`;

export const SuccessDesc = styled.Text`
  color: ${({theme}) => theme.colorV2.text40};
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  text-align: center;
  position: relative;
  margin-bottom: 8px;
`;

const makeDialogConfigByStatusMap = ({_t, isLight}) => ({
  [CANCEL_DIALOG_STATUS.pending]: {
    title: _t('0e65f3f53ba84000af43'),
    desc: _t('f15a3cc8f6c84000a160'),
    icon: isLight
      ? CommonStatusImageMap.PendingIcon
      : CommonStatusImageMap.PendingDarkIcon,
  },

  [CANCEL_DIALOG_STATUS.warn]: {
    title: _t('8139ed20063e4000ab81'),
    desc: _t('90683167317a4000af0e'),
    icon: isLight
      ? CommonStatusImageMap.WarnIcon
      : CommonStatusImageMap.WarnDarkIcon,
  },
});

const CancelCopyDialog = forwardRef((_props, ref) => {
  const [visible, {toggle}] = useToggle(false);
  const [status, setStatus] = useState();
  const {_t} = useLang();
  const isWarnToCloseScene = status === CANCEL_DIALOG_STATUS.warn;
  const isLight = useIsLight();

  const openByDialogStatus = useMemoizedFn(status => {
    if (!Object.values(CANCEL_DIALOG_STATUS).includes(status)) {
      return;
    }
    setStatus(status);
    toggle();
  });
  const {cancelCopyConfig, isCancelLoading} = useCancelCopyConfig({
    openByDialogStatus,
    toggle,
  });

  useImperativeHandle(
    ref,
    () => ({
      openByDialogStatus,
    }),
    [openByDialogStatus],
  );
  const {title, desc, icon} = useMemo(
    () => makeDialogConfigByStatusMap({_t, isLight})?.[status] || {},
    [_t, status, isLight],
  );

  const handleOkBtn = useMemoizedFn(() => {
    if (isWarnToCloseScene) {
      return cancelCopyConfig();
    }
    toggle();
  });
  return (
    <ConfirmPopup
      loading={isCancelLoading}
      id="tag"
      show={visible}
      onClose={toggle}
      onCancel={toggle}
      onOk={handleOkBtn}
      okText={
        isWarnToCloseScene
          ? _t('8139ed20063e4000ab81')
          : _t('bhfjS7Y6HXsKuQzsXGDpgQ')
      }
      cancelText={_t('67cf010eb33b4000a0d1')}>
      <PopContent>
        <SuccessIcon source={icon} />
        <SuccessText>{title}</SuccessText>
        <SuccessDesc>{desc} </SuccessDesc>
      </PopContent>
    </ConfirmPopup>
  );
});

export default memo(CancelCopyDialog);

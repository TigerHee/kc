import {useLockFn, useMemoizedFn, useToggle} from 'ahooks';
import {StopTakeTypeEnum} from 'pages/FollowSetting/constant';
import React, {
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import styled from '@emotion/native';

import {ConfirmPopup} from 'components/Common/Confirm';
import {CommonStatusImageMap} from 'constants/image';
import {useMutation} from 'hooks/react-query';
import {useIsLight} from 'hooks/useIsLight';
import useLang from 'hooks/useLang';
import {updateCopyConfig} from 'services/copy-trade';
import {STRATEGY_ENUM} from '../helper';

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

const ConflictTipByStrategyMap = {
  [STRATEGY_ENUM.CLEAR_ALL]: {
    title: '244304c92f864000aee8',
    desc: 'cd8ce36ce6354000a3a6',
  },
  [STRATEGY_ENUM.CLEAR_TAKE_PROFIT]: {
    title: '86da9e8814f64000a310',
    desc: 'fed83b4d53634000aadd',
  },
  [STRATEGY_ENUM.CLEAR_STOP_LOSS]: {
    title: 'dee0db96ddd64000aafb',
    desc: '3c4ec9761cb04000a9c9',
  },
};

const EditCopyAmountPnSlConflictPopup = forwardRef(({configInfo}, ref) => {
  const [visible, {toggle}] = useToggle(false);
  const {_t} = useLang();
  const isLight = useIsLight();
  const {copyConfigId, stopTakeDetailVOList} = configInfo || {};
  const accountTpSlInfo = stopTakeDetailVOList?.find(
    i => i.type === StopTakeTypeEnum.ACCOUNT,
  );
  const {stopLossRatio, takeProfitRatio} = accountTpSlInfo || {};
  const [strategy, setStrategy] = useState();

  // 用于存储外部传入的 onContinueSubmit 函数
  const onContinueSubmitRef = useRef(null);
  const strategyRef = useRef(null);

  const {mutateAsync, isLoading} = useMutation({
    mutationFn: updateCopyConfig,
  });

  const cancelAccountConfig = useMemoizedFn(async () => {
    // strategyRef
    await mutateAsync({
      copyConfigId,
      stopTakeDetailVOList: [
        {
          type: StopTakeTypeEnum.ACCOUNT, // 对应枚举的跟单类型
          takeProfitRatio: [STRATEGY_ENUM.CLEAR_STOP_LOSS].includes(
            strategyRef.current,
          )
            ? takeProfitRatio
            : null,
          stopLossRatio: [STRATEGY_ENUM.CLEAR_TAKE_PROFIT].includes(
            strategyRef.current,
          )
            ? stopLossRatio
            : null,
        },
      ],
    });
  });
  const open = useMemoizedFn(({onContinueSubmit, strategy}) => {
    strategyRef.current = strategy;
    onContinueSubmitRef.current = onContinueSubmit; // 存储外部传入的函数
    setStrategy(strategy);
    toggle(true);
  });

  const close = useMemoizedFn(() => {
    toggle(false);
  });

  const onOk = useMemoizedFn(async () => {
    close();
    await cancelAccountConfig();
    // 调用外部传入的 onContinueSubmit 函数
    if (onContinueSubmitRef.current) {
      onContinueSubmitRef.current();
    }
  });
  const lockOnOk = useLockFn(onOk);

  useImperativeHandle(
    ref,
    () => ({
      open,
    }),
    [open],
  );

  const {title, desc} =
    ConflictTipByStrategyMap[strategy || STRATEGY_ENUM.CLEAR_ALL];

  return (
    <ConfirmPopup
      id="EditCopyAmountPnSlConflictPopup"
      show={visible}
      onClose={close}
      onCancel={close}
      onOk={lockOnOk}
      okText={_t('a520b1406e534000aa19')}
      cancelText={_t('2f425ecc58da4000a949')}
      loading={isLoading}>
      <PopContent>
        <SuccessIcon
          source={
            isLight
              ? CommonStatusImageMap.WarnIcon
              : CommonStatusImageMap.WarnDarkIcon
          }
        />
        <SuccessText>{_t(title)}</SuccessText>
        <SuccessDesc>{_t(desc)}</SuccessDesc>
      </PopContent>
    </ConfirmPopup>
  );
});

export default memo(EditCopyAmountPnSlConflictPopup);

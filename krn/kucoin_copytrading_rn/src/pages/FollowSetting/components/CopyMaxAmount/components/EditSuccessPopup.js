import {useMemoizedFn, useToggle} from 'ahooks';
import React, {forwardRef, memo, useImperativeHandle, useState} from 'react';
import {getBaseCurrency} from 'site/tenant';
import styled from '@emotion/native';

import {ConfirmPopup} from 'components/Common/Confirm';
import {CommonStatusImageMap} from 'constants/image';
import {useIsLight} from 'hooks/useIsLight';
import useLang from 'hooks/useLang';

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

const EditSuccessPopup = forwardRef((_props, ref) => {
  const [visible, {toggle}] = useToggle(false);
  const [amountData, setAmountData] = useState({});
  const {_t} = useLang();
  const isLight = useIsLight();

  const open = useMemoizedFn(({oldAmount, newAmount}) => {
    setAmountData({oldAmount, newAmount});
    toggle(true);
  });

  const close = useMemoizedFn(() => {
    setAmountData({});
    toggle(false);
  });
  useImperativeHandle(
    ref,
    () => ({
      open,
    }),
    [open],
  );

  return (
    <ConfirmPopup
      id="tag"
      show={visible}
      onClose={close}
      onCancel={close}
      hiddenOk
      cancelText={_t('43c9eb76dc544000a38a')}>
      <PopContent>
        <SuccessIcon
          source={
            isLight
              ? CommonStatusImageMap.SuccessIcon
              : CommonStatusImageMap.SuccessDarkIcon
          }
        />
        <SuccessText>{_t('8009f3f17e024000a633')}</SuccessText>
        <SuccessDesc>
          {_t('102174e74a594000af90', {
            '1_num': amountData?.oldAmount,
            '2_num': amountData?.newAmount,
            symbol: getBaseCurrency(),
          })}
        </SuccessDesc>
      </PopContent>
    </ConfirmPopup>
  );
});

export default memo(EditSuccessPopup);

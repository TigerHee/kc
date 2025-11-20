import {useToggle} from 'ahooks';
import React, {forwardRef, useImperativeHandle} from 'react';
import {View} from 'react-native';
import {css} from '@emotion/native';

import {ConfirmPopup} from 'components/Common/Confirm';
import {CommonStatusImageMap} from 'constants/image';
import {useIsLight} from 'hooks/useIsLight';
import useLang from 'hooks/useLang';
import {gotoMainLeadPage} from 'utils/native-router-helper';
import {
  MOrderRow,
  MOrderWrap,
  OrderLabel,
  OrderRight,
  OrderRightText,
  PopContent,
  SuccessDesc,
  SuccessIcon,
  SuccessText,
} from './styles';

const OrderRow = ({positionNum, orderNum}) => {
  const {_t} = useLang();
  return (
    <View>
      <MOrderWrap>
        {orderNum > 0 && (
          <MOrderRow>
            <OrderLabel>{_t('0ef18dc4f4604000a247')}</OrderLabel>
            <OrderRight>
              <OrderRightText>{orderNum}</OrderRightText>
            </OrderRight>
          </MOrderRow>
        )}

        {positionNum > 0 && (
          <MOrderRow>
            <OrderLabel>{_t('9eed324dbb984000a04c')}</OrderLabel>
            <OrderRight>
              <OrderRightText>{positionNum}</OrderRightText>
            </OrderRight>
          </MOrderRow>
        )}
      </MOrderWrap>
    </View>
  );
};

export const OnProcessingOrderAlertModal = forwardRef((props, ref) => {
  const isLight = useIsLight();
  const {_t} = useLang();
  const {positionNum, orderNum} = props.leadOrderInfo || {};

  const [visible, {toggle}] = useToggle(false);

  const gotoMyLeadPage = () => {
    toggle();
    gotoMainLeadPage();
  };

  useImperativeHandle(
    ref,
    () => ({
      open: () => toggle(true),
    }),
    [toggle],
  );

  return (
    <ConfirmPopup
      styles={{
        containerStyle: css`
          margin: 0;
          padding: 0;
        `,
      }}
      id="OnProcessingOrderAlertModal"
      show={visible}
      onClose={toggle}
      onCancel={toggle}
      onOk={gotoMyLeadPage}
      okText={_t('5bd65cbe230b4000a537')}
      cancelText={_t('f59a79d01a754000adf0')}>
      <PopContent>
        <SuccessIcon
          source={
            isLight
              ? CommonStatusImageMap.FailIcon
              : CommonStatusImageMap.FailDarkIcon
          }
        />
        <SuccessText>{_t('82fbd0a83b0a4000aedd')}</SuccessText>
        <SuccessDesc>{_t('3e159f194abc4000afb4')}</SuccessDesc>
        <OrderRow positionNum={positionNum} orderNum={orderNum} />
      </PopContent>
    </ConfirmPopup>
  );
});

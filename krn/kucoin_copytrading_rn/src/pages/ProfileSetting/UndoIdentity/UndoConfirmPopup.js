import React, {memo} from 'react';
import {View} from 'react-native';
import {getBaseCurrency} from 'site/tenant';
import {css} from '@emotion/native';

import {ConfirmPopup} from 'components/Common/Confirm';
import NumberFormat from 'components/Common/NumberFormat';
import useLang from 'hooks/useLang';
import {
  MOrderRow,
  MOrderWrap,
  OrderLabel,
  OrderRight,
  OrderRightText,
  UndoConfirmDesc,
} from './styles';

const UndoConfirmPopup = ({
  showConfirm,
  setConfirmShow,
  onFinalSubmit,
  equityInfo,
  isApplyRevertLoading,
}) => {
  const {_t} = useLang();
  const {
    remainingFunds = '-',
    //未结算分润 本次不支持暂无数据
    // unsettledProfits = '',
  } = equityInfo || {};

  return (
    <ConfirmPopup
      styles={{
        containerStyle: css`
          margin: 16px 16px 0;
        `,
      }}
      loading={isApplyRevertLoading}
      show={showConfirm}
      title={_t('64e9aba4ed0e4000a1c7')}
      cancelText={_t('67cf010eb33b4000a0d1')}
      confirmText={_t('b31be4f93a764000a765')}
      onCancel={() => setConfirmShow(false)}
      onOk={onFinalSubmit}>
      <View>
        <UndoConfirmDesc>{_t('0db45fbcfc4f4000a14c')}</UndoConfirmDesc>

        <MOrderWrap>
          <MOrderRow>
            <OrderLabel>{_t('8e62ae9ace4f4000af53')}</OrderLabel>
            <OrderRight>
              <OrderRightText>
                <NumberFormat
                  style={css`
                    font-weight: 600;
                  `}>
                  {remainingFunds}
                </NumberFormat>
                {` ${getBaseCurrency()}`}
              </OrderRightText>
            </OrderRight>
          </MOrderRow>
        </MOrderWrap>
      </View>
    </ConfirmPopup>
  );
};

export default memo(UndoConfirmPopup);

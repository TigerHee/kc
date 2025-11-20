import React from 'react';
import {View} from 'react-native';
import styled from '@emotion/native';

import {TinyWarning} from 'components/Common/SvgIcon';
import {CANCEL_COPY_STATUS} from 'constants/businessType';
import useLang from 'hooks/useLang';

const TopBannerTipArea = styled.View`
  margin: 12px 16px 0;
  border-radius: 8px;
  padding: 12px;
  background: transparent;
  flex-direction: row;
  align-items: flex-start;
  background-color: ${({theme}) => theme.colorV2.complementary8};
`;

const TopBannerTipText = styled.Text`
  margin-left: 8px;
  color: ${({theme}) => theme.colorV2.text60};
  font-size: 14px;
  line-height: 21px;
  flex-wrap: wrap;
  flex: 1;
`;

export const IsCancelTopTip = ({status}) => {
  const {_t} = useLang();

  if (
    ![CANCEL_COPY_STATUS.CLOSING, CANCEL_COPY_STATUS.SETTLING].includes(status)
  ) {
    return null;
  }
  return (
    <TopBannerTipArea>
      <View style={{marginTop: 2}}>
        <TinyWarning />
      </View>
      <TopBannerTipText>{_t('f5e1f86231ca4000a96c')}</TopBannerTipText>
    </TopBannerTipArea>
  );
};

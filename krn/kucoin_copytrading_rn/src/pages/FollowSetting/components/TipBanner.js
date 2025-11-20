import React from 'react';
import styled from '@emotion/native';

const BannerWrap = styled.View`
  border-radius: 8px;
  background: ${({theme}) => theme.colorV2.cover4};
  padding: 12px;
  margin-bottom: 32px;
`;

const Desc = styled.Text`
  font-size: 14px;
  color: ${({theme}) => theme.colorV2.text60};
  font-weight: 400;
  line-height: 21px;
`;

const TipBanner = ({content}) => {
  return (
    <BannerWrap>
      <Desc>{content}</Desc>
    </BannerWrap>
  );
};

export default TipBanner;

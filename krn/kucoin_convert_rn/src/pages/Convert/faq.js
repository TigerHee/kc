/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import styled from '@emotion/native';
import FAQ from 'components/Convert/FAQ';
import HeaderPro from 'components/Common/HeaderPro';

const ConvertView = styled.SafeAreaView`
  flex: 1;
  background: ${({theme}) => theme.colorV2.overlay};
`;

const ConvertFAQPage = () => {
  return (
    <ConvertView>
      <HeaderPro title="FAQ" />
      <FAQ />
    </ConvertView>
  );
};
export default ConvertFAQPage;

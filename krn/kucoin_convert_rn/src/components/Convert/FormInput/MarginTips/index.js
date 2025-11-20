/**
 * Owner: John.Qi@kupotech.com
 */
import styled from '@emotion/native';
import React from 'react';
import {openLink} from 'utils/helper';
import {RichLocale} from '@krn/ui';

const Wrapper = styled.Pressable`
  background-color: ${({theme}) => theme.colorV2.complementary8};
  padding: 12px;
  margin: 12px 0 0;
  border-radius: 8px;
`;

const Inner = styled.Text`
  font-size: 14px;
  line-height: 18.2px;
  color: ${({theme}) => theme.colorV2.text60};
`;

const HiglightText = styled.Text`
  color: ${({theme}) => theme.colorV2.primary};
`;

const MarginTips = ({text}) => {
  const onClick = () => {
    openLink('/support/900004692086');
  };

  return (
    <Wrapper>
      <Inner>
        <RichLocale
          message={text}
          renderParams={{
            LINK: {
              component: HiglightText,
              componentProps: {onPress: onClick},
            },
          }}
        />
      </Inner>
    </Wrapper>
  );
};

export default MarginTips;

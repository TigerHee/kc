import styled from '@emotion/native';

import {commonStyles} from 'constants/styles';

export const Item = styled.View`
  ${commonStyles.flexRowCenter}
  ${commonStyles.justifyBetween}
  color: ${({theme}) => theme.color.complementary};
  background: ${({selected, theme}) => {
    return selected ? theme.colorV2.cover4 : theme.colorV2.layer;
  }};
  padding: 0 16px;
`;

export const ContentWrapper = styled.View`
  padding: 13px 0;
  flex: 1;
`;

export const Content = styled.Text`
  font-size: 16px;
  font-weight: 500;
  line-height: 20.8px;
  color: ${({theme}) => theme.colorV2.text};
`;

export const CheckIcon = styled.Image`
  width: 20px;
  height: 20px;
`;

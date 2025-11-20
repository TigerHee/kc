import styled from '@emotion/native';

import {commonStyles} from 'constants/styles';

export const ItemWrap = styled.View`
  ${commonStyles.flexRowCenter};
  ${commonStyles.justifyBetween};
`;

export const Label = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 14px;
  font-weight: 500;
  line-height: 18.2px;
`;

export const ArrowIc = styled.Image`
  width: 16px;
  height: 16px;
`;

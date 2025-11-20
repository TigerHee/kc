import styled from '@emotion/native';

import {commonStyles} from 'constants/styles';

export const MoreIcon = styled.Image`
  width: 24px;
  height: 24px;
`;

export const HelpIcon = styled.Image`
  width: 20px;
  height: 20px;
  transform: ${({isRTL}) => (isRTL ? 'scaleX(-1)' : 'scaleX(1)')};
`;

export const MoreTipText = styled.Text`
  ${commonStyles.textStyle}
  font-weight: 500;
  margin-left: 16px;
`;

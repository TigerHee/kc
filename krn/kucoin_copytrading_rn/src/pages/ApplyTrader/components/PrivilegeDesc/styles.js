import styled from '@emotion/native';

import Card from 'components/Common/Card';
import {commonStyles} from 'constants/styles';

export const DescCard = styled(Card)`
  padding: 20px 16px;
  margin-bottom: 20px;
  flex-direction: row;
  align-items: center;
`;

export const DescTitle = styled.Text`
  ${commonStyles.textStyle};
  margin-bottom: 12px;
`;

export const DescRightIcon = styled.Image`
  width: 56px;
  height: 56px;
  margin-left: auto;
`;

export const DescTextPrefixIcon = styled.Image`
  width: 14px;
  height: 14px;
  margin-right: 4px;
  margin-top: 4px;
`;

export const DescText = styled.Text`
  ${commonStyles.textSecondaryStyle};
  font-size: 14px;
  font-weight: 400;
  flex: 1;
`;

export const ContextTextItemWrap = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: ${({isLast}) => (isLast ? '0' : '4.5px')};
`;

export const DescWrap = styled.View`
  ${commonStyles.justifyBetween}
  flex-direction: row;
  flex: 1;
`;

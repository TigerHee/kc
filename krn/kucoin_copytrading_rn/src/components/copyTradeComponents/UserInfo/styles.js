import styled from '@emotion/native';

import {commonStyles} from 'constants/styles';

export const RowAroundWrap = styled.Pressable`
  ${commonStyles.flexRowCenter};
  justify-content: space-between;
`;

export const AvatarImg = styled.Image`
  width: 24px;
  height: 24px;
  border-radius: 24px;
`;

export const TraderNameWrap = styled.View`
  margin-left: 8px;
  flex: 1;
  margin-right: 12px;
`;

export const TraderName = styled.Text`
  ${commonStyles.textStyle};
`;

export const AvatarTextBox = styled.View`
  ${commonStyles.flexRowCenter};
  width: 24px;
  height: 24px;
  justify-content: center;
  border-radius: 24px;
  background-color: ${({theme}) => theme.colorV2.primary8};
  border: 1px solid ${({theme}) => theme.colorV2.primary12};
`;

export const AvatarTextBoxInnerText = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 10px;
  font-weight: 600;
`;

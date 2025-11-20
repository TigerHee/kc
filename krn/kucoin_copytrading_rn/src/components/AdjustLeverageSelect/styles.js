import styled from '@emotion/native';

import {commonStyles, RowWrap} from 'constants/styles';

export const SelectBox = styled.Pressable`
  ${commonStyles.flexRowCenter}
  padding: 7px 8px;
  border: 1px solid ${({theme}) => theme.colorV2.cover12};
  border-radius: 8px;
`;

export const LeverageText = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 14px;
  font-weight: 500;
  line-height: 18.2px;
`;

export const SelectedIcon = styled.Image`
  width: 12px;
  height: 12px;
  margin-left: 8px;
`;

export const AdjustIconBox = styled.Pressable`
  width: 24px;
  height: 24px;
  border-radius: 24px;
  background-color: ${({theme}) => theme.colorV2.cover4};
  align-items: center;
  justify-content: center;
  opacity: ${({disabled}) => (disabled ? '0.7' : 1)};
`;

export const AdjustIcon = styled.Image`
  width: 16px;
  height: 16px;
`;

export const ShowLeverageText = styled.Text`
  color: ${({theme}) => theme.colorV2.primary};
  font-size: 36px;
  font-weight: 600;
  line-height: 46.8px;
  width: 110px;
  text-align: center;
`;

export const CenterControlWrap = styled(RowWrap)`
  margin: 24px 0 18px;
  justify-content: center;
`;

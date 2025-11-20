import styled from '@emotion/native';

import {commonStyles, RowWrap} from 'constants/styles';

export const SecondaryFilterBarWrap = styled.View`
  ${commonStyles.flexRowCenter};
  margin: 16px 16px;
`;

export const SecondaryTabText = styled.Text`
  font-size: 12px;
  color: ${({theme, active}) =>
    !active ? theme.colorV2.text40 : theme.colorV2.text};
  font-weight: 500;
`;

export const BarWrap = styled(RowWrap)`
  margin: 24px 16px 8px;
  justify-content: space-between;
`;

export const BarText = styled.Text`
  ${commonStyles.textSecondaryStyle};
`;

export const BtnText = styled.Text`
  ${commonStyles.textSecondaryStyle};
  font-weight: 500;
  color: ${({theme}) => theme.colorV2.primary};
`;

export const Gap = styled.View`
  background-color: ${({theme}) => theme.colorV2.divider8};
  width: 1px;
  height: 14px;
  margin: 0 8px;
`;

export const RemoveItemWrap = styled.View`
  ${commonStyles.flexRowCenter};
  padding: 16px;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${({theme, isActive}) =>
    isActive ? theme.colorV2.text : theme.colorV2.divider8};
  background-color: ${({theme}) => theme.colorV2.backgroundMajor};
  margin-top: 16px;
  justify-content: space-between;
`;

export const RemoveConfigLabel = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 16px;
  font-weight: 600;
  line-height: 20.8px;
`;

export const RemoveConfigDesc = styled.Text`
  color: ${({theme}) => theme.colorV2.text40};
  font-size: 14px;
  font-weight: 400;
  line-height: 18.2px;
  margin-top: 8px;
`;

export const SelectIc = styled.Image`
  width: 20px;
  height: 20px;
`;

export const RemoveConfigContent = styled.View`
  padding-bottom: 16px;
`;

export const RemovePopupTitle = styled.Text`
  padding-top: 24px;
  color: ${({theme}) => theme.colorV2.text};
  font-size: 20px;
  font-weight: 600;
  line-height: 26px;
`;

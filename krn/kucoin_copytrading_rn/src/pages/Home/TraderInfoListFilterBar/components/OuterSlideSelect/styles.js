import styled from '@emotion/native';

export const TabItemBox = styled.View`
  padding: 4px 10px;
  border-radius: 4px;
  background-color: ${({theme, isActive}) =>
    isActive ? theme.colorV2.cover4 : theme.colorV2.overlay};
`;

export const TabItemText = styled.Text`
  font-size: 12px;
  font-weight: 500;
  line-height: 15.6px;
  color: ${({theme, isActive}) =>
    isActive ? theme.colorV2.text : theme.colorV2.text40};
`;

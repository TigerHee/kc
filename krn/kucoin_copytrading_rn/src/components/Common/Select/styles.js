import styled from '@emotion/native';

export const SelectGroupView = styled.View`
  /* border-bottom-width: 1px; */
  /* border-bottom-color: ${({theme}) => theme.colorV2.divider8}; */
`;

export const SelectWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  height: 16px;
`;

export const SelectedView = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const SelectedText = styled.Text`
  font-size: 12px;
  line-height: 15.6px;
  margin-right: 4px;
  color: ${({theme}) => theme.colorV2.text40};
  font-weight: 400;
  max-width: 120px;
`;

export const SelectedIcon = styled.Image`
  width: 12px;
  height: 12px;
`;

import {Pressable} from 'react-native';
import styled from '@emotion/native';

import {RowWrap} from 'constants/styles';

export const StyledTabs = styled(RowWrap)`
  padding: 4px;
  border-radius: 8px;
  background: ${({theme}) =>
    theme.type === 'light' ? theme.colorV2.cover4 : theme.colorV2.layer};

  ${({theme}) => {
    if (theme.type !== 'light')
      return `
      border: 1px solid ${theme.colorV2.divider8};
      `;
  }};
`;

export const StyledTab = styled(Pressable)`
  flex: 1;
  padding: 6px 12px;
  border-radius: 6px;
  ${({theme, isActive}) =>
    isActive &&
    `background-color:  ${
      theme.type === 'light' ? theme.colorV2.overlay : theme.colorV2.cover8
    }`}
`;

export const StyledText = styled.Text`
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  line-height: 18.2px;
  color: ${({theme, isActive}) =>
    isActive ? theme.colorV2.text : theme.colorV2.text40};
`;

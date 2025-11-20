import styled from '@emotion/native';
import {Tabs} from '@krn/ui';

export const TabText = styled.Text`
  font-size: 12px;
  color: ${({theme, active}) =>
    !active ? theme.colorV2.text40 : theme.colorV2.text};
  font-weight: 500;
`;

export const StyledTabs = styled(Tabs)`
  margin-bottom: 16px;
`;

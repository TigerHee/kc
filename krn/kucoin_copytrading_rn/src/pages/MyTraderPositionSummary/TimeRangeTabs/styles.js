import styled from '@emotion/native';
import {Tabs} from '@krn/ui';

export const StyledTabs = styled(Tabs)`
  border-bottom-width: 0;
`;

export const StyledTab = styled(Tabs.Tab)`
  margin-left: ${({isFirstElement}) => (isFirstElement ? '0' : '24px')};
`;

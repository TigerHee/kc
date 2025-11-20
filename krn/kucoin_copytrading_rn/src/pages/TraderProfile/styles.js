import styled from '@emotion/native';

import PageLayout from 'components/copyTradeComponents/TraderProfileComponents/PageLayout';

export const Page = styled.View`
  flex: 1;
  padding: 0 16px;
  background-color: ${({theme}) => theme.colorV2.backgroundMajor};
`;

export const SelfPageLayout = styled(PageLayout)`
  padding-bottom: 0px;
`;

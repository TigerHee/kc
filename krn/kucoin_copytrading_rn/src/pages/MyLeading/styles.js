import styled from '@emotion/native';

import Header from 'components/Common/Header';

export const MyLeadingListWrap = styled.View`
  background: ${({theme}) => theme.colorV2.overlay};
  flex: 1;
`;

export const StyledHeader = styled(Header)`
  background: ${({theme}) => theme.colorV2.overlay};
`;

export const CopyTradeFlatListWrap = styled.FlatList`
  padding: 0 16px 16px;
  background: ${({theme}) => theme.colorV2.overlay};
`;

import styled from '@emotion/native';

export const Body = styled.View`
  flex: 1;
  background: ${({theme, useOldBg}) =>
    useOldBg ? theme.colorV2.background : theme.colorV2.overlay};
`;

export const Main = styled.ScrollView`
  margin: 8px 16px 16px;
  flex: 1;
`;

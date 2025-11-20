import styled from '@emotion/native';

export const ApplyTraderBgWrap = styled.ImageBackground`
  width: 375px;
  height: 648px;
  flex: 1;
  background: ${({theme}) => theme.colorV2.overlay};
`;

export const Wrap = styled.View`
  flex: 1;
  background: ${({theme}) => theme.colorV2.overlay};
`;

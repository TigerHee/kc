import styled from '@emotion/native';

export const TopAreaWrapper = styled.ImageBackground`
  width: 375px;
  margin-top: ${({statusHeight = 0}) => (statusHeight || 0) + 'px'};
`;

export const TopAreaContentWrapper = styled.View`
  background-color: ${({theme}) => theme.colorV2.overlay};
  padding: 20px 16px 0;
`;

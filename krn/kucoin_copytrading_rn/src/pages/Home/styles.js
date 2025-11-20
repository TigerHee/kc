import styled, {css} from '@emotion/native';

export const HomeWrap = styled.View`
  flex: 1;
  background: ${({theme}) => theme.colorV2.overlay};
`;

export const MarketBoardTraderCardWrap = styled.View`
  background: ${({theme}) => theme.colorV2.overlay};
  min-height: 218px;
`;

export const HomeContentWrapper = styled.View`
  width: 100%;
  margin-bottom: 0;
  background: ${({theme}) => theme.colorV2.overlay};
`;

export const MarketBoardTitleBar = styled.View`
  padding: 0 16px;
  margin-top: 24px;
  background: ${({theme}) => theme.colorV2.overlay};
`;

export const makeTitleTextStyle = colors => css`
  font-size: 18px;
  font-weight: 600;
  line-height: 23.4px;
  color: ${colors.colorV2.text};
`;

export const CardBottomBg = styled.View`
  height: 6px;
  background: ${({theme}) => theme.colorV2.divider};
`;

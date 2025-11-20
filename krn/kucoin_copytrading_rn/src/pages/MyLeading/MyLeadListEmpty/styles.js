import styled from '@emotion/native';

export const PositionEmptyCard = styled.ImageBackground`
  padding: 32px 31.5px 40px;
  align-items: center;
  border-radius: 20px;
  margin: 0 16px 138px;
`;

export const EmptyImg = styled.Image`
  width: 74px;
  height: 100px;
  margin-right: 8px;
`;

export const TipText = styled.Text`
  color: ${({theme}) => theme.colorV2.text40};
  text-align: center;
  font-size: 13px;
  font-weight: 400;
  line-height: 16.9px;
  margin-bottom: 24px;
`;

export const LinearBg = styled.Image`
  width: 100%;
  height: 100%;
`;

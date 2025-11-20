import styled from '@emotion/native';

export const Body = styled.View`
  flex: 1;
  background: ${({theme}) => theme.colorV2.backgroundMajor};
`;

export const Main = styled.ScrollView`
  padding: 8px 16px 16px;
  flex: 1;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: 700;
  line-height: 31.2px;
  color: ${({theme}) => theme.colorV2.text};
  margin-bottom: 4px;
`;

export const Intro = styled.Text`
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  color: ${({theme}) => theme.colorV2.text40};
  margin-bottom: 24px;
`;

export const ItemBox = styled.View`
  padding: 16px;
  border-radius: 8px;
  border: 1px solid ${({theme}) => theme.colorV2.cover12};
  margin-bottom: 16px;
`;

export const ItemLine = styled.View`
  flex-direction: row;
  align-items: center;
  height: 40px;
`;

export const ItemLogo = styled.Image`
  width: 40px;
  height: 20px;
  margin-right: 8px;
`;

export const ItemTitle = styled.Text`
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 18.2px;
  color: ${({theme}) => theme.colorV2.text};
  flex: 1;
`;

export const RightArrow = styled.Image`
  width: 20px;
  height: 20px;
`;

export const ItemDesc = styled.Text`
  font-size: 12px;
  font-weight: 400;
  line-height: 15.6px;
  color: ${({theme}) => theme.colorV2.text40};
  margin-top: 8px;
`;

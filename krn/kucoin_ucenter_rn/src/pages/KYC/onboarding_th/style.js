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

export const StepTitle = styled.Text`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: ${({theme}) => theme.colorV2.text60};
  margin-bottom: 16px;
`;

export const Footer = styled.SafeAreaView`
  margin: 16px;
`;

export const ItemBox = styled.View`
  margin-bottom: 6px;
`;

export const ItemTitleLine = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ItemLogo = styled.Image`
  width: 20px;
  height: 20px;
  margin-right: 12px;
`;

export const ItemTitle = styled.Text`
  font-size: 16px;
  font-weight: 500;
  line-height: 20.8px;
  color: ${({theme}) => theme.colorV2.text};
`;

export const ContentBoxOutter = styled.View`
  margin-top: 6px;
  margin-left: 10px;
  overflow: hidden;
`;

export const ContentBox = styled.View`
  border-width: ${({isLast}) => (isLast ? '0px' : '1.2px')};
  border-color: ${({theme}) => theme.colorV2.cover12};
  border-style: dashed;
  padding-left: 22px;
  padding-bottom: 26px;
  margin: -2px;
  margin-left: 0;
`;

export const Content = styled.View`
  padding-top: 2px;
`;

export const ContentItem = styled.View`
  flex-direction: row;
  margin-bottom: ${({isLast}) => (isLast ? '0' : '4px')};
`;

export const Dot = styled.View`
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background: ${({theme}) => theme.colorV2.icon60};
  margin-right: 8px;
  margin-top: 8.5px;
`;

export const ContentText = styled.Text`
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  color: ${({theme}) => theme.colorV2.text60};
`;

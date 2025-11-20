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
  margin-bottom: 16px;
`;

export const Intro = styled.Text`
  font-size: 14px;
  font-weight: 400;
  line-height: 18.2px;
  color: ${({theme}) => theme.colorV2.text40};
`;

export const EmailBox = styled.View`
  padding: 16px;
  border-radius: 8px;
  margin-top: 8px;
  margin-bottom: 24px;
  background: ${({theme}) => theme.colorV2.cover2};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const EmailText = styled.Text`
  font-size: 14px;
  font-weight: 400;
  line-height: 18.2px;
  color: ${({theme}) => theme.colorV2.text};
`;

export const CopyIcon = styled.Image`
  height: 16px;
  width: 16px;
`;

export const ContentTitle = styled.Text`
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 19.5px;
  color: ${({theme}) => theme.colorV2.text60};
  margin-bottom: 12px;
`;

export const B = styled.Text`
  font-weight: 500;
  color: ${({theme}) => theme.colorV2.text};
`;

/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { Card, useUIContext } from '@krn/ui';
import styled from '@emotion/native';
import BackImg1 from 'assets/dark/back.png';
import BackImg2 from 'assets/light/back.png';
import Header from './Header';
import { TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { componentMap } from '../router';

const Wrapper = styled.SafeAreaView`
  background: ${({ theme }) => theme.colorV2.overlay};
  flex: 1;
`;

const CardWrapper = styled.ScrollView`
  margin: 0 20px 20px;
`;

const CardView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const CardText = styled.Text`
  color: ${({ theme }) => theme.color.complementary};
`;

const CardIcon = styled.Image`
  width: 24px;
  height: 24px;
  transform: rotate(180deg);
`;

const Home = () => {
  const { currentTheme } = useUIContext();
  const navigation = useNavigation();
  return (
    <Wrapper>
      <Header title="API文档" />
      <CardWrapper>
        {componentMap.map((item) => (
          <Card key={item.name}>
            <TouchableWithoutFeedback onPress={() => navigation.navigate(item.name)}>
              <CardView>
                <CardText>{item.name}</CardText>
                <CardIcon source={currentTheme === 'dark' ? BackImg1 : BackImg2} />
              </CardView>
            </TouchableWithoutFeedback>
          </Card>
        ))}
      </CardWrapper>
    </Wrapper>
  );
};

export default Home;

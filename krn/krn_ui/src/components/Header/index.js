/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import styled from '@emotion/native';
import { SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import BackImg1 from 'assets/dark/Header/back.png';
import BackImg2 from 'assets/light/Header/back.png';
import API from './API';
import registerAPI from 'utils/registerAPI';
import useUIContext from 'hooks/useUIContext';

const HeaderWrapper = styled.View`
  flex-direction: row;
  padding: 0 16px;
  height: 44px;
  align-items: center;
  background-color: ${({ theme }) => theme.colorV2.overlay};
`;

const Left = styled.View`
  width: 80px;
`;
const BackIcon = styled.Image`
  width: 20px;
  height: 20px;
`;

const Center = styled.View`
  flex: 1;
`;

const Title = styled.Text`
  font-size: 18px;
  line-height: 23.4px;
  font-weight: 600;
  text-align: center;
  color: ${({ theme }) => theme.colorV2.text};
`;

const Right = styled.View`
  width: 80px;
  flex-direction: row;
  justify-content: flex-end;
`;

const Header = ({ title, leftSlot, onPressBack, rightSlot, style }) => {
  const { currentTheme } = useUIContext();
  return (
    <SafeAreaView>
      <HeaderWrapper style={style}>
        <Left>
          {leftSlot === undefined ? (
            <TouchableWithoutFeedback onPress={onPressBack}>
              <BackIcon source={currentTheme === 'dark' ? BackImg1 : BackImg2} />
            </TouchableWithoutFeedback>
          ) : (
            leftSlot
          )}
        </Left>
        <Center>
          {typeof title === 'string' ? <Title numberOfLines={1}>{title}</Title> : title}
        </Center>
        <Right>{rightSlot}</Right>
      </HeaderWrapper>
    </SafeAreaView>
  );
};

registerAPI(Header, API);

export default Header;

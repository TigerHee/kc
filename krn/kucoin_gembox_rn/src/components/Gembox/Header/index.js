/**
 * Owner: roger.chen@kupotech.com
 */
import React from 'react';
import styled from '@emotion/native';
import {TouchableWithoutFeedback, SafeAreaView} from 'react-native';
// import {useNavigation} from '@react-navigation/native';
import Bridge from 'utils/bridge';

const HeaderWrapper = styled.View`
  flex-direction: row;
  padding: 0 20px;
  height: 44px;
  align-items: center;
  justify-content: space-between;
`;

const Left = styled.View`
  flex-shrink: 0;
`;
const BackIcon = styled.Image`
  width: 24px;
  height: 24px;
`;

const Center = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 100%;
`;

const Right = styled.View`
  width: 24px;
  flex-shrink: 0;
  flex-direction: row;
  justify-content: flex-end;
`;
const TitleImg = styled.Image`
  width: 42px;
  height: 8px;
  flex-shrink: 0;
`;
const TitleText = styled.Text`
  font-weight: normal;
  font-size: 18px;
  color: #00142a;
  margin-top: 4px;
`;

const Header = ({title, leftSlot, onPressBack, rightSlot}) => {
  // const navigation = useNavigation();
  const handleBack = () => {
    if (leftSlot) {
      return;
    }
    if (onPressBack) onPressBack();
    else {
      // if (navigation.canGoBack()) navigation.goBack();
      // else Bridge.exitRN();
      Bridge.exitRN();
    }
  };

  return (
    <SafeAreaView>
      <HeaderWrapper>
        <TouchableWithoutFeedback onPress={handleBack}>
          <Left>
            {leftSlot || (
              <BackIcon source={require('assets/common/back.png')} />
            )}
          </Left>
        </TouchableWithoutFeedback>
        <Center>
          <TitleImg
            autoRotateDisable
            source={require('assets/gembox/gemboxNew.png')}
          />
          <TitleText numberOfLines={1}>{title}</TitleText>
        </Center>
        <Right>{rightSlot}</Right>
      </HeaderWrapper>
    </SafeAreaView>
  );
};

export default Header;

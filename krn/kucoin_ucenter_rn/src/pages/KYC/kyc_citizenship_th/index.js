import {
  LeftSlot,
  MHeaderMajor,
  RightCloseSlot,
} from 'components/Common/NavIcons';
import useLang from 'hooks/useLang';
import {
  Body,
  Main,
  Title,
  Intro,
  ItemBox,
  ItemLogo,
  ItemTitle,
  RightArrow,
} from './style';
import React from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import useIconSrc from 'hooks/useIconSrc';
import {useNavigation} from '@react-navigation/native';

export default () => {
  const {_t} = useLang();
  const navigation = useNavigation();

  const arrowRightSrc = useIconSrc('arrowRight');

  const renderItem = ({logo, title, onPress}) => {
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <ItemBox>
          <ItemLogo source={logo} autoRotateDisable />
          <ItemTitle>{title}</ItemTitle>
          <RightArrow source={arrowRightSrc} />
        </ItemBox>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <Body>
      <MHeaderMajor leftSlot={<LeftSlot />} rightSlot={<RightCloseSlot />} />
      <Main>
        <Title>{_t('4ece38a0a3ac4000a90e')}</Title>
        <Intro>{_t('857075a8c2db4000a38b')}</Intro>
        {renderItem({
          logo: useIconSrc('thai'),
          title: _t('819e7137e9394000a95d'),
          onPress: () => {
            navigation.push('KYCMethodPage_TH');
          },
        })}
        {renderItem({
          logo: useIconSrc('foreign'),
          title: _t('e9bc5e12a5714000a4e7'),
          onPress: () => {
            navigation.push('KYCOnboardingPage_TH', {
              type: 'foreign',
            });
          },
        })}
      </Main>
    </Body>
  );
};

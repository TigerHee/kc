import React from 'react';
import {TouchableOpacity} from 'react-native';

import {CommonStatusImageMap} from 'constants/image';
import {useIsLight} from 'hooks/useIsLight';
import useLang from 'hooks/useLang';
import useTracker from 'hooks/useTracker';
import {gotoMainCopyHome, gotoMainCopyPage} from 'utils/native-router-helper';
import {
  CancelText,
  Container,
  Content,
  FixedBottomArea,
  StyledHeader,
  StyledSubmitBtn,
  SuccessDesc,
  SuccessIcon,
  SuccessText,
} from './styles';

const FollowSuccessResult = () => {
  const {_t} = useLang();
  const isLight = useIsLight();
  const {onClickTrack} = useTracker();
  const gotoMainCopyPageWithTrack = () => {
    onClickTrack({
      blockId: 'button',
      locationId: 'detail',
    });

    gotoMainCopyPage();
  };

  const gotoMainCopyHomeWithTrack = () => {
    onClickTrack({
      blockId: 'button',
      locationId: 'market',
    });

    gotoMainCopyHome();
  };

  return (
    <Container>
      <StyledHeader />

      <Content>
        <SuccessIcon
          source={
            isLight
              ? CommonStatusImageMap.SuccessIcon
              : CommonStatusImageMap.SuccessDarkIcon
          }
        />
        <SuccessText>{_t('dbf66401d6134000a84b')}</SuccessText>
        <SuccessDesc> {_t('4f0cb4fdc00c4000a818')}</SuccessDesc>
      </Content>

      <FixedBottomArea>
        <StyledSubmitBtn size="large" onPress={gotoMainCopyPageWithTrack}>
          {_t('29e74eb00c604000a628')}
        </StyledSubmitBtn>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={gotoMainCopyHomeWithTrack}>
          <CancelText>{_t('97f85b6c70cc4000ae94')}</CancelText>
        </TouchableOpacity>
      </FixedBottomArea>
    </Container>
  );
};

export default FollowSuccessResult;

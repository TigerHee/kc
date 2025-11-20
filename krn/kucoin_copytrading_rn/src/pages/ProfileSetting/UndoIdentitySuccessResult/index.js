import React from 'react';
import {View} from 'react-native';
import {css} from '@emotion/native';

import useLang from 'hooks/useLang';
import useTracker from 'hooks/useTracker';
import {gotoMainLeadPage} from 'utils/native-router-helper';
import {
  Container,
  Content,
  FixedBottomArea,
  StyledHeader,
  StyledSubmitBtn,
  SuccessDesc,
  SuccessIcon,
  SuccessText,
} from './styles';

const UndoIdentitySuccessResult = () => {
  const {_t} = useLang();
  const {onClickTrack} = useTracker();

  const gotoTransferWithTrack = async () => {
    onClickTrack({
      blockId: 'button',
      locationId: 'myLead',
    });
    gotoMainLeadPage();
  };
  return (
    <Container>
      <StyledHeader />

      <Content>
        <View
          style={css`
            align-items: center;
          `}>
          <SuccessIcon imgType="success" />
        </View>
        <SuccessText>{_t('6c5abaca8b994000a30e')}</SuccessText>
        <SuccessDesc>{_t('ec5cf9483b044000a4ab')}</SuccessDesc>
      </Content>

      <FixedBottomArea>
        <StyledSubmitBtn size="large" onPress={gotoTransferWithTrack}>
          {_t('43c9eb76dc544000a38a')}
        </StyledSubmitBtn>
      </FixedBottomArea>
    </Container>
  );
};

export default UndoIdentitySuccessResult;

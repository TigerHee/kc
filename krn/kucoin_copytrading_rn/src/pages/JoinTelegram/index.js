import React from 'react';
import {Clipboard, Pressable} from 'react-native';
import styled from '@emotion/native';
import {showToast} from '@krn/bridge';
import {Button} from '@krn/ui';

import copyIc from 'assets/common/ic-copy.png';
import telegramIc from 'assets/common/telegram-group.png';
import Header from 'components/Common/Header';
import useLang from 'hooks/useLang';
import useTracker from 'hooks/useTracker';

const Container = styled.View`
  background-color: ${({theme}) => theme.colorV2.backgroundMajor};
  flex: 1;
  width: 100%;
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 0 16px;
  margin-top: 24px;
`;

const ContentTop = styled.View`
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const ContentImage = styled.Image`
  width: 112.5px;
  height: 105px;
`;

const ContentTextWrap = styled.View`
  margin-top: 28px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const ContentTitle = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 18px;
  font-weight: 600;
  line-height: 23.4px;
  margin-bottom: 12px;
`;

const ContentSubtitle = styled.Text`
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  color: ${({theme}) => theme.colorV2.text40};
`;

const StyledButton = styled(Button)`
  margin-top: 24px;
`;

const ContentFooter = styled.View`
  margin-top: 24px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const ContentFooterText = styled.Text`
  color: ${({theme}) => theme.colorV2.text40};
  font-size: 14px;
  font-weight: 400;
  line-height: 18.2px;
`;

const ContentFooterBottom = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
`;

const ContentFooterBottomIcon = styled.Image`
  width: 16px;
  height: 16px;
  margin-left: 4px;
`;
/* //TODO: 产品补充链接 */
const targetTgLink = 'test.com';

const JoinTelegram = () => {
  const {onClickTrack} = useTracker();
  const {_t} = useLang();

  const gotoJoin = () => {
    onClickTrack({
      blockId: 'button',
      locationId: 'joinTelegram',
    });
  };

  const copyToClipboard = () => {
    Clipboard.setString(targetTgLink);
    showToast(_t('copy.succeed'));
  };

  return (
    <Container>
      <Header />

      <Content>
        <ContentTop>
          <ContentImage source={telegramIc} />
          <ContentTextWrap>
            <ContentTitle>{_t('4ecd719ec9b04000a47e')}</ContentTitle>
            <ContentSubtitle>{_t('d3e9813035274000aa4d')}</ContentSubtitle>
          </ContentTextWrap>
        </ContentTop>
        <StyledButton onPress={gotoJoin} size="large">
          {_t('4ecd719ec9b04000a47e')}
        </StyledButton>
        <ContentFooter>
          <ContentFooterText>{_t('1be942b3eec24000a446')}</ContentFooterText>
          <ContentFooterBottom>
            <ContentFooterText>{targetTgLink}</ContentFooterText>
            <Pressable onPress={copyToClipboard}>
              <ContentFooterBottomIcon source={copyIc} />
            </Pressable>
          </ContentFooterBottom>
        </ContentFooter>
      </Content>
    </Container>
  );
};

export default JoinTelegram;

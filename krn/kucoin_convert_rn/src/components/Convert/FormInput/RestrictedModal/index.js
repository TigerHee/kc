import React from 'react';
import {Button, Confirm} from '@krn/ui';
import styled from '@emotion/native';
import restricted_dialog_logo from 'assets/convert/restricted_dialog_logo.png';
import {openNative} from '@krn/bridge';

const RestrictedModalOuter = styled.View`
  width: 100%;
  flex-direction: row;
  max-height: 66.67%;
`;
const RestrictedModalWrapper = styled.View`
  background-color: ${({theme}) => theme.colorV2.layer};
  border-radius: 20px;
  flex: 1;
  margin: 0 16px;
  padding: 40px 24px 32px;
  align-items: center;
`;

const Logo = styled.Image`
  width: 148px;
  height: 148px;
`;

const Title = styled.Text`
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 12px;
  color: ${({theme}) => theme.colorV2.text};
  line-height: 26px;
`;

const DescScroller = styled.ScrollView`
  margin-bottom: 24px;
`;

const Desc = styled.Text`
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  color: ${({theme}) => theme.colorV2.text60};
`;

const ButtonBox = styled.View`
  flex-direction: row;
`;
const ExButton = styled(Button)`
  flex: 1;
  /* height: 40px;
  border-radius: 24px; */
`;

const CancelButton = styled(ExButton)`
  margin-right: ${({gap}) => (gap ? '12px' : 0)};
  /* background-color: ${({theme}) => theme.colorV2.cover4}; */
`;
const ConfirmButton = styled(ExButton)``;

export default ({
  show,
  onClose,
  title,
  content,
  buttonRefuse,
  buttonRefuseAppUrl,
  buttonAgree,
  buttonAgreeAppUrl,
}) => {
  return (
    <Confirm show={show} onClose={onClose}>
      <RestrictedModalOuter>
        <RestrictedModalWrapper>
          <Logo source={restricted_dialog_logo} />
          <Title>{title}</Title>
          <DescScroller>
            <Desc>{content}</Desc>
          </DescScroller>
          <ButtonBox>
            {buttonRefuse ? (
              <CancelButton
                onPress={() => {
                  onClose && onClose();
                  if (buttonRefuseAppUrl) {
                    setTimeout(() => openNative(buttonRefuseAppUrl), 200);
                  }
                }}
                gap={!!buttonAgree}
                type="secondary"
                // textStyle={{color: theme.colorV2.text, fontWeight: 'bold'}}
              >
                {buttonRefuse}
              </CancelButton>
            ) : null}
            {buttonAgree ? (
              <ConfirmButton
                onPress={() => {
                  onClose && onClose();
                  if (buttonAgreeAppUrl) {
                    setTimeout(() => openNative(buttonAgreeAppUrl), 200);
                  }
                }}
                // textStyle={{
                //   color: theme.colorV2.textEmphasis,
                //   fontWeight: 'bold',
                // }}
              >
                {buttonAgree}
              </ConfirmButton>
            ) : null}
          </ButtonBox>
        </RestrictedModalWrapper>
      </RestrictedModalOuter>
    </Confirm>
  );
};

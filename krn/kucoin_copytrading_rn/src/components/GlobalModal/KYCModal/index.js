import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {openNative} from '@krn/bridge';
import {Confirm, Empty} from '@krn/ui';

import {
  ButtonBox,
  CancelButton,
  ConfirmButton,
  Content,
  Desc,
  DescScroller,
  ImageWrapper,
  Title,
  Wrapper,
} from './styles';

export default ({}) => {
  const kyc3TradeLimitInfo = useSelector(state => state.app.kyc3TradeLimitInfo);
  const dispatch = useDispatch();

  const {
    title,
    content,
    buttonAgree,
    buttonAgreeAppUrl,
    buttonRefuse,
    buttonRefuseAppUrl,
  } = kyc3TradeLimitInfo || {};

  const handleClose = () => {
    dispatch({type: 'app/update', payload: {kyc3TradeLimitInfo: {}}});
  };

  const handlePress = url => {
    handleClose();
    if (url) {
      setTimeout(() => openNative(url), 200);
    }
  };

  return (
    <Confirm show={!!title} onClose={handleClose}>
      <Wrapper>
        <Content>
          <ImageWrapper>
            <Empty imgType="error" />
          </ImageWrapper>

          <Title>{title}</Title>
          <DescScroller>
            <Desc>{content}</Desc>
          </DescScroller>
          <ButtonBox>
            {buttonRefuse ? (
              <CancelButton
                onPress={() => handlePress(buttonRefuseAppUrl)}
                gap={!!buttonAgree}
                type="secondary">
                {buttonRefuse}
              </CancelButton>
            ) : null}
            {buttonAgree ? (
              <ConfirmButton onPress={() => handlePress(buttonAgreeAppUrl)}>
                {buttonAgree}
              </ConfirmButton>
            ) : null}
          </ButtonBox>
        </Content>
      </Wrapper>
    </Confirm>
  );
};

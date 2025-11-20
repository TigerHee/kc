/**
 * Owner: tom@kupotech.com
 */
import React from 'react';
import { Button } from '@kufox/mui';
import { styled } from '@kufox/mui';
import { replace } from 'utils/router';
import { _t } from 'tools/i18n';
import successImg from 'static/listing/success.png';

const Wrapper = styled.div`
  margin-top: 106px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StatusImg = styled.img`
  width: 180px;
  height: 180px;
`;

const StatusTitle = styled.div`
  margin-top: 24px;
  font-weight: 500;
  font-size: 28px;
  line-height: 130%;
  text-align: center;
  color: ${(props) => props.theme.colors.text};
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-top: 30px;
    font-size: 24px;
  }
`;

const StatusTip = styled.div`
  margin-top: 8px;
  font-size: 14px;
  line-height: 130%;
  text-align: center;
  color: ${(props) => props.theme.colors.text60};
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-top: 10px;
  }
`;

const ButtonStyle = styled(Button)`
  margin-top: 30px;
  min-width: 198px;
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-top: 36px;
  }
`;

function ApplyResult() {
  return (
    <Wrapper>
      <StatusImg src={successImg} alt="" />
      <StatusTitle>{_t('6nYEhNhk2P9fmviH719pxd')}</StatusTitle>
      <StatusTip>{_t('aNXxQYd7EJnHuWXx7Aqesr')}</StatusTip>
      <ButtonStyle size="large" onClick={() => replace('/listing')}>
        {_t('697G8EYBwbVeNz4iHUh64j')}
      </ButtonStyle>
    </Wrapper>
  );
}

export default ApplyResult;

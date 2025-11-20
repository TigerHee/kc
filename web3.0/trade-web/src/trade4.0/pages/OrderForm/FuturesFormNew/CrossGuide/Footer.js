/**
 * Owner: clyne@kupotech.com
 */
import React, { memo } from 'react';

import KuxButton from '@mui/Button';

import { _t, styled, fx } from '../builtinCommon';

const PreviousBtn = styled(KuxButton)`
  ${(props) => fx.color(props, 'text60')}
`;
const OkBtn = styled(KuxButton)``;
const FooterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 20px 32px;
  button {
    margin-left: 24px;
  }
`;

const Footer = ({ step, onPrev, onOk }) => {
  const okText = step === 2 ? _t('trial2.successModal.toTrade') : `${_t('cross.guide.next')} (1/2)`;
  const previousText = _t('cross.guide.previous');
  return (
    <FooterWrapper>
      {step === 1 ? null : (
        <PreviousBtn variant="text" size="small" onClick={onPrev}>
          {previousText}
        </PreviousBtn>
      )}
      <OkBtn variant="contained" type="primary" size="basic" onClick={onOk}>
        {okText}
      </OkBtn>
    </FooterWrapper>
  );
};

export default memo(Footer);

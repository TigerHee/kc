/**
 * Owner: john.zhang@kupotech.com
 */

import { styled, Tooltip } from '@kux/mui';
import React from 'react';
import faq from 'static/account/transfer/service-faq.svg';
import { addLangToPath, _t } from 'tools/i18n';

export const ServiceWrap = styled.div`
  position: fixed;
  right: 40px;
  bottom: 88px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    right: 12px;
  }
  [dir='rtl'] & {
    right: auto;
    left: 40px;
    ${({ theme }) => theme.breakpoints.down('sm')} {
      right: auto;
      left: 12px;
    }
  }
`;

const IconItem = styled.a`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin-bottom: 16px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.divider8};
  border-radius: 12px;
  box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const IconItemImg = styled.img`
  width: 36px;
  height: 36px;
`;

const FAQ = React.memo(() => {
  return (
    <ServiceWrap>
      <Tooltip placement="left" leaveDelay={50} title={_t('fc8d5acef7c34800a73c')}>
        <IconItem href={addLangToPath('/support')} target="_blank" rel="noopener noreferrer">
          <IconItemImg src={faq} alt="FAQ" title="FAQ" />
        </IconItem>
      </Tooltip>
    </ServiceWrap>
  );
});

export default FAQ;

/**
 * Owner: judith@kupotech.com
 */
import React, { useRef } from 'react';
import { useTranslation } from '@tools/i18n';

import { styled } from '@kux/mui/emotion';

const Name = styled.span`
  display: inline-flex;
  align-items: center;
  svg {
    margin-top: 2px;
    margin-left: 2px;
  }
`;

const useCountedFundingAccount = (labelKey) => {
  const { t: _t } = useTranslation('transfer');
  const eleRef = useRef();
  return <Name ref={eleRef}>{_t(labelKey)}</Name>;
};

export default useCountedFundingAccount;

export const withCountedFoundingAccount = (labelKey) => (WrappedComponent) => (props) => {
  const { t: _t } = useTranslation('transfer');
  const FundingAccountName = () => {
    const eleRef = useRef();
    return <Name ref={eleRef}>{_t(labelKey)}</Name>;
  };

  return <WrappedComponent {...props} fundingAccountName={<FundingAccountName />} />;
};

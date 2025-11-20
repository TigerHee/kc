/**
 * Owner: judith@kupotech.com
 */
import React, { useRef } from 'react';
import { _t } from 'tools/i18n';
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
  const eleRef = useRef();
  return <Name ref={eleRef}>{_t(labelKey)}</Name>;
};

export default useCountedFundingAccount;

export const withCountedFoundingAccount = (labelKey) => (WrappedComponent) => (props) => {
  const FundingAccountName = () => {
    const eleRef = useRef();
    return (
      <Name ref={eleRef}>
        {_t(labelKey)}
        {/* {count <= 20 ? (
          ` ${_t('original.main.account')}`
        ) : count <= 50 ? (
          <Tooltip placement="top" title={_t('original.main.account.tip')}>
            <ICInfoOutlined size={14} />
          </Tooltip>
        ) : null} */}
      </Name>
    );
  };

  return <WrappedComponent {...props} fundingAccountName={<FundingAccountName />} />;
};

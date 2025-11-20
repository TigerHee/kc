/**
 * Owner: judith@kupotech.com
 */
import React, { useRef } from 'react';
import useClickCount from './useClickCount';
import { _t } from 'utils/lang';
import Tooltip from '@mui/Tooltip';

import { ICInfoOutlined } from '@kux/icons';

const key = 'FUNDINGACCOUNTCLICK';

const useCountedFundingAccount = (labelKey) => {
  const eleRef = useRef();
  const count = useClickCount(eleRef, key);
  return (
    <span ref={eleRef} style={{ display: 'inline-flex', alignItems: 'center' }}>
      {_t(labelKey)}
      {count <= 20 ? (
        `${_t('original.main.account')}`
      )
      //  : count <= 50 ? (
      //   <Tooltip placement="top" title={_t('original.main.account.tip')}>
      //     <ICInfoOutlined style={{ marginLeft: '5px' }} />
      //   </Tooltip>
      // )
      : null}
    </span>
  );
};

export default useCountedFundingAccount;

export const withCountedFoundingAccount =
  (labelKey) => (WrappedComponent) => (props) => {
    const FundingAccountName = () => {
      const eleRef = useRef();
      const count = useClickCount(eleRef, key);
      return (
        <span ref={eleRef}>
          {_t(labelKey)}
          {count <= 20 ? (
            `${_t('original.main.account')}`
          ) : count <= 50 ? (
            <Tooltip placement="top" title={_t('original.main.account.tip')}>
              <ICInfoOutlined />
            </Tooltip>
          ) : null}
        </span>
      );
    };

    return (
      <WrappedComponent
        {...props}
        fundingAccountName={<FundingAccountName />}
      />
    );
  };

/**
 * Owner: judith@kupotech.com
 */
import { useRef } from 'react';
import { _t } from 'tools/i18n';

const key = 'FUNDINGACCOUNTCLICK';

const useCountedFundingAccount = (labelKey) => {
  const eleRef = useRef();
  // const count = useClickCount(eleRef, key);
  return (
    <span ref={eleRef}>
      {_t(labelKey)}
      {/* {count <= 20 ? (
        `${_t('original.main.account')}`
      ) : count <= 50 ? (
        <Tooltip placement="top" title={_t('original.main.account.tip')}>
          <ICInfoOutlined />
        </Tooltip>
      ) : null} */}
    </span>
  );
};

export default useCountedFundingAccount;

export const withCountedFoundingAccount = (labelKey) => (WrappedComponent) => (props) => {
  const FundingAccountName = () => {
    const eleRef = useRef();
    // const count = useClickCount(eleRef, key);
    return (
      <span ref={eleRef}>
        {_t(labelKey)}
        {/* {count <= 20 ? (
          `${_t('original.main.account')}`
        ) : count <= 50 ? (
          <Tooltip placement="top" title={_t('original.main.account.tip')}>
            <ICInfoOutlined />
          </Tooltip>
        ) : null} */}
      </span>
    );
  };

  return <WrappedComponent {...props} fundingAccountName={<FundingAccountName />} />;
};

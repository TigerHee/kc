/**
 * Owner: willen@kupotech.com
 */
import BaseButton from 'components/Account/Kyc3/Home/KycStatusCard/components/Button';
import { useSelector } from 'react-redux';

const VerifyButton = ({ children, onClick, size, ...props }) => {
  const loading = useSelector((s) => s.loading);
  const fetching = loading.effects['kyc/checkKycRisk'] || loading.effects['kyc/updateClearInfo'];
  const disabled = loading.effects['kyc/pullKycInfo'] || fetching;
  return (
    <BaseButton
      className="verify-button"
      data-inspector="account_kyc_open_modal_btn"
      onClick={onClick}
      disabled={disabled}
      loading={fetching}
      size={size}
      {...props}
    >
      {children}
    </BaseButton>
  );
};

export default VerifyButton;

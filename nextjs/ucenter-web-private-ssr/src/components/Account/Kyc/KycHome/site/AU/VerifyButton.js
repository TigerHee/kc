/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ICArrowRight2Outlined } from '@kux/icons';
import { Button } from '@kux/mui';
import { KYC_STATUS_ENUM } from 'src/constants/kyc/enums';
import { _t } from 'src/tools/i18n';

export const VerifyButton = ({ status, onClick, ...props }) => {
  const btnText =
    status === KYC_STATUS_ENUM.SUSPEND ? (
      <span>{_t('79229508f5c24800a095')}</span>
    ) : status === KYC_STATUS_ENUM.REJECTED ? (
      <span>{_t('205f4884ec904800a1c2')}</span>
    ) : (
      <span>{_t('7021b44675954000a833')}</span>
    );

  return (
    <Button onClick={onClick} {...props}>
      {btnText}
      <ICArrowRight2Outlined size={16} />
    </Button>
  );
};

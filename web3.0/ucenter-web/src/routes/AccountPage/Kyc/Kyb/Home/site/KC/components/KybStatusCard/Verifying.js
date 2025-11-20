/**
 * Owner: vijay.zhou@kupotech.com
 */
import { useEffect } from 'react';
import { _t } from 'src/tools/i18n';
import { saTrackForBiz } from 'src/utils/ga';
import WaitIcon from 'static/account/kyc/kyb/wait_icon.svg';
import { Warning } from '../../../../components/styled';
import VerificationRequirements from '../../../../components/VerificationRequirements';

const Verifying = ({ desc }) => {
  useEffect(() => {
    saTrackForBiz({}, ['KYBWaiting']);
  }, []);

  return (
    <VerificationRequirements desc={desc}>
      <Warning>
        <img src={WaitIcon} alt="wait" />
        {_t('71673fa088544000a1eb')}
      </Warning>
    </VerificationRequirements>
  );
};

export default Verifying;

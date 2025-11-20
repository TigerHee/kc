/**
 * Owner: tiger@kupotech.com
 */
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { KYC_TYPE } from 'src/constants/kyc/enums';
import useKycCache from 'src/hooks/useKycCache';
import AUKYBStatusCard from './components/AUKYBStatusCard';
import { push, replace } from '@/utils/router';

export default () => {
  const { kybInfo = {} } = useSelector((state) => state.kyc ?? {});
  const [, pullCache, postCache] = useKycCache();

  const handleRestart = async () => {
    try {
      const success = await postCache({ type: KYC_TYPE.INSTITUTIONAL });
      if (success) push('/account/kyb/setup');
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { region, type } = await pullCache();
        if (!(region && type === KYC_TYPE.INSTITUTIONAL) && kybInfo.verifyStatus === -1) {
          replace('/account/kyb/setup');
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [kybInfo]);

  return <AUKYBStatusCard onBack={handleRestart} isInMigrate={false} />;
};

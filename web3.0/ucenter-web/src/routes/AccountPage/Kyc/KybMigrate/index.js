/**
 * Owner: tiger@kupotech.com
 */
import loadable from '@loadable/component';
import { useEffect, useState } from 'react';
import useKycCountries from 'src/hooks/useKycCountries';
import { pullUserCanTransfer } from 'src/services/user_transfer';
import { replace } from 'utils/router';

const AU = loadable(() => import('./site/AU'));
const EU = loadable(() => import('./site/EU'));

const Migrate = () => {
  // 迁移目标站点
  const [targetSiteType, setTargetSiteType] = useState('');
  const [targetRegion, setTargetRegion] = useState('');
  const [loading, setLoading] = useState(true);
  const [countries, pullCountries] = useKycCountries();

  const checkMigrateEnable = async () => {
    try {
      const { data } = await pullUserCanTransfer();
      if (!data.canTransfer) {
        throw new Error('No migration required!');
      }
      setTargetSiteType(data.targetSiteType);
      setTargetRegion(data.targetRegion);
      setLoading(false);
    } catch (error) {
      console.error(error);
      replace('/404');
    }
  };

  useEffect(() => {
    checkMigrateEnable();
    pullCountries();
  }, []);

  if (loading) {
    return null;
  }

  switch (targetSiteType) {
    case 'australia':
      return <AU targetSiteType={targetSiteType} />;
    case 'europe':
      return (
        <EU targetSiteType={targetSiteType} targetRegion={targetRegion} siteRegions={countries} />
      );
    default:
      return null;
  }
};

export default Migrate;

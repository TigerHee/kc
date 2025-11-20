/**
 * Owner: vijay.zhou@kupotech.com
 */
import loadable from '@loadable/component';
import { useEffect, useState } from 'react';
import { pullSiteRegions } from 'src/services/kyc';
import { pullUserCanTransfer } from 'src/services/user_transfer';
import { replace } from '@/utils/router';
import AccountLayout from '@/components/AccountLayout';
import ErrorBoundary, { SCENE_MAP } from '@/components/common/ErrorBoundary';

const AU = loadable(() => import('./site/AU'));
const EU = loadable(() => import('./site/EU'));

const Migrate = () => {
  // 迁移目标站点
  const [targetSiteType, setTargetSiteType] = useState('');
  const [targetRegion, setTargetRegion] = useState('');
  const [loading, setLoading] = useState(true);
  const [siteRegions, setSiteRegions] = useState([]);

  const getSiteRegions = async (siteType) => {
    try {
      const { data } = await pullSiteRegions({ kycType: 1, siteType });
      setSiteRegions(data);
    } catch (error) {
      console.error(error);
    }
  };

  const checkMigrateEnable = async () => {
    try {
      const { data } = await pullUserCanTransfer();
      if (!data.canTransfer) {
        throw new Error('No migration required!');
      }
      setTargetSiteType(data.targetSiteType);
      setTargetRegion(data.targetRegion);
      getSiteRegions(data.targetSiteType);
      setLoading(false);
    } catch (error) {
      console.error(error);
      replace('/404');
    }
  };

  useEffect(() => {
    checkMigrateEnable();
  }, []);

  if (loading) {
    return null;
  }

  switch (targetSiteType) {
    case 'australia':
      return <AU targetSiteType={targetSiteType} />;
    case 'europe':
      return (
        <EU targetSiteType={targetSiteType} targetRegion={targetRegion} siteRegions={siteRegions} />
      );
    default:
      return null;
  }
};

export default function MigrateWithLayout() {
  return (
    <ErrorBoundary scene={SCENE_MAP.kyc.kyc_migrate}>
      <AccountLayout>
        <Migrate />
      </AccountLayout>
    </ErrorBoundary>
  );
};

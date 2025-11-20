/**
 * Owner: vijay.zhou@kupotech.com
 */
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BindDialog from 'src/components/Account/Kyc/KycHome/components/BindDialog';
import Header from 'src/components/Account/Kyc/KycHome/components/Header';
import Layout from 'src/components/Account/Kyc/KycHome/components/Layout';
import RestartDialog from 'src/components/Account/Kyc/KycHome/components/RestartDialog';
import FAQ from 'src/components/Account/Kyc/KycHome/site/EU/FAQ';
import { tenantConfig } from 'src/config/tenant';
import { KYC_STATUS_ENUM, KYC_TYPE } from 'src/constants/kyc/enums';
import useKycCache from 'src/hooks/useKycCache';
import { pullSiteRegions } from 'src/services/kyc';
import { _t } from 'src/tools/i18n';
import { isTMA } from 'src/utils/tma/bridge';
import { replace } from '@/utils/router';
import BasicCertCard from './components/BasicCertCard';
import BasicVerifiedCard from './components/BasicVerifiedCard';
import AdvanceCertCard from './components/AdvanceCertCard';
import ProUserCertCard from './components/ProUserCertCard';
import PersonalInformation from './components/PersonalInformation';
import useKyc3Status from 'routers/AccountPage/Kyc/KycHome/site/KC/hooks/useKyc3Status';
import styles from './styles.module.scss';

const KycHome = ({ onBack }) => {

  const { kyc3Status, kyc3StatusEnum } = useKyc3Status();

  const [cache, pullCache, postCache] = useKycCache();
  const [regions, setRegions] = useState([]);
  const [bindDialogOpen, setBindDialogOpen] = useState(false);
  const [restartOpen, setRestartOpen] = useState(false);
  const { kycInfo } = useSelector((state) => state.kyc ?? {});
  const { basicResult, basicCraResult, advanceResult } = useSelector((state) => state.kyc_eu ?? {});
  const dispatch = useDispatch();

  const regionCode = cache.region || kycInfo?.regionCode;
  const identityType = cache.identityType || kycInfo.identityType;
  const isBasicUnverified = kyc3Status === kyc3StatusEnum.UNVERIFIED;
  const isBasicVerified = kyc3Status === kyc3StatusEnum.VERIFIED;

  // 只要用户不是审核中/已通过，就可以任意提交KYC/KYB
  const isCannotSwitchType = [KYC_STATUS_ENUM.VERIFYING, KYC_STATUS_ENUM.VERIFIED].includes(
    basicResult.status,
  );

  /* 有kyc提交记录不显示切换 */
  const hiddenRightSwitch = isCannotSwitchType || isTMA();
  const handleBack = async () => {
    try {
      const success = await postCache({ type: KYC_TYPE.PERSONAL });
      if (success) onBack();
    } catch (err) {
      console.error(err);
    }
  };
  const handleRestart = () => {
    if (isBasicUnverified) {
      handleBack();
    } else {
      setRestartOpen(true);
    }
  };

  const { regionName, regionIcon } = useMemo(() => {
    const temp = regions.find((c) => c.code === regionCode);
    return {
      regionName: temp ? temp.name : kycInfo.regionName,
      regionIcon: temp ? temp.icon : kycInfo.regionIcon,
    };
  }, [regions, kycInfo, regionCode]);

  useEffect(() => {
    dispatch({ type: 'kyc_eu/pullBasicResult' });
    pullSiteRegions({ siteType: tenantConfig.kyc.siteRegion, kycType: 1 })
      .then(({ data }) => {
        setRegions(data ?? []);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    (async () => {
      if (isBasicUnverified) {
        try {
          const { region, identityType, type } = await pullCache();
          if (!region || !identityType || type !== KYC_TYPE.PERSONAL) {
            replace('/account/kyc');
          }
        } catch (err) {
          console.log(err?.msg || err?.message);
        }
      }
    })();
  }, [isBasicUnverified]);

  useEffect(() => {
    if (basicResult.status === KYC_STATUS_ENUM.VERIFIED) {
      dispatch({ type: 'kyc_eu/pullBasicCraResult' });
    }
  }, [basicResult]);

  useEffect(() => {
    if (basicCraResult.status === KYC_STATUS_ENUM.VERIFIED) {
      dispatch({ type: 'kyc_eu/pullAdvanceResult' });
    }
  }, [basicCraResult]);

  useEffect(() => {
    if (advanceResult.status === KYC_STATUS_ENUM.VERIFIED) {
      dispatch({ type: 'kyc_eu/pullProUserResult' });
    }
  }, [advanceResult]);

  return (
    <main>
      <Layout
        top={
          <Header
            regionName={regionName}
            regionIcon={regionIcon}
            canBack={!hiddenRightSwitch}
            onBack={handleRestart}
          />
        }
        bottomLeft={
          <div className={styles.content}>
            {
              kyc3Status
                ? isBasicVerified
                  ? <BasicVerifiedCard />
                  : <BasicCertCard regionCode={regionCode} identityType={identityType} />
                : null
            }
            <AdvanceCertCard />
            <ProUserCertCard />
            <PersonalInformation />
          </div>
        }
        bottomRight={<FAQ />}
      />
      <RestartDialog
        open={restartOpen}
        onConfirm={async () => {
          try {
            dispatch({ type: 'kyc_eu/cancelBasicCert' });
            handleBack();
          } catch (err) {
            console.error(err?.msg || err?.message);
          }
        }}
        onCancel={() => setRestartOpen(false)}
      />
      <BindDialog open={bindDialogOpen} onCancel={() => setBindDialogOpen(false)} />
    </main>
  );
};

export default KycHome;

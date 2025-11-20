import { ComplianceDialog } from 'gbiz-next/kyc';
import { useSnackbar, useTheme } from '@kux/mui';
import { useEffect, useMemo, useState } from 'react';
import KycCountryOfIssue from 'src/components/Account/Kyc/KycCountryOfIssue';
import Header from 'src/components/Account/Kyc/KycHome/components/Header';
import Layout from 'src/components/Account/Kyc/KycHome/components/Layout';
import StatusCard from 'src/components/Account/Kyc/KycHome/components/StatusCard';
import FAQ from 'src/components/Account/Kyc/KycHome/site/EU/FAQ';
import { EU_KYC1_BENEFITS } from 'src/constants/kyc/benefits';
import { KYC_CERT_ENUM, KYC_STATUS_ENUM } from 'src/constants/kyc/enums';
import useRegionOptions from 'src/hooks/useRegionOptions';
import { getKycResultV2, postKycCancelV2, postKycCreate } from 'src/services/kyc';
import { _t } from 'src/tools/i18n';
import { push } from '@/utils/router';

export default ({ targetSiteType, targetRegion, siteRegions }) => {
  const theme = useTheme();
  const { message } = useSnackbar();

  const [isRestart, setIsRestart] = useState(false);
  const [regionCode, setRegionCode] = useState(targetRegion);
  const [identityType, setIdentityType] = useState();
  const [complianceType, setComplianceType] = useState();
  const [complianceOpen, setComplianceOpen] = useState(false);
  const [kyc1, setKyc1] = useState({});
  const [loading, setLoading] = useState(false);
  const regionOptions = useRegionOptions(siteRegions, targetSiteType);

  const { name: regionName, icon: regionIcon } = useMemo(() => {
    return siteRegions.find((c) => c.code === regionCode) ?? {};
  }, [siteRegions, regionCode]);

  const pullKyc1 = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const { data } = await getKycResultV2({ type: KYC_CERT_ENUM.EU_BASIC_KYC_MIGRATE });
      setKyc1(data);
    } catch (error) {
      console.error(error);
      message.error(error?.msg || error?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (loading) {
      return;
    }
    try {
      const { data } = await postKycCreate({
        type: KYC_CERT_ENUM.EU_BASIC_KYC_MIGRATE,
        complianceExtraInfo: JSON.stringify({
          region: regionCode,
          identityType,
        }),
      });
      setComplianceType(data.standardAlias);
      setComplianceOpen(true);
    } catch (error) {
      console.error(error);
      message.error(error?.msg || error?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    pullKyc1();
  }, []);

  useEffect(() => {
    if (kyc1.status) {
      if (kyc1.status === KYC_STATUS_ENUM.UNVERIFIED) {
        // 未认证状态自动进入选择国家/证件页面
        // 因为欧洲站不会从主站获得证件类型，需要前端传
        setIsRestart(true);
      } else {
        // 已经在认证的结果会回吐国家和证件
        // 用于重新发起认证，减少重选国家/证件的操作路径
        setRegionCode(kyc1.extraInfo?.region);
        setIdentityType(kyc1.extraInfo?.identityType);
      }
    }
  }, [kyc1]);

  if (isRestart) {
    return (
      <KycCountryOfIssue
        siteType={targetSiteType}
        initData={{ regionCode, identityType }}
        countries={regionOptions}
        canBack={false}
        onSubmit={(values) => {
          setRegionCode(values.regionCode);
          setIdentityType(values.identityType);
          setIsRestart(false);
          if (kyc1.status === KYC_STATUS_ENUM.SUSPEND) {
            // 认证中断的话重置云端状态
            postKycCancelV2({ type: KYC_CERT_ENUM.EU_BASIC_KYC_MIGRATE });
          }
        }}
      />
    );
  }

  return (
    <main>
      <Layout
        top={
          <Header
            regionName={regionName}
            regionIcon={regionIcon}
            backText={_t('e3c1e7f826974000a280')}
            canBack={![KYC_STATUS_ENUM.VERIFYING, KYC_STATUS_ENUM.VERIFIED].includes(kyc1.status)}
            onBack={() => setIsRestart(true)}
          />
        }
        bottomLeft={
          <StatusCard
            {...kyc1}
            loading={loading}
            title={_t('2fd9c0dd3cde4000abb7')}
            collectInfos={[
              _t('8a5769cf4cc54800ae5b'),
              _t('f9b43fd2ffdf4000a6c5'),
              _t('20a114176fde4000a093'),
            ]}
            benefits={EU_KYC1_BENEFITS}
            onVerify={handleVerify}
            completedTitle={_t('4dd093d2c4984800af13')}
            completedDesc={_t('97fe0ca3926e4800a795')}
            completedBtnText={_t('c6686e65cc8b4000a947')}
            onCompleted={() => push('/account/transfer')}
          />
        }
        bottomRight={<FAQ />}
      />
      <ComplianceDialog
        open={complianceOpen}
        onCancel={() => {
          setComplianceOpen(false);
          pullKyc1();
        }}
        theme={theme.currentTheme}
        complianceType={complianceType}
        siteType={targetSiteType}
      />
    </main>
  );
};

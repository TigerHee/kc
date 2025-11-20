import { ComplianceDialog } from '@kucoin-gbiz-next/kyc';
import { useTheme } from '@kux/mui';
import { useEffect, useMemo, useState } from 'react';
import KybCountry from 'src/components/Account/Kyc/KybCountry';
import Header from 'src/components/Account/Kyc/kybHome/components/Header';
import Layout from 'src/components/Account/Kyc/kybHome/components/Layout';
import StatusCard from 'src/components/Account/Kyc/kybHome/components/StatusCard';
import FAQ from 'src/components/Account/Kyc/kybHome/site/EU/FAQ';
import { EU_KYB1_BENEFITS } from 'src/constants/kyc/benefits';
import { KYC_CERT_ENUM, KYC_STATUS_ENUM } from 'src/constants/kyc/enums';
import useKycMiddlePlatform from 'src/hooks/useKycMiddlePlatform';
import useRegionOptions from 'src/hooks/useRegionOptions';
import { _t } from 'src/tools/i18n';
import { push } from 'src/utils/router';

export default ({ targetSiteType, targetRegion, siteRegions }) => {
  const theme = useTheme();
  const [isRestart, setIsRestart] = useState(false);
  const [regionCode, setRegionCode] = useState(targetRegion);
  const [complianceType, setComplianceType] = useState();
  const [complianceOpen, setComplianceOpen] = useState(false);
  const {
    result: kyb1,
    pullResult: pullKyb1,
    start,
    cancel,
    loading,
  } = useKycMiddlePlatform({ type: KYC_CERT_ENUM.EU_BASIC_KYB_MIGRATE });
  const regionOptions = useRegionOptions(siteRegions, targetSiteType);

  const regionName = useMemo(
    () => siteRegions.find((r) => r.code === regionCode)?.name,
    [siteRegions, regionCode],
  );

  useEffect(() => {
    pullKyb1();
  }, []);

  if (isRestart) {
    return (
      <KybCountry
        siteType={targetSiteType}
        initData={{ regionCode }}
        countries={regionOptions}
        onSubmit={(values) => {
          setRegionCode(values.regionCode);
          setIsRestart(false);
          if (kyb1.status === KYC_STATUS_ENUM.SUSPEND) {
            // 认证中断的话重置云端状态
            cancel();
          }
        }}
        canBack={false}
      />
    );
  }
  return (
    <main>
      <Header backText={_t('86f822430d164000a727')} onBack={() => setIsRestart(true)} />
      <Layout gapXL={48} gapSM={24}>
        <Layout.Left>
          <StatusCard
            {...kyb1}
            companyName={kyb1.extraInfo?.companyName}
            regionName={regionName}
            benefits={EU_KYB1_BENEFITS}
            collectInfos={[
              _t('611a7c6e5e034000a79e'),
              _t('daf2ff6dc39c4000ac60'),
              _t('74d7830803e24800a466'),
              _t('c64bcffc0fcf4000aca0'),
            ]}
            loading={loading}
            completedBtnText={_t('c6686e65cc8b4000a947')}
            onCompleted={() => push('/account/transfer')}
            onVerify={async () => {
              try {
                const standardAlias = await start();
                setComplianceType(standardAlias);
                setComplianceOpen(true);
              } catch (error) {
                console.error(error);
              }
            }}
          />
        </Layout.Left>
        <Layout.Right>
          <FAQ />
        </Layout.Right>
      </Layout>

      <ComplianceDialog
        open={complianceOpen}
        onCancel={() => {
          setComplianceOpen(false);
          pullKyb1();
        }}
        theme={theme.currentTheme}
        complianceType={complianceType}
        siteType={targetSiteType}
      />
    </main>
  );
};

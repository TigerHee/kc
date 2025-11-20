import { ComplianceDialog } from 'gbiz-next/kyc';
import { useTheme } from '@kux/mui';
import { bootConfig } from 'kc-next/boot';
import classnames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import Header from 'src/components/Account/Kyc/KybHome/components/Header';
import StatusCard from 'src/components/Account/Kyc/KybHome/components/StatusCard';
import FAQ from 'src/components/Account/Kyc/KybHome/site/EU/FAQ';
import Layout from 'src/components/Account/Kyc/KycHome/components/Layout';
import MultiStatusCard from 'src/components/Account/Kyc/KycHome/components/MultiStatusCard';
import RestartDialog from 'src/components/Account/Kyc/KycHome/components/RestartDialog';
import { EU_KYB1_BENEFITS } from 'src/constants/kyc/benefits';
import { KYC_CERT_ENUM, KYC_STATUS_ENUM, KYC_TYPE } from 'src/constants/kyc/enums';
import useKybCountries from 'src/hooks/useKybCountries';
import useKycCache from 'src/hooks/useKycCache';
import useKycMiddlePlatform from 'src/hooks/useKycMiddlePlatform';
import FollowUp from '@/routers/AccountPage/Kyc/Home/site/EU/components/FollowUp';
import { _t } from 'src/tools/i18n';
import { addLangToPath } from 'tools/i18n';
import { StatusCardWrapper } from './style';
import { push, replace } from '@/utils/router';

export default () => {
  const theme = useTheme();
  const [cache, pullCache, postCache] = useKycCache();
  const [countries, pullCountries] = useKybCountries();
  const [complianceOpen, setComplianceOpen] = useState(false);
  const [complianceType, setComplianceType] = useState('');
  const {
    result: kyb1,
    pullResult: pullKyb1,
    start,
    cancel,
    loading,
  } = useKycMiddlePlatform({ type: KYC_CERT_ENUM.EU_BASIC_KYB });
  const {
    result: kyb2,
    pullResult: pullKyb2,
    loading: loadingKyb2,
  } = useKycMiddlePlatform({
    type: KYC_CERT_ENUM.EU_KYB_PRO_USER,
  });

  const [restartOpen, setRestartOpen] = useState(false);
  const isUnverified = kyb1.status === KYC_STATUS_ENUM.UNVERIFIED;
  const isKyb1Verified = kyb1.status === KYC_STATUS_ENUM.VERIFIED;
  const isKyb2Verified = kyb2.status === KYC_STATUS_ENUM.VERIFIED;

  const regionName = useMemo(() => {
    if (kyb1.status === KYC_STATUS_ENUM.UNVERIFIED) {
      const country = countries.find((c) => c.code === cache.region);
      return country?.name;
    } else {
      return kyb1.extraInfo?.regionName;
    }
  }, [countries, kyb1, cache]);

  useEffect(() => {
    pullKyb1();
    pullCountries();
  }, []);

  useEffect(() => {
    if (isKyb1Verified) {
      pullKyb2();
    }
  }, [isKyb1Verified]);

  const handleBack = async () => {
    if (!restartOpen && !isUnverified) {
      setRestartOpen(true);
      return;
    }
    try {
      if (!isUnverified) {
        await cancel();
      }
      const success = await postCache({ type: KYC_TYPE.INSTITUTIONAL });
      if (success) push('/account/kyb/setup');
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    (async () => {
      if (isUnverified) {
        try {
          const { region, type } = await pullCache();
          if (!region || type !== KYC_TYPE.INSTITUTIONAL) {
            replace('/account/kyc');
          }
        } catch (err) {
          console.error(err?.msg || err?.message);
        }
      }
    })();
  }, [isUnverified]);

  const completedProps = {
    completedBtnText: _t('45813def186c4800aa66'),
    onCompleted: () => push(`/assets/coin/${bootConfig._BASE_CURRENCY_}`),
  };
  const companyName = kyb1.extraInfo?.companyName;

  return (
    <div>
      <Layout
        needTopBorder
        top={
          <Header
            backText={_t('86f822430d164000a727')}
            canBack={[
              KYC_STATUS_ENUM.UNVERIFIED,
              KYC_STATUS_ENUM.SUSPEND,
              KYC_STATUS_ENUM.REJECTED,
            ].includes(kyb1.status)}
            onBack={handleBack}
          />
        }
        bottomLeft={
          isKyb1Verified && isKyb2Verified ? (
            <StatusCard
              {...kyb1}
              {...completedProps}
              companyName={companyName}
              regionName={regionName}
            />
          ) : (
            <StatusCardWrapper>
              <div
                className={classnames({
                  companyName: true,
                  companyNameDisable: !companyName,
                })}
              >
                {companyName || _t('32ab883f8cdd4800a319')}
              </div>
              <div className="regionName">{_t('cb3ada906dbc4800a1c2', { name: regionName })}</div>
              <div className="divider" />
              <MultiStatusCard
                list={[
                  {
                    title: _t('2fd9c0dd3cde4000abb7'),
                    loading: loading,
                    benefits: EU_KYB1_BENEFITS(),
                    collectInfos: [
                      _t('611a7c6e5e034000a79e'),
                      _t('daf2ff6dc39c4000ac60'),
                      _t('74d7830803e24800a466'),
                      _t('c64bcffc0fcf4000aca0'),
                    ],
                    ...completedProps,
                    ...kyb1,
                    onVerify: async () => {
                      try {
                        const standardAlias = await start();
                        if (standardAlias) {
                          setComplianceType(standardAlias);
                          setComplianceOpen(true);
                        }
                      } catch (error) {
                        console.error(error);
                      }
                    },
                  },
                  {
                    title: _t('a687f7068cba4000a864'),
                    loading: loadingKyb2,
                    benefits: [_t('11824d2ebe064000afc3')],
                    collectInfoTitle: _t('2756631306784000afa0'),
                    collectInfos: [
                      _t('c656b631f7044000ad51'),
                      _t('6939e18235f44800a82b'),
                      _t('81c17b8c2e914800a0c7'),
                    ],
                    disabled: !isKyb1Verified,
                    ...kyb2,
                    extraBtn: <FollowUp />,
                    suspendMsg: _t('f11988ae51394800ab46'),
                  },
                ]}
                {...completedProps}
              />
            </StatusCardWrapper>
          )
        }
        bottomRight={<FAQ />}
      />
      <ComplianceDialog
        open={complianceOpen}
        onCancel={() => {
          setComplianceOpen(false);
          pullKyb1();
        }}
        theme={theme.currentTheme}
        complianceType={complianceType}
      />
      <RestartDialog
        open={restartOpen}
        onConfirm={handleBack}
        onCancel={() => setRestartOpen(false)}
      />
    </div>
  );
};

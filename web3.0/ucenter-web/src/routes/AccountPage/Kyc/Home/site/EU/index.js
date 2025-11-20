/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ComplianceDialog } from '@kucoin-gbiz-next/kyc';
import { useTheme } from '@kux/mui';
import { useEffect, useMemo, useRef, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import BindDialog from 'src/components/Account/Kyc/KycHome/components/BindDialog';
import Header from 'src/components/Account/Kyc/KycHome/components/Header';
import Layout from 'src/components/Account/Kyc/KycHome/components/Layout';
import MultiStatusCard from 'src/components/Account/Kyc/KycHome/components/MultiStatusCard';
import RestartDialog from 'src/components/Account/Kyc/KycHome/components/RestartDialog';
import FAQ from 'src/components/Account/Kyc/KycHome/site/EU/FAQ';
import { tenantConfig } from 'src/config/tenant';
import { EU_KYC1_BENEFITS, EU_KYC2_BENEFITS } from 'src/constants/kyc/benefits';
import { KYC_CERT_ENUM, KYC_STATUS_ENUM, KYC_TYPE } from 'src/constants/kyc/enums';
import useKycCache from 'src/hooks/useKycCache';
import useKycMiddlePlatform from 'src/hooks/useKycMiddlePlatform';
import { pullSiteRegions } from 'src/services/kyc';
import { addLangToPath, _t } from 'src/tools/i18n';
import { isTMA } from 'src/utils/tma/bridge';
import { push, replace } from 'utils/router';
import useCompatibleKyc1 from '../../hooks/useCompatibleKyc1';
import FollowUp from './FollowUp';

const KycHome = ({ onBack, emailValidate, phoneValidate, kycInfo }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {
    result: _kyc1,
    pullResult: pullKyc1,
    start: startKyc1,
    cancel: cancelKyc1,
    loading: kyc1Loading,
  } = useKycMiddlePlatform({ type: KYC_CERT_ENUM.EU_BASIC_KYC });
  const {
    result: kyc2,
    pullResult: pullKyc2,
    start: startKyc2,
    loading: kyc2Loading,
  } = useKycMiddlePlatform({ type: KYC_CERT_ENUM.EU_KYC_ADVANCE });
  const {
    result: kyc3,
    pullResult: pullKyc3,
    loading: kyc3Loading,
  } = useKycMiddlePlatform({ type: KYC_CERT_ENUM.EU_KYC_PRO_USER });

  const kyc1 = useCompatibleKyc1(_kyc1);
  const [cache, pullCache, postCache] = useKycCache();
  const [regions, setRegions] = useState([]);
  const [bindDialogOpen, setBindDialogOpen] = useState(false);
  const [complianceOpen, setComplianceOpen] = useState(false);
  const [complianceType, setComplianceType] = useState('');
  const [restartOpen, setRestartOpen] = useState(false);
  const verifyCallbackRef = useRef();

  const regionCode = cache.region || kycInfo?.regionCode;
  const identityType = cache.identityType || kycInfo.identityType;
  const isKyc1Unverified = kyc1.status === KYC_STATUS_ENUM.UNVERIFIED;
  const isKyc1Verified = kyc1.status === KYC_STATUS_ENUM.VERIFIED;
  const isKyc2Verified = kyc2.status === KYC_STATUS_ENUM.VERIFIED;
  // 只要用户不是审核中/已通过，就可以任意提交KYC/KYB
  const isCannotSwitchType = [KYC_STATUS_ENUM.VERIFYING, KYC_STATUS_ENUM.VERIFIED].includes(
    kyc1.status,
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
    if (isKyc1Unverified) {
      handleBack();
    } else {
      setRestartOpen(true);
    }
  };
  const withVerify = (callback) => async () => {
    if (!emailValidate || !phoneValidate) {
      setBindDialogOpen(true);
      return;
    }
    try {
      const standardAlias = await callback();
      if (standardAlias) {
        setComplianceType(standardAlias);
        setComplianceOpen(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { regionName, regionIcon } = useMemo(() => {
    const temp = regions.find((c) => c.code === regionCode);
    return {
      regionName: temp ? temp.name : kycInfo.regionName,
      regionIcon: temp ? temp.icon : kycInfo.regionIcon,
    };
  }, [regions, kycInfo, regionCode]);

  const completedProps = {
    completedBtnText: _t('45813def186c4800aa66'),
    onCompleted: () => push(addLangToPath(`/assets/coin/${window._BASE_CURRENCY_}`)),
  };

  useEffect(() => {
    pullKyc1();
    pullSiteRegions({ siteType: tenantConfig.kyc.siteRegion, kycType: 1 })
      .then(({ data }) => {
        setRegions(data ?? []);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(async () => {
    if (isKyc1Unverified) {
      try {
        const { region, identityType, type } = await pullCache();
        if (!region || !identityType || type !== KYC_TYPE.PERSONAL) {
          replace('/account/kyc');
        }
      } catch (err) {
        console.log(err?.msg || err?.message);
      }
    }
  }, [isKyc1Unverified]);

  useEffect(() => {
    if (isKyc1Verified) {
      pullKyc2();
    }
  }, [isKyc1Verified]);

  useEffect(() => {
    if (isKyc2Verified) {
      pullKyc3();
    }
  }, [isKyc2Verified]);

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
          <MultiStatusCard
            list={[
              {
                title: _t('2fd9c0dd3cde4000abb7'),
                loading: kyc1Loading,
                benefits: EU_KYC1_BENEFITS,
                collectInfos: [
                  _t('8a5769cf4cc54800ae5b'),
                  _t('f9b43fd2ffdf4000a6c5'),
                  _t('20a114176fde4000a093'),
                ],
                ...completedProps,
                ...kyc1,
                onVerify: withVerify(() => {
                  verifyCallbackRef.current = pullKyc1;
                  return startKyc1({
                    region: regionCode,
                    identityType,
                  });
                }),
              },
              {
                title: _t('e5052ccd6d004800a5f8'),
                loading: kyc2Loading,
                benefits: EU_KYC2_BENEFITS,
                collectInfos: [
                  _t('067909c47f104800a58e'),
                  _t('ceb6b4f2faad4800ae0c'),
                  _t('97866a9f6c324800a935'),
                ],
                disabled: !isKyc1Verified,
                ...kyc2,
                onVerify: withVerify(() => {
                  verifyCallbackRef.current = pullKyc2;
                  return startKyc2();
                }),
              },
              {
                title: _t('a687f7068cba4000a864'),
                loading: kyc3Loading,
                benefits: [_t('11824d2ebe064000afc3')],
                collectInfoTitle: _t('2756631306784000afa0'),
                collectInfos: [
                  _t('c656b631f7044000ad51'),
                  _t('6939e18235f44800a82b'),
                  _t('81c17b8c2e914800a0c7'),
                ],
                disabled: !isKyc2Verified,
                ...kyc3,
                extraBtn: <FollowUp />,
                suspendMsg: _t('f11988ae51394800ab46'),
              },
            ]}
            {...completedProps}
          />
        }
        bottomRight={<FAQ />}
      />
      <ComplianceDialog
        open={complianceOpen}
        onCancel={() => {
          setComplianceOpen(false);
          verifyCallbackRef.current?.();
          dispatch({ type: 'kyc/pullKycInfo' });
          verifyCallbackRef.current = null;
        }}
        theme={theme.currentTheme}
        complianceType={complianceType}
      />
      <RestartDialog
        open={restartOpen}
        onConfirm={async () => {
          try {
            await cancelKyc1();
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

export default connect(({ user, kyc }) => {
  const { emailValidate, phoneValidate } = user?.user ?? {};
  const { kycInfo } = kyc ?? {};
  return {
    emailValidate,
    phoneValidate,
    kycInfo,
  };
})(KycHome);

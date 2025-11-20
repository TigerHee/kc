/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ComplianceDialog } from 'gbiz-next/kyc';
import { styled, useSnackbar, useTheme } from '@kux/mui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import KycCountryOfIssue from 'src/components/Account/Kyc/KycCountryOfIssue';
import BasicCertCard from 'src/components/Account/Kyc/KycHome/site/AU/BasicCertCard';
import KycSteps from 'src/components/Account/Kyc/KycHome/site/AU/KycSteps';
import StatusCard from 'src/components/Account/Kyc/KycHome/site/AU/StatusCard';
import { KYC_CERT_ENUM, KYC_STATUS_ENUM } from 'src/constants/kyc/enums';
import useRegionOptions from 'src/hooks/useRegionOptions';
import { getKycResultV2, postKycCancelV2, postKycCreate } from 'src/services/kyc';
import { _t } from 'src/tools/i18n';
import getSource from 'src/utils/getSource';
import { push } from '@/utils/router';

import useResponsiveSSR from '@/hooks/useResponsiveSSR';

const AU_ICON = 'https://assets.staticimg.com/ucenter/flag/au.png';
const AU_CODE = 'AU';
const AU_NAME = _t('australia');

const Container = styled.div`
  .KuxStep-icon {
    display: none;
  }
  .KuxStep-stepContent {
    margin-left: 0 !important;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    .BaseCardWrapper {
      padding: 0;
      border: none;
    }
    .customBasicCard {
      padding-bottom: 16px;
    }
    .kyc_privacy_protect {
      display: none;
    }
  }
`;

export default ({ targetSiteType }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { message } = useSnackbar();
  const rv = useResponsiveSSR();
  // 澳洲站的国家列表不给选其他国家
  // 构建一个只包含澳洲的列表，减少请求
  const regionOptions = useRegionOptions([
    {
      code: AU_CODE,
      name: AU_NAME,
      icon: AU_ICON,
      siteType: 'australia',
      regionType: 3,
    },
  ]);

  const [complianceOpen, setComplianceOpen] = useState(false);
  const [complianceType, setComplianceType] = useState('');
  const [status, setStatus] = useState(KYC_STATUS_ENUM.UNVERIFIED);
  const [failReasonList, setFailReasonList] = useState([]);
  const [identityType, setIdentityType] = useState(undefined);
  const [isRestart, setIsRestart] = useState(false);
  const [loading, setLoading] = useState(false);

  const isCompleted = status === KYC_STATUS_ENUM.VERIFIED;
  const isH5 = !rv?.sm;

  const handlePullResult = useCallback(async () => {
    try {
      const { data } = await getKycResultV2({ type: KYC_CERT_ENUM.AU_BASIC_KYC_MIGRATE });
      setStatus(data.status);
      setFailReasonList(data.failReasonList);
    } catch (error) {
      console.error(error);
      message.error(error?.msg || error?.message);
    }
  }, [message]);
  const handleVerify = useCallback(async () => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      const { data } = await postKycCreate({
        type: KYC_CERT_ENUM.AU_BASIC_KYC_MIGRATE,
        source: getSource(isH5),
        complianceExtraInfo: JSON.stringify({
          region: AU_CODE,
          identityType: identityType,
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
  }, [identityType, loading, message]);
  const handleRestart = useCallback(async () => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      if (status === KYC_STATUS_ENUM.SUSPEND) {
        // 认证中断的需要先重置云端状态
        await postKycCancelV2({ type: KYC_CERT_ENUM.AU_BASIC_KYC_MIGRATE });
      }
      setIsRestart(true);
      handlePullResult();
    } catch (error) {
      console.error(error);
      message.error(error?.msg || error?.message);
    } finally {
      setLoading(false);
    }
  }, [status, loading, message, handlePullResult]);
  const handleSuccess = () => {
    setComplianceOpen(false);
    handlePullResult();
  };

  const steps = useMemo(
    () => [
      {
        icon: 1,
        title: _t('2fd9c0dd3cde4000abb7'),
        status,
        failReasonList,
        description: (
          <BasicCertCard
            className="customBasicCard"
            status={status}
            onVerify={handleVerify}
            onRestart={handleRestart}
          />
        ),
      },
    ],
    [status, failReasonList, handleVerify, handleRestart],
  );

  useEffect(() => {
    handlePullResult();
    dispatch({ type: 'kyc/kycGetCountries' });
  }, []);

  if (isRestart) {
    return (
      <KycCountryOfIssue
        siteType={targetSiteType}
        initData={{ regionCode: AU_CODE, identityType }}
        countries={regionOptions}
        canBack={false}
        regionLock
        onSubmit={(value) => {
          setIdentityType(value.identityType);
          setIsRestart(false);
        }}
      />
    );
  }

  return (
    <Container>
      <StatusCard
        inspectorId="account_kyc_migrate_au"
        regionIcon={AU_ICON}
        regionName={AU_NAME}
        completed={isCompleted}
        completedTitle={_t('da48619fff754000a055')}
        completedBtnText={_t('60316567d0f14800a57c')}
        onCompletedBtnClick={() => push('/account/transfer')}
        back={false}
        slot={isCompleted ? null : <KycSteps current={1} steps={steps} />}
      />
      <ComplianceDialog
        open={complianceOpen}
        onCancel={handleSuccess}
        theme={theme.currentTheme}
        complianceType={complianceType}
        siteType={targetSiteType}
      />
    </Container>
  );
};

/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ComplianceDialog } from '@kucoin-gbiz-next/kyc';
import { useResponsive, useTheme } from '@kux/mui';
import { tenantConfig } from 'config/tenant';
import { useEffect, useMemo, useRef, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import BindDialog from 'src/components/Account/Kyc/KycHome/components/BindDialog';
import RestartDialog from 'src/components/Account/Kyc/KycHome/components/RestartDialog';
import BasicCertCard from 'src/components/Account/Kyc/KycHome/site/AU/BasicCertCard';
import KycSteps from 'src/components/Account/Kyc/KycHome/site/AU/KycSteps';
import RetailCertCard from 'src/components/Account/Kyc/KycHome/site/AU/RetailCertCard';
import StatusCard from 'src/components/Account/Kyc/KycHome/site/AU/StatusCard';
import WholesaleCertCard from 'src/components/Account/Kyc/KycHome/site/AU/WholesaleCertCard';
import { KYC_CERT_ENUM, KYC_ROLE_ENUM, KYC_STATUS_ENUM, KYC_TYPE } from 'src/constants/kyc/enums';
import useKycCache from 'src/hooks/useKycCache';
import { pullSiteRegions } from 'src/services/kyc';
import { addLangToPath, _t } from 'src/tools/i18n';
import getSource from 'src/utils/getSource';
import { isTMA } from 'src/utils/tma/bridge';
import { replace } from 'utils/router';
import useCompatibleKyc1 from '../../hooks/useCompatibleKyc1';
import RoleSelect from './components/RoleSelect';
import { RoleSvg } from './components/RoleSelect/styled';

const KycHome = ({
  onBack,
  emailValidate,
  phoneValidate,
  kycInfo,
  _kyc1,
  kyc2,
  kyc3,
  role,
  regionCode,
  identityType,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { isWholesale = false } = kycInfo ?? {};
  const kyc1 = useCompatibleKyc1(_kyc1);
  const verifyCallbackRef = useRef();
  const rv = useResponsive();
  const isH5 = !rv?.sm;
  const [cache, pullCache, postCache] = useKycCache();

  const [bindDialogOpen, setBindDialogOpen] = useState(false);
  const [complianceOpen, setComplianceOpen] = useState(false);
  const [complianceType, setComplianceType] = useState('');
  const [regions, setRegions] = useState([]);
  const [restartOpen, setRestartOpen] = useState(false);

  const { regionName, regionIcon } = useMemo(() => {
    const temp = regions.find((c) => c.code === regionCode);
    return {
      regionName: temp ? temp.name : kycInfo.regionName,
      regionIcon: temp ? temp.icon : kycInfo.regionIcon,
    };
  }, [regions, kycInfo, regionCode]);

  const isKyc1Unverified = kyc1.status === KYC_STATUS_ENUM.UNVERIFIED;
  const isKyc1Completed = kyc1.status === KYC_STATUS_ENUM.VERIFIED;
  const isKyc3Completed = kyc3.status === KYC_STATUS_ENUM.VERIFIED;
  const kyc3Disabled =
    !isWholesale && role === KYC_ROLE_ENUM.RETAIL && kyc2.status !== KYC_STATUS_ENUM.VERIFIED;
  // 只要用户不是审核中/已通过，就可以任意提交KYC/KYB
  const isCannotSwitchType = [KYC_STATUS_ENUM.VERIFYING, KYC_STATUS_ENUM.VERIFIED].includes(
    kyc1.status,
  );
  /* 有kyc提交记录不显示切换 */
  const hiddenRightSwitch = isCannotSwitchType || isTMA();

  const withSecurity = (callback) => () => {
    if (!emailValidate || !phoneValidate) {
      setBindDialogOpen(true);
      return;
    }
    callback();
  };
  const handleKyc1Verify = withSecurity(async () => {
    try {
      const { standardAlias } = await dispatch({
        type: 'kyc_au/start',
        payload: {
          type: KYC_CERT_ENUM.AU_BASIC_KYC,
          source: getSource(isH5),
          complianceExtraInfo: JSON.stringify({
            region: cache.region ?? kycInfo.regionCode,
            identityType: cache.identityType ?? kycInfo.identityType,
          }),
        },
      });
      if (standardAlias) {
        setComplianceType(standardAlias);
        setComplianceOpen(true);
        verifyCallbackRef.current = () => {
          dispatch({ type: 'kyc_au/getKyc1' });
          dispatch({ type: 'kyc/pullKycInfo' });
        };
      }
    } catch (error) {
      console.error(error);
    }
  });
  const handleKyc2Verify = withSecurity(async () => {
    try {
      const { standardAlias } = await dispatch({
        type: 'kyc_au/start',
        payload: {
          type: KYC_CERT_ENUM.AU_ADVANCE_RETAIL,
          source: getSource(isH5),
        },
      });
      if (standardAlias) {
        setComplianceType(standardAlias);
        setComplianceOpen(true);
        verifyCallbackRef.current = () => {
          dispatch({ type: 'kyc_au/getKyc2' });
        };
      }
    } catch (error) {
      console.error(error);
    }
  });
  const handleKyc3Verify = withSecurity(async () => {
    try {
      const { standardAlias } = await dispatch({
        type: 'kyc_au/start',
        payload: {
          type: KYC_CERT_ENUM.AU_WHOLESALE,
          source: getSource(isH5),
        },
      });
      if (standardAlias) {
        setComplianceType(standardAlias);
        setComplianceOpen(true);
        verifyCallbackRef.current = () => {
          dispatch({ type: 'kyc_au/getKyc3' });
        };
      }
    } catch (error) {
      console.error(error);
    }
  });
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

  const isKyc2Completed = kyc2.status === KYC_STATUS_ENUM.VERIFIED;

  const current = useMemo(() => {
    let current = 0;
    if (isKyc1Completed) {
      current++;
    }
    if (isKyc2Completed || role) {
      current++;
    }
    if (isWholesale) {
      current = 3;
    }
    return current;
  }, [isKyc1Completed, isKyc2Completed, role, isWholesale]);

  useEffect(() => {
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
        console.error(err);
      }
    } else {
      dispatch({ type: 'kyc_au/getKyc1' });
    }
  }, [isKyc1Unverified]);

  useEffect(() => {
    if (isKyc1Completed) {
      if (isWholesale) {
        // 符合一键认证的条件，默认选 kyc3 对应的角色
        dispatch({ type: 'kyc_au/update', payload: { role: KYC_ROLE_ENUM.WHOLESALE } });
        dispatch({ type: 'kyc_au/getKyc3' });
      } else {
        // 完成 kyc1 后再获取缓存的角色和 kyc2 / kyc3 的结果
        dispatch({ type: 'kyc_au/getRole' });
        dispatch({ type: 'kyc_au/getKyc2' });
        dispatch({ type: 'kyc_au/getKyc3' });
      }
    }
  }, [isKyc1Completed, isWholesale]);

  return (
    <>
      <StatusCard
        inspectorId="account_kyc_personal_homepage"
        regionIcon={regionIcon}
        regionName={regionName}
        back={!hiddenRightSwitch}
        onBack={handleRestart}
        completed={isKyc3Completed}
        completedTitle={_t('f0b64d6e316d4000a523')}
        completedBtnText={_t('45813def186c4800aa66')}
        onCompletedBtnClick={() =>
          (window.location.href = addLangToPath(`/assets/coin/${window._BASE_CURRENCY_}`))
        }
        slot={
          !isKyc3Completed ? (
            <KycSteps
              current={current}
              steps={[
                {
                  key: KYC_CERT_ENUM.AU_BASIC_KYC,
                  icon: 1,
                  title: _t('2fd9c0dd3cde4000abb7'),
                  status: kyc1.status,
                  failReasonList: kyc1.failReasonList,
                  description: (
                    <BasicCertCard
                      status={kyc1.status}
                      showRestart={!isH5}
                      onVerify={handleKyc1Verify}
                      onRestart={handleRestart}
                    />
                  ),
                },
                // 未完成 kyc2，展示角色选择器
                // 支持用户选择不同的角色进行高级认证
                !isKyc2Completed
                  ? {
                      key: 'selectRole',
                      title: _t('ebc18c115de64800ac58'),
                      icon: <RoleSvg />,
                      iconWhiten: true,
                      description: (
                        <RoleSelect
                          value={role}
                          disabled={!isKyc1Completed}
                          onChange={(value) => {
                            dispatch({ type: 'kyc_au/setRole', payload: { role: value } });
                          }}
                        />
                      ),
                    }
                  : null,
                // 【完成 kyc2】或【选择了 retail 认证】，展示 kyc2 状态
                isKyc2Completed || role === KYC_ROLE_ENUM.RETAIL
                  ? {
                      key: KYC_CERT_ENUM.AU_ADVANCE_RETAIL,
                      icon: 2,
                      title: _t('e5052ccd6d004800a5f8'),
                      status: kyc2.status,
                      showFailReason: false,
                      canSkip: isWholesale,
                      description: (
                        <RetailCertCard
                          role={role}
                          status={kyc2.status}
                          failReasonList={kyc2.failReasonList}
                          extraInfo={kyc2.extraInfo}
                          isWholesale={isWholesale}
                          onVerify={handleKyc2Verify}
                        />
                      ),
                    }
                  : null,
                // 【完成 kyc2】或【选择了任意高级认证】，展示 kyc3 状态
                isKyc2Completed || [KYC_ROLE_ENUM.RETAIL, KYC_ROLE_ENUM.WHOLESALE].includes(role)
                  ? {
                      key: KYC_CERT_ENUM.AU_WHOLESALE,
                      icon: role === KYC_ROLE_ENUM.RETAIL ? 3 : 2,
                      title: _t('189bfa5d28804800a2f9'),
                      status: kyc3Disabled ? null : kyc3.status,
                      failReasonList: kyc3.failReasonList,
                      block: kyc3Disabled,
                      description: (
                        <WholesaleCertCard
                          role={role}
                          status={kyc3.status}
                          disabled={kyc3Disabled}
                          isWholesale={isWholesale}
                          onVerify={handleKyc3Verify}
                        />
                      ),
                    }
                  : null,
              ]}
            />
          ) : null
        }
      />
      <RestartDialog
        open={restartOpen}
        onConfirm={async () => {
          try {
            dispatch({ type: 'kyc_au/restart' });
            handleBack();
          } catch (err) {
            console.error(err?.msg || err?.message);
          }
        }}
        onCancel={() => setRestartOpen(false)}
      />
      <ComplianceDialog
        open={complianceOpen}
        onCancel={() => {
          setComplianceOpen(false);
          verifyCallbackRef.current?.();
          verifyCallbackRef.current = null;
        }}
        theme={theme.currentTheme}
        complianceType={complianceType}
      />
      <BindDialog open={bindDialogOpen} onCancel={() => setBindDialogOpen(false)} />
    </>
  );
};

export default connect(({ user, kyc, kyc_au }) => {
  const { emailValidate, phoneValidate } = user?.user ?? {};
  const { kycInfo } = kyc ?? {};
  // kyc_au 的 kyc1 - kyc3 是 kyc 中台的数据
  const { kyc1: _kyc1, kyc2, kyc3, role } = kyc_au ?? {};
  return {
    emailValidate,
    phoneValidate,
    kycInfo,
    _kyc1,
    kyc2,
    kyc3,
    role,
  };
})(KycHome);

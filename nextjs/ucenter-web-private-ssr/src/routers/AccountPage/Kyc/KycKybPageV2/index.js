/**
 * Owner: vijay.zhou@kupotech.com
 */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ICAuthenticationOutlined, ICMechanismOutlined } from '@kux/icons';
import { tenantConfig } from 'config/tenant';
import { isEmpty } from 'lodash-es';
import useKybStatus from 'routes/AccountPage/Kyc/hooks/useKybStatus';
import useKyc3Status from 'routes/AccountPage/Kyc/KycHome/site/KC/hooks/useKyc3Status';
import KycKybHome from 'src/components/Account/Kyc/KycKybHome';
import Method from 'src/components/Account/Kyc/KycKybHome/components/Method';
import { PAGE_TYPE, TYPE } from 'src/components/Account/Kyc/KycKybHome/constants';
import { KYC_TYPE } from 'src/constants/kyc/enums';
import useKycCache from 'src/hooks/useKycCache';
import { saTrackForBiz, trackClick } from 'src/utils/ga';
import { Container } from './styled';
import { push, replace } from '@/utils/router';

function KycKybPageV2() {
  const dispatch = useDispatch();
  const { kycInfo = {}, kybInfo = {}, kycRedirect } = useSelector((state) => state.kyc ?? {});
  const { kybRedirect = true } = useSelector((state) => state.kyb ?? {});
  const loading = useSelector((state) => state.loading.effects['kyc/pullKycKybInfo']);
  const [, pullCache] = useKycCache();
  const { kyc3Status, kyc3StatusEnum } = useKyc3Status();
  const { kybStatus, kybStatusEnum } = useKybStatus();

  const isKycUnverified = kycInfo.verifyStatus === -1 && kycInfo.primaryVerifyStatus === 0;
  const isKybUnverified = kybInfo.verifyStatus === -1;
  const isLoaded = !(isEmpty(kycInfo) || (kycInfo.type === 1 && isEmpty(kybInfo)));
  const isGlobalSite = tenantConfig.kyc.siteRegion === 'global';

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    const handleRedirect = async () => {
      if (isGlobalSite) {
        if (kycInfo.type === TYPE.personal && kyc3Status) {
          switch (kyc3Status) {
            case kyc3StatusEnum.VERIFYING:
            case kyc3StatusEnum.FAKE:
            case kyc3StatusEnum.REJECTED:
            case kyc3StatusEnum.VERIFIED:
            case kyc3StatusEnum.CLEARANCE:
            case kyc3StatusEnum.RESET:
              if (kycRedirect) {
                // 开始认证且 type 为个人认证，展示 kyc 落地页
                replace('/account/kyc/home');
              }
              // 消费一次后要重置为 true，避免重复进入没有重定向
              dispatch({ type: 'kyc/update', payload: { kycRedirect: true } });
              break;
          }
        } else if (kycInfo.type === TYPE.institution && kybStatus) {
          switch (kybStatus) {
            case kybStatusEnum.VERIFYING:
            case kybStatusEnum.REJECTED:
            case kybStatusEnum.VERIFIED:
              if (kybRedirect) {
                // 开始认证且 type 为机构认证，展示 kyb 落地页
                replace('/account/kyb/home');
              }
              // 消费一次后要重置为 true，避免重复进入没有重定向
              dispatch({ type: 'kyb/update', payload: { kybRedirect: true } });
              break;
          }
        }
      } else {
        if (!isKycUnverified && kycInfo.type === TYPE.personal) {
          // 开始认证且 type 为个人认证，路由到 kyc 落地页
          replace('/account/kyc/home');
          return;
        }
        if (!isKybUnverified && kycInfo.type === TYPE.institution) {
          // 开始认证且 type 为机构认证，展示 kyb 落地页
          replace('/account/kyb/home');
          return;
        }
        try {
          const { type, region, identityType } = await pullCache();
          if (type === KYC_TYPE.INSTITUTIONAL && region) {
            replace('/account/kyb/home');
            return;
          } else if (type === KYC_TYPE.PERSONAL && region && identityType) {
            replace('/account/kyc/home');
            return;
          }
        } catch (error) {
          console.error(error);
        }
      }
      saTrackForBiz({}, ['ChooseType']);
    };
    handleRedirect();
  }, [
    isLoaded,
    kycInfo.type,
    isKycUnverified,
    isKybUnverified,
    kyc3Status,
    kyc3StatusEnum,
    kybStatus,
    kybStatusEnum,
  ]);

  useEffect(() => {
    dispatch({ type: 'kyc/kycGetCountries' });
    dispatch({ type: 'kyc/pullKycKybInfo' });
  }, []);

  return (
    <Container data-inspector="account_kyc_page">
      <KycKybHome loading={loading}>
        {tenantConfig.kyc.isOnlyKYB ? null : (
          <Method
            data-inspector="account_kyc_personal"
            icon={<ICAuthenticationOutlined />}
            title={PAGE_TYPE.personal.title()}
            description={PAGE_TYPE.personal.description()}
            onClick={() => {
              trackClick(['kyc', '1']);
              push('/account/kyc/setup/country-of-issue');
            }}
          />
        )}
        <Method
          data-inspector="account_kyc_institution"
          icon={<ICMechanismOutlined />}
          title={PAGE_TYPE.institution.title()}
          description={PAGE_TYPE.institution.description()}
          onClick={() => {
            trackClick(['kyb', '1']);
            push('/account/kyb/setup');
          }}
        />
      </KycKybHome>
    </Container>
  );
}

export default KycKybPageV2;

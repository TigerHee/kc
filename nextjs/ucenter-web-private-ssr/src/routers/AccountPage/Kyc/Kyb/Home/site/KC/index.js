/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Spin, styled } from '@kux/mui';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Back from 'src/components/Account/Kyc/common/components/Back';
import { PAGE_TYPE } from 'src/components/Account/Kyc/KycKybHome/constants';
import { kcsensorsManualExpose, saTrackForBiz, trackClick } from 'utils/ga';
import { KYB_CERT_TYPES, TOTAL_FIELDS } from '../../../../config';
import useKybStatus from '../../../../hooks/useKybStatus';
import FAQ from '../../components/FAQ';
import MaterialListDialog from '../../components/MaterialListDialog';
import MoreBenefits from '../../components/MoreBenefits';
import { Header, Layout, LayoutLeft, LayoutRight } from '../../components/styled';
import KybStatusCard from './components/KybStatusCard';
import { push } from '@/utils/router';

const Container = styled.div`
  margin-bottom: 90px;
`;
const ExSpin = styled(Spin)`
  width: 100%;
`;

const KybHome = () => {
  const loading = useSelector((s) => s.loading);
  const { companyDetail, showMaterialList } = useSelector((state) => state.kyb ?? {});
  const { companyType, verifyFailReason } = companyDetail ?? {};
  const { kybStatus, kybStatusEnum } = useKybStatus();
  const financeListKYB = useSelector((s) => s.kyc.financeListKYB);
  const dispatch = useDispatch();

  useEffect(() => {
    saTrackForBiz({}, ['KYB', '']);
  }, []);

  useEffect(() => {
    dispatch({ type: 'kyc/getKYC3RewardInfo' });
    dispatch({ type: 'kyc/getKybCountries' });
    dispatch({ type: 'kyb/pullCompanyDetail' });
  }, []);

  useEffect(() => {
    if (kybStatus && kybStatus !== kybStatusEnum.UNVERIFIED) {
      dispatch({
        type: 'kyc/pullFinanceList',
        payload: {
          kycType: 'KYB',
        },
      });
    }
  }, [kybStatus, kybStatusEnum, dispatch]);

  useEffect(() => {
    if (kybStatus) {
      kcsensorsManualExpose(['verifyPage', '1'], {
        status: kybStatus,
      });
    }
  }, [kybStatus]);

  const isPageLoading = useMemo(() => {
    return !kybStatus || loading.effects['kyc/pullFinanceList'];
  }, [kybStatus, loading.effects]);

  return (
    <Container data-inspector="account_kyc_institution_homepage">
      {
        // 未认证和认证失败才有返回
        [kybStatusEnum.UNVERIFIED, kybStatusEnum.REJECTED].includes(kybStatus) ? (
          <Back
            onClick={() =>
              push(`/account/kyb/setup?kybType=${companyDetail?.kybType || KYB_CERT_TYPES.COMMON}`)
            }
          />
        ) : null
      }
      <Header>{PAGE_TYPE.institution.title()}</Header>
      <Layout>
        <LayoutLeft>
          <ExSpin spinning={Boolean(isPageLoading)} size="xsmall">
            <KybStatusCard
              goVerify={() => {
                if (
                  !companyType ||
                  (kybStatus === kybStatusEnum.REJECTED &&
                    verifyFailReason[TOTAL_FIELDS.companyType])
                ) {
                  // 没有机构类型为老数据，需要引导去选择机构类型
                  // 机构类型被驳回，也需要重新选择机构类型
                  push(
                    `/account/kyb/setup?kybType=${companyDetail?.kybType || KYB_CERT_TYPES.COMMON}`,
                  );
                  return;
                }
                trackClick(['goVerify']);
                push(
                  `/account/kyb/certification?pageFromHome=1&kybType=${
                    companyDetail?.kybType || KYB_CERT_TYPES.COMMON
                  }`,
                );
              }}
            />
          </ExSpin>
          {financeListKYB?.length > 0 ? null : <MoreBenefits />}
        </LayoutLeft>
        <LayoutRight>
          <FAQ />
        </LayoutRight>
      </Layout>
      <MaterialListDialog
        open={showMaterialList}
        companyType={companyType}
        onClose={() => {
          dispatch({ type: 'kyb/update', payload: { showMaterialList: false } });
        }}
      />
    </Container>
  );
};

export default KybHome;

/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Spin } from '@kux/mui';
import { isEmpty } from 'lodash-es';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { _t } from 'tools/i18n';
import {
  KYC3Wrapper,
  MainLayout,
  MainLeftBox,
  MainRightBox,
  TopLayout,
  TopLeftBox,
  TopLeftTitle,
} from '../../components/commonUIs';
import FAQ from '../../components/FAQ';
import AccountLimits from './components/AccountLimits';
import AdvanceStatusCard from './components/AdvanceStatusCard';
import KycStatusCard from './components/KycStatusCard';

export default function KycHome() {
  const kycInfo = useSelector((state) => state.kyc_th?.kycInfo);

  // 没有kyc信息
  const { isLogin } = useSelector((state) => state.user);
  const isKycInfoEmpty = useMemo(() => isEmpty(kycInfo), [kycInfo]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'kyc_th/resetValues' });
    if (isLogin) {
      // 获取 kyc/kyb 状态
      dispatch({ type: 'kyc_th/pullKycInfo' });
      // 获取advance状态
      dispatch({ type: 'kyc_th/pullAdvanceList' });
      // 获取权益
      dispatch({ type: 'kyc_th/getPrivileges' });
    }
  }, [isLogin]);

  return (
    <Spin spinning={isLogin && isKycInfoEmpty} size="small">
      <KYC3Wrapper id="kyc">
        <TopLayout>
          <TopLeftBox>
            <TopLeftTitle>
              {kycInfo?.kycType === 'KYB' ? _t('77ee62c015894000a675') : _t('4f8a760d078f4800aecf')}
            </TopLeftTitle>
          </TopLeftBox>
        </TopLayout>

        <MainLayout>
          <MainLeftBox>
            <KycStatusCard />
            <AdvanceStatusCard />
            <AccountLimits />
          </MainLeftBox>
          <MainRightBox>
            <FAQ />
          </MainRightBox>
        </MainLayout>
      </KYC3Wrapper>
    </Spin>
  );
}

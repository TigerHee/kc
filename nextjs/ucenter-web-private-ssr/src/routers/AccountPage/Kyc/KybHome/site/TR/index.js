/**
 * Owner: tiger@kupotech.com
 * kyb首页
 */
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { _t } from 'tools/i18n';
import { saTrackForBiz } from 'utils/ga';
import {
  MainLayout,
  MainLeftBox,
  MainRightBox,
  TopLayout,
  TopLeftBox,
  TopLeftTitle,
  Wrapper,
} from '../../CommonUIs';
import FAQ from '../../FAQ';
import KybStatusCard from './KybStatusCard';

const KYB = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    saTrackForBiz({}, ['KYB', '']);
  }, []);

  // 获取kyc福利信息
  useEffect(() => {
    dispatch({ type: 'kyc/getKYC3RewardInfo' });
  }, []);

  useEffect(() => {
    dispatch({ type: 'kyc/pullKybPrivileges' });
  }, []);

  return (
    <Wrapper id="kyb">
      <TopLayout>
        <TopLeftBox>
          <TopLeftTitle>{_t('kyc.certification.mechanism')}</TopLeftTitle>
        </TopLeftBox>
      </TopLayout>

      <MainLayout>
        <MainLeftBox>
          {/* 状态卡片 */}
          <KybStatusCard />
        </MainLeftBox>

        <MainRightBox>
          <FAQ />
        </MainRightBox>
      </MainLayout>
    </Wrapper>
  );
};

export default KYB;

/**
 * Owner: tiger@kupotech.com
 * kyb首页
 */
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { _t } from 'tools/i18n';
import { saTrackForBiz } from 'utils/ga';
import useKybStatus from '../../../hooks/useKybStatus';
import AccountLimits from '../../AccountLimits';
import {
  ArrowIcon,
  KYBDesc,
  KYBIcon,
  MainLayout,
  MainLeftBox,
  MainRightBox,
  TopLayout,
  TopLeftBox,
  TopLeftTitle,
  TopRightBox,
  Wrapper,
} from '../../CommonUIs';
import FAQ from '../../FAQ';
import KybStatusCard from './KybStatusCard';

const KYB = ({ triggerType }) => {
  const { kybStatus, kybStatusEnum } = useKybStatus();
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
        {/* 有kyb提交记录不显示切换 */}
        {[kybStatusEnum.VERIFYING, kybStatusEnum.VERIFIED].includes(kybStatus) ? null : (
          <TopRightBox onClick={triggerType}>
            <KYBIcon />
            <KYBDesc>{_t('kyc.certification.personal.change')}</KYBDesc>
            <ArrowIcon />
          </TopRightBox>
        )}
      </TopLayout>

      <MainLayout>
        <MainLeftBox>
          {/* 状态卡片 */}
          <KybStatusCard />
          {/* 权益 */}
          <AccountLimits />
        </MainLeftBox>

        <MainRightBox>
          <FAQ />
        </MainRightBox>
      </MainLayout>
    </Wrapper>
  );
};

export default KYB;

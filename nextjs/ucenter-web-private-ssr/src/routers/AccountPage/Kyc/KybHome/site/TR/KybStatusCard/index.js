/**
 * Owner: tiger@kupotech.com
 */
import { Spin, styled } from '@kux/mui';
import BaseCard from 'components/Account/Kyc3/Home/KycStatusCard/components/Card';
import useKybStatus from 'src/routers/AccountPage/Kyc/hooks/useKybStatus';
import { addLangToPath, _t } from 'tools/i18n';
import Rejected from './Rejected';
import Unverified from './Unverified';
import Verified from './Verified';
import Verifying from './Verifying';

const KycStatusCardWrapper = styled.div`
  margin-bottom: 28px;
`;

const LoadingBox = styled(BaseCard)`
  & > div:nth-of-type(1) {
    display: flex;
    justify-content: center;
    padding: 72px 0;
    ${({ theme }) => theme.breakpoints.down('sm')} {
      padding: 121px 0;
    }
  }
`;

// kyb首页认证状态卡片
const KycStatusCard = () => {
  const { kybStatus, kybStatusEnum } = useKybStatus();

  const desc = [
    _t('2b69164b61a64000a528', { href: addLangToPath('/download') }),
    _t('c8567862dd934000a856', { email: 'institutional_ka@kucointurkiye.com' }),
  ];

  return (
    <KycStatusCardWrapper>
      {kybStatus === null ? <LoadingBox leftSlot={<Spin spinning size="small" />} /> : null}

      {/* 未认证 */}
      {kybStatus === kybStatusEnum.UNVERIFIED ? <Unverified desc={desc} /> : null}

      {/* 认证中 */}
      {kybStatus === kybStatusEnum.VERIFYING ? <Verifying desc={desc} /> : null}

      {/* 认证通过 */}
      {kybStatus === kybStatusEnum.VERIFIED ? <Verified /> : null}

      {/* 认证失败 */}
      {kybStatus === kybStatusEnum.REJECTED ? <Rejected desc={desc} /> : null}
    </KycStatusCardWrapper>
  );
};

export default KycStatusCard;

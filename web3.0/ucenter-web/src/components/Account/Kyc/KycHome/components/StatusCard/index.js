/**
 * Owner: vijay@kupotech.com
 * 品牌升级的 KYC 状态卡
 * 目前只用在欧洲站，未来也要应用到主站和澳洲站
 * 主站和澳洲站的 ui 组件应废弃，以这个为最新设计为准
 */
import { useTheme } from '@kux/mui';
import { KYC_STATUS_ENUM } from 'src/constants/kyc/enums';
import CertContent from '../CertContent';
import CertTitle from '../CertTitle';
import UnlockBenefits from '../UnlockBenefits';
import { Wrapper } from './components/styled';
import Rejected from './Rejected';
import Verified from './Verified';

const InnerStatusCard = ({
  loading,
  disabled,
  status,
  failReasonList,
  title,
  benefits,
  collectInfos,
  onVerify,
  completedTitle,
  completedDesc,
  completedBtnText,
  onCompleted,
}) => {
  const theme = useTheme();
  const isDark = theme.currentTheme === 'dark';

  switch (status) {
    case KYC_STATUS_ENUM.UNVERIFIED:
    case KYC_STATUS_ENUM.SUSPEND:
    case KYC_STATUS_ENUM.VERIFYING:
      return (
        <>
          <CertTitle status={status} title={title} failReasonList={failReasonList} />
          <CertContent
            status={status}
            benefits={benefits}
            collectInfos={collectInfos}
            disabled={disabled}
            loading={loading}
            completedBtnText={completedBtnText}
            onCompleted={onCompleted}
            onVerify={onVerify}
          />
        </>
      );
    case KYC_STATUS_ENUM.VERIFIED:
      return (
        <>
          <Verified
            isDark={isDark}
            title={completedTitle}
            desc={completedDesc}
            btnText={completedBtnText}
            onClick={onCompleted}
          />
          <UnlockBenefits list={benefits} />
        </>
      );
    case KYC_STATUS_ENUM.REJECTED:
      return (
        <>
          <Rejected
            isDark={isDark}
            loading={loading}
            failReasons={failReasonList}
            onVerify={onVerify}
          />
          <UnlockBenefits list={benefits} />
        </>
      );
    default:
      return null;
  }
};

export default (props) => {
  return (
    <Wrapper>
      <InnerStatusCard {...props} />
    </Wrapper>
  );
};

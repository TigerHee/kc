/**
 * Owner: willen@kupotech.com
 */
import { styled } from '@kux/mui';
import BaseDescription from 'components/Account/Kyc3/Home/KycStatusCard/components/Description';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { _t } from 'tools/i18n';

const WelfareDesc = styled(BaseDescription)`
  margin-top: 4px;
  word-break: break-all;
`;

const KycWelfare = ({ fake }) => {
  const rewardInfo = useSelector((s) => s.kyc.rewardInfo);
  const rewardMessage = useMemo(() => {
    // 有福利信息数据且不是假失败状态才展示
    if (['KYC', 'OLD_KYC'].includes(rewardInfo?.taskType) && rewardInfo?.taskSubTitle && !fake) {
      return rewardInfo.taskSubTitle;
    }
    return _t('kyc_homepage_describe2_unverified');
  }, [rewardInfo, fake]);

  return <WelfareDesc>{rewardMessage}</WelfareDesc>;
};

export default KycWelfare;

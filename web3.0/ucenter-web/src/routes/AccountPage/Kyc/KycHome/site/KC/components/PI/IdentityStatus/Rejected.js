/**
 * Owner: tiger@kupotech.com
 */
import { Tooltip } from '@kux/mui';
import IdentityIPFlow from 'components/Account/Kyc/common/IdentityIPFlow';
import VerifyButton from 'components/Account/Kyc3/Home/KycStatusCard/modules/VerifyButton';
import { searchToJson, showDateTimeByZone } from 'helper';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import FailureReason from 'src/components/Account/Kyc/KycHome/FailureReason';
import { _t, _tHTML } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import {
  PIFlowDesc,
  PIFlowErrorWrapper,
  PIFlowWrapper,
  RejectedAlert,
  RejectedButtonBox,
  StepDesc,
} from '../style';

const { soure } = searchToJson();

export default ({ sensorStatus, onClickVerify, kyc3Status, kyc3StatusEnum }) => {
  const kycInfo = useSelector((s) => s.kyc.kycInfo);
  const kycClearInfo = useSelector((s) => s.kyc?.kycClearInfo);

  const isClearance = useMemo(() => {
    return [kyc3StatusEnum.CLEARANCE, kyc3StatusEnum.RESET].includes(kyc3Status);
  }, [kyc3Status, kyc3StatusEnum]);

  // 失败原因
  const reasonLists = useMemo(() => {
    if (isClearance) {
      return [
        kycClearInfo.msg.replace(
          /\{t}/g,
          kycClearInfo?.clearAt
            ? showDateTimeByZone(kycClearInfo?.clearAt, 'YYYY/MM/DD HH:mm:ss', 0)
            : '--',
        ),
      ];
    }
    return kycInfo?.failureReasonLists;
  }, [kycInfo?.failureReasonLists, isClearance, kycClearInfo]);

  // Alert 文案
  const alertText = useMemo(() => {
    if (isClearance) {
      return kycClearInfo.topMsg;
    }
    return _tHTML('4uVfEqapQ5qKnUKYm5176L');
  }, [isClearance, kycClearInfo]);

  return (
    <>
      <StepDesc>{_t('5a1ff894e2854000a49c')}</StepDesc>
      <PIFlowWrapper>
        <PIFlowDesc>{_t('a251c2923cb54000a15c')}</PIFlowDesc>
        <IdentityIPFlow />
        <PIFlowErrorWrapper>
          <Tooltip
            onOpen={() => {
              trackClick(['FailReason', '1'], {
                soure: soure || '',
                kyc_homepage_status: sensorStatus,
              });
            }}
            title={<FailureReason failureReasonLists={reasonLists} />}
          >
            <div className="inlineFlex">
              <RejectedAlert type="error">{alertText}</RejectedAlert>
            </div>
          </Tooltip>
          <RejectedButtonBox>
            <VerifyButton onClick={onClickVerify}>{_t('mwdwXUvagzZaLxv8oYUZLr')}</VerifyButton>
          </RejectedButtonBox>
        </PIFlowErrorWrapper>
      </PIFlowWrapper>
    </>
  );
};

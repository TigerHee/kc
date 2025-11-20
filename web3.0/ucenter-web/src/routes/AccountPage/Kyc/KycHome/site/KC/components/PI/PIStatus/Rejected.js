/**
 * Owner: tiger@kupotech.com
 */
import { Tooltip } from '@kux/mui';
import IdentityIPFlow from 'components/Account/Kyc/common/IdentityIPFlow';
import VerifyButton from 'components/Account/Kyc3/Home/KycStatusCard/modules/VerifyButton';
import { isEmpty } from 'lodash';
import { useMemo } from 'react';
import FailureReason from 'src/components/Account/Kyc/KycHome/FailureReason';
import { _t, _tHTML } from 'tools/i18n';
import {
  PIFlowDesc,
  PIFlowErrorWrapper,
  PIFlowWrapper,
  RejectedAlert,
  RejectedButtonBox,
  StepDesc,
} from '../style';

export default ({ onPIVerify, failureReasonLists }) => {
  const reasonLists = useMemo(() => {
    if (isEmpty) {
      return [_t('04447de4a56f4000a7d2')];
    }
    return failureReasonLists;
  }, [failureReasonLists]);

  return (
    <>
      <StepDesc>{_t('f4ad443067954000a54a')}</StepDesc>
      <PIFlowWrapper>
        <PIFlowDesc>{_t('a251c2923cb54000a15c')}</PIFlowDesc>
        <IdentityIPFlow type="PI" />
        <PIFlowErrorWrapper>
          <Tooltip
            onOpen={() => {
              // trackClick(['FailReason', '1'], {
              //   soure: soure || '',
              //   kyc_homepage_status: sensorStatus,
              // });
            }}
            title={<FailureReason failureReasonLists={reasonLists} />}
          >
            <div className="inlineFlex">
              <RejectedAlert type="error">{_tHTML('4uVfEqapQ5qKnUKYm5176L')}</RejectedAlert>
            </div>
          </Tooltip>
          <RejectedButtonBox>
            <VerifyButton onClick={onPIVerify}>{_t('mwdwXUvagzZaLxv8oYUZLr')}</VerifyButton>
          </RejectedButtonBox>
        </PIFlowErrorWrapper>
      </PIFlowWrapper>
    </>
  );
};

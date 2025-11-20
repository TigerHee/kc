/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Steps, styled } from '@kux/mui';
import BaseCard from 'components/Account/Kyc3/Home/KycStatusCard/components/Card';
import BaseDescription from 'components/Account/Kyc3/Home/KycStatusCard/components/Description';
import BaseTitle from 'components/Account/Kyc3/Home/KycStatusCard/components/Title';
import TRVerifyInfo from 'components/Account/Kyc3/Home/KycStatusCard/components/TRVerifyInfo';
import { _t } from 'tools/i18n';
import RejectedWrapper from '../../../../components/RejectedWrapper';

const { Step } = Steps;

const Divider = styled.div`
  width: 100%;
  height: 28px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    height: 16px;
  }
`;

const ExSteps = styled(Steps)`
  .KuxStep-stepContent {
    flex: 1;
  }
`;

const RejectedTR = ({ reason, rightImg, verifyButton }) => {
  return (
    <BaseCard
      leftSlot={
        <>
          <BaseTitle>{_t('kyc_homepage_subtitle')}</BaseTitle>
          <BaseDescription>{_t('kyc_homepage_describe_unverified')}</BaseDescription>
        </>
      }
      rightSlot={rightImg}
      bottomSlot={
        <ExSteps direction="vertical" current={0} labelPlacement="vertical">
          <Step
            title={_t('identity.verify')}
            description={
              <TRVerifyInfo>
                <Divider />
                {reason}
                {verifyButton}
              </TRVerifyInfo>
            }
          />
          <Step
            title={_t('f7ac319f9c354000ac2a')}
            description={<BaseDescription>{_t('0999ab132c2b4000a8e0')}</BaseDescription>}
          />
        </ExSteps>
      }
    />
  );
};

export default RejectedWrapper(RejectedTR);

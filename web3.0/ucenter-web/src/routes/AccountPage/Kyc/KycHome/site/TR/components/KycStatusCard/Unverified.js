/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Steps, styled } from '@kux/mui';
import BindDialog from 'components/Account/Kyc3/Home/BindDialog';
import BaseCard from 'components/Account/Kyc3/Home/KycStatusCard/components/Card';
import BaseDescription from 'components/Account/Kyc3/Home/KycStatusCard/components/Description';
import BaseTitle from 'components/Account/Kyc3/Home/KycStatusCard/components/Title';
import TRVerifyInfo from 'components/Account/Kyc3/Home/KycStatusCard/components/TRVerifyInfo';
import VerifyButton from 'components/Account/Kyc3/Home/KycStatusCard/modules/VerifyButton';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { _t } from 'tools/i18n';
import UnverifiedWrapper from '../../../../components/UnverifiedWrapper';

const { Step } = Steps;

const ExSteps = styled(Steps)`
  .KuxStep-stepContent {
    flex: 1;
  }
`;

const ButtonBox = styled.div`
  margin-top: 28px;
`;

const UnverifiedTR = ({ handleClickVerify, rightImg }) => {
  const { email, phone } = useSelector((state) => state.user?.user ?? {});
  const [preAuthShow, setPreAuthShow] = useState(false);
  const handleClickVerifyV2 = useCallback(() => {
    if (!email || !phone) {
      return setPreAuthShow(true);
    }
    handleClickVerify();
  }, [handleClickVerify, email, phone]);

  return (
    <>
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
                  <ButtonBox>
                    <VerifyButton onClick={handleClickVerifyV2}>
                      {_t('ujZc9hLkSmYHhQy4CQHo6u')}
                    </VerifyButton>
                  </ButtonBox>
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
      <BindDialog open={preAuthShow} onCancel={() => setPreAuthShow(false)} />
    </>
  );
};

export default UnverifiedWrapper(UnverifiedTR);

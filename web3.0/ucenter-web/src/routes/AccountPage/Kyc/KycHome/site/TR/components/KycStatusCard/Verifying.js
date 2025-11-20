/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ICCopyOutlined, ICSuccessOutlined } from '@kux/icons';
import { Steps, styled, Tag, useSnackbar } from '@kux/mui';
import BaseAlert from 'components/Account/Kyc3/Home/KycStatusCard/components/Alert';
import BaseCard from 'components/Account/Kyc3/Home/KycStatusCard/components/Card';
import BaseDescription from 'components/Account/Kyc3/Home/KycStatusCard/components/Description';
import BaseTitle from 'components/Account/Kyc3/Home/KycStatusCard/components/Title';
import TRVerifyInfo from 'components/Account/Kyc3/Home/KycStatusCard/components/TRVerifyInfo';
import KycWelfare from 'components/Account/Kyc3/Home/KycStatusCard/modules/KycWelfare';
import { useEffect, useMemo, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useSelector } from 'react-redux';
import { getDepositAccount } from 'src/services/kyc';
import { _t } from 'tools/i18n';
import VerifyingWrapper from '../../../../components/VerifyingWrapper';

const { Step } = Steps;

const ExSteps = styled(Steps)`
  .KuxStep-stepContent {
    flex: 1;
  }
`;

const ExBaseAlert = styled(BaseAlert)`
  margin-top: 28px;
`;

const ExStepTitle = styled.div`
  display: flex;
  align-items: center;
`;

const ExTag = styled(Tag)`
  font-size: 14px;
  margin-left: 8px;
  & > [class$='_svg__icon'] {
    margin-right: 4px;
  }
`;

const DepositBox = styled.div`
  background-color: ${({ theme }) => theme.colors.cover2};
  padding: 24px;
  border-radius: 16px;
  margin-top: 16px;
`;

const DepositItemLabel = styled.div`
  color: ${({ theme }) => theme.colors.text60};
  font-size: 14px;
  line-height: 18px;
`;

const DepositItemContent = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  line-height: 21px;
  margin-top: 8px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
`;

const CopyIcon = styled(ICCopyOutlined)`
  color: ${({ theme }) => theme.colors.icon};
  margin-left: 8px;
  cursor: pointer;
`;

const DepositItem = ({ label, content }) => {
  const { message } = useSnackbar();
  return (
    <>
      <DepositItemLabel>{label}</DepositItemLabel>
      <DepositItemContent>
        {content}
        <CopyToClipboard
          text={content}
          onCopy={() => {
            message.success(_t('copy.succeed'));
          }}
        >
          <CopyIcon size={16} />
        </CopyToClipboard>
      </DepositItemContent>
    </>
  );
};

const DepositDescription = styled.div`
  color: ${({ theme }) => theme.colors.text40};
  font-size: 14px;
  line-height: 18px;
  margin-top: 20px;
`;

const VerifyingTR = ({ fake, alertMsg, rightImg }) => {
  const { message } = useSnackbar();
  const kycInfo = useSelector((state) => state.kyc.kycInfo ?? {});
  const kycIsVerified = useMemo(() => kycInfo.kycVerifyStatus === 1, [kycInfo]);
  const [bankDetail, setBankDetail] = useState([]);

  useEffect(() => {
    if (kycIsVerified && !kycInfo.deposited) {
      getDepositAccount()
        .then(({ data }) => {
          setBankDetail(data?.bankDetail?.sort((a, b) => b.sort - a.sort) ?? []);
        })
        .catch((err) => {
          message.error(err.msg);
        });
    }
  }, [kycIsVerified, kycInfo.deposited]);
  return (
    <BaseCard
      leftSlot={
        <>
          <BaseTitle>{_t('kyc_homepage_subtitle')}</BaseTitle>
          <BaseDescription>{_t('kyc_homepage_describe_unverified')}</BaseDescription>
          <KycWelfare fake={fake} />
        </>
      }
      rightSlot={rightImg}
      bottomSlot={
        <ExSteps direction="vertical" current={0} labelPlacement="vertical">
          <Step
            title={
              <ExStepTitle>
                {_t('identity.verify')}
                {kycIsVerified ? (
                  <ExTag color="primary">
                    <ICSuccessOutlined />
                    {_t('verified')}
                  </ExTag>
                ) : null}
              </ExStepTitle>
            }
            description={
              <TRVerifyInfo>
                {kycIsVerified ? null : <ExBaseAlert>{alertMsg}</ExBaseAlert>}
              </TRVerifyInfo>
            }
          />
          <Step
            title={_t('f7ac319f9c354000ac2a')}
            description={
              kycIsVerified ? (
                <>
                  <BaseDescription>{_t('84b31bbb07714000adc0')}</BaseDescription>
                  <DepositBox>
                    {bankDetail.map(({ title, value }) => (
                      <DepositItem label={title} content={value} />
                    ))}
                    <DepositDescription>{_t('545072ef91844000a4c7')}</DepositDescription>
                  </DepositBox>
                </>
              ) : (
                <BaseDescription>{_t('0999ab132c2b4000a8e0')}</BaseDescription>
              )
            }
          />
        </ExSteps>
      }
    />
  );
};

export default VerifyingWrapper(VerifyingTR);

/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ICArrowRight2Outlined, ICFailOutlined, ICWarningOutlined } from '@kux/icons';
import { Button as OriginButton, Dialog, styled } from '@kux/mui';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { TOTAL_FIELD_INFOS } from 'src/routes/AccountPage/Kyc/config';
import { _t, _tHTML } from 'src/tools/i18n';
import { trackClick } from 'utils/ga';
import { Warning } from '../../../../components/styled';
import VerificationRequirements from '../../../../components/VerificationRequirements';

const FailReason = styled(Warning)`
  color: ${({ theme }) => theme.colors.secondary};
  > span > span {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const ExDialog = styled(Dialog)`
  .KuxDialog-body {
    max-height: 700px;
  }
`;

const Button = styled(OriginButton)`
  display: flex;
  min-width: 240px;
  height: 48px;
  padding: 15px 32px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  font-weight: 600;
  line-height: 130%;
  margin-top: 28px;
`;

const RejectionDetail = styled.div`
  padding-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  & + & {
    padding-top: 16px;
    border-top: 1px solid ${({ theme }) => theme.colors.cover8};
  }
`;
const RejectionDetailTitle = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 500;
  line-height: 130%;
`;
const RejectionDetailContent = styled.div`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 12px;
  font-weight: 400;
  line-height: 150%;
`;
const SupplementContainer = styled.div`
  display: flex;
  padding: 16px 24px;
  flex-direction: column;
  gap: 12px;
  margin-top: 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.cover8};
`;
const SupplementTitle = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 600;
  line-height: 130%;
`;
const SupplementItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  > span {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
    font-size: 14px;
    line-height: 130%;
  }
  > span:nth-child(even) {
    color: ${({ theme }) => theme.colors.text40};
    font-weight: 400;
    font-size: 12px;
    line-height: 150%;
  }
`;

const Rejected = ({ desc, goVerify }) => {
  const [showFailReason, setShowFailReason] = useState(false);
  const failReasonRef = useRef();
  const {
    companyType,
    additionOperatorAttachment,
    additionOperatorAttachmentList,
    verifyFailReason = {},
  } = useSelector((state) => state.kyb?.companyDetail ?? {});
  const kycCode = useSelector((state) => state.kyc?.kycCode);

  const handleCheckReason = (e) => {
    if (e.target === failReasonRef.current?.querySelector('span>span')) {
      setShowFailReason(true);
    }
  };

  const handleVerify = () => {
    trackClick(['verifyPage', 'tryAgain']);
    goVerify();
  };

  const shouldSupplement = additionOperatorAttachment && !Object.keys(verifyFailReason).length;

  return (
    <>
      <VerificationRequirements desc={desc}>
        {shouldSupplement ? (
          <>
            <Warning>
              <ICWarningOutlined size={20} />
              <span>{_t('fc52dc2a4de44000ac90')}</span>
            </Warning>
            <SupplementContainer>
              <SupplementTitle>{_t('ec7ff5ca74874000ad75')}</SupplementTitle>
              {additionOperatorAttachmentList?.map((key) => {
                const fieldInfo = TOTAL_FIELD_INFOS[key];
                return fieldInfo ? (
                  <SupplementItem key={key}>
                    <span>{fieldInfo?.title?.({ companyType })}</span>
                    <span>{fieldInfo?.description?.({ companyType, kycCode })}</span>
                  </SupplementItem>
                ) : null;
              })}
            </SupplementContainer>
          </>
        ) : (
          <FailReason
            ref={failReasonRef}
            data-testid="checkFailReasons"
            onClick={handleCheckReason}
          >
            <ICFailOutlined size={20} />
            {_tHTML('3591742e40f44000a6fb')}
          </FailReason>
        )}
        <Button onClick={handleVerify}>
          {shouldSupplement ? _t('d17da2f208c14000ab73') : _t('mwdwXUvagzZaLxv8oYUZLr')}
          <ICArrowRight2Outlined />
        </Button>
      </VerificationRequirements>
      <ExDialog
        title={_t('b85dba6d82b04000a303')}
        open={showFailReason}
        onCancel={() => setShowFailReason(false)}
        onOk={handleVerify}
        okText={_t('f84fd34410b74000a91c')}
      >
        {Object.keys(verifyFailReason).map((key, index) => {
          return (
            <RejectionDetail key={key}>
              <RejectionDetailTitle>
                {index + 1}. {TOTAL_FIELD_INFOS[key]?.title?.({ companyType })}
              </RejectionDetailTitle>
              <RejectionDetailContent>{verifyFailReason[key]}</RejectionDetailContent>
            </RejectionDetail>
          );
        })}
        {additionOperatorAttachmentList?.map((key, index) => {
          if (verifyFailReason[key]) {
            return null;
          }
          const fieldInfo = TOTAL_FIELD_INFOS[key];
          const offsetIndex = Object.keys(verifyFailReason).length;
          return fieldInfo ? (
            <RejectionDetail key={key}>
              <RejectionDetailTitle>
                {index + offsetIndex + 1}. {fieldInfo?.title?.({ companyType })}
              </RejectionDetailTitle>
              <RejectionDetailContent>
                {fieldInfo?.description?.({ companyType, kycCode })}
              </RejectionDetailContent>
            </RejectionDetail>
          ) : null;
        })}
      </ExDialog>
    </>
  );
};

export default Rejected;

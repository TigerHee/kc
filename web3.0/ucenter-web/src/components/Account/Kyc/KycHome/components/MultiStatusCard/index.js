import { Steps } from '@kux/mui';
import { KYC_STATUS_ENUM } from 'src/constants/kyc/enums';
import { _t } from 'src/tools/i18n';
import CertContent from '../CertContent';
import CertTitle from '../CertTitle';
import StatusCard from '../StatusCard';
import { Desc, ExSteps } from './styled';

export default ({ list, completedTitle, completedDesc, completedBtnText, onCompleted }) => {
  const isAllDone = list.every((item) => item.status === KYC_STATUS_ENUM.VERIFIED);
  const allBenefits = list.reduce((res, cur) => res.concat(cur.benefits), []);
  if (list.length < 1) {
    return null;
  }
  if (list.length < 2) {
    return <StatusCard {...list[0]} />;
  }
  if (isAllDone) {
    return (
      <StatusCard
        status={KYC_STATUS_ENUM.VERIFIED}
        benefits={allBenefits}
        completedTitle={completedTitle}
        completedDesc={completedDesc}
        completedBtnText={completedBtnText}
        onCompleted={onCompleted}
      />
    );
  }
  return (
    <ExSteps size="small" direction="vertical">
      {list.filter(Boolean).map((item) => {
        const {
          title,
          status,
          failReasonList,
          benefits,
          collectInfos,
          disabled,
          completedBtnText,
          onCompleted,
          onVerify,
        } = item;
        const isVerified = status === KYC_STATUS_ENUM.VERIFIED;

        return (
          <Steps.Step
            key={title}
            title={<CertTitle status={status} title={title} hideReason />}
            status={disabled ? 'wait' : isVerified ? 'finish' : 'process'}
            description={
              <>
                {disabled ? (
                  <Desc style={{ marginTop: 4 }}>{_t('b9085719977c4800abe5')}</Desc>
                ) : null}
                <CertContent
                  {...item}
                  status={status}
                  benefits={benefits}
                  collectInfos={collectInfos}
                  disabled={disabled}
                  completedBtnText={completedBtnText}
                  onCompleted={onCompleted}
                  onVerify={onVerify}
                  failReasonList={failReasonList}
                />
              </>
            }
          />
        );
      })}
    </ExSteps>
  );
};

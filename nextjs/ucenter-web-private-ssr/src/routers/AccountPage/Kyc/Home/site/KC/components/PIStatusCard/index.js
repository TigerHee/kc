import { ComplianceDialog } from 'gbiz-next/kyc';
import { ICFailOutlined } from '@kux/icons';
import { Box, Button, Steps, useSnackbar, useTheme } from '@kux/mui';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Benefit from 'routes/AccountPage/Kyc/components/Benefit';
import { postFinanceChoose } from 'services/kyc';
import { KC_PI_KYC1_BENEFITS, KC_PI_KYC2_BENEFITS } from 'src/constants/kyc/benefits';
import { _t, _tHTML } from 'src/tools/i18n';
import { ReactComponent as HistoryIcon } from 'static/account/kyc/brandUpgrade/history.svg';
import { kcsensorsManualExpose, trackClick } from 'utils/ga';
import useKyc3Status from '../../../../../KycHome/site/KC/hooks/useKyc3Status';
import usePIStatus from '../../../../../KycHome/site/KC/hooks/usePIStatus';
import useResponsiveSSR from '@/hooks/useResponsiveSSR';

import {
  CertTitle,
  ColumnBox,
  Desc,
  Divider,
  ExSteps,
  ExTag,
  Region,
  RegionIcon,
  RejectedAlert,
  RowBox,
  Title,
  VerifyingAlert,
} from './styled';

const PIStatusCard = ({ onDeposit, onRetry }) => {
  const theme = useTheme();
  const { message } = useSnackbar();
  const dispatch = useDispatch();
  const { kyc3Status, kyc3StatusEnum } = useKyc3Status();
  const {
    regionName,
    regionIcon,
    failureReasonLists = [],
  } = useSelector((state) => state.kyc?.kycInfo ?? {});
  const { PIStatusEnum, PIStatus, PIComplianceInfo } = usePIStatus();
  const PIFailedReasons = PIComplianceInfo?.failedReason;
  // PI 认证弹窗是否打开
  const [isPIVerifyOpen, setPIVerifyOpen] = useState(false);
  const rv = useResponsiveSSR();

  const isBasicVerifying = [kyc3StatusEnum.VERIFYING, kyc3StatusEnum.FAKE].includes(kyc3Status);
  const isBasicRejected = [kyc3StatusEnum.REJECTED].includes(kyc3Status);
  const isBasicVerified = [kyc3StatusEnum.VERIFIED].includes(kyc3Status);
  const isPIUnverified = PIStatus === PIStatusEnum.UNVERIFIED;
  const isPIVerifying = PIStatus === PIStatusEnum.VERIFYING;
  const isPIRejected = PIStatus === PIStatusEnum.REJECTED;
  const isH5 = !rv?.sm;

  useEffect(() => {
    isBasicVerified && dispatch({ type: 'kyc/pullFinanceList', payload: { kycType: 'KYC' } });
  }, [isBasicVerified]);

  useEffect(() => {
    kcsensorsManualExpose(['englishKycResult', '1'], {
      status: PIStatus ?? PIStatusEnum.UNVERIFIED,
    });
  }, [PIStatus]);

  // 开始 PI 认证
  const onPIVerify = useCallback(() => {
    postFinanceChoose({
      kycType: 'KYC',
      standardAlias: PIComplianceInfo?.standardWaitlist?.[0],
      financeComplianceType: PIComplianceInfo.type,
    })
      .then((res) => {
        setPIVerifyOpen(true);
      })
      .catch((err) => {
        err.msg && message.error(err.msg);
      });
  }, [PIComplianceInfo, message]);

  const renderVerifyingAlert = () => (
    <VerifyingAlert>
      <RowBox>
        <HistoryIcon size={18} />
        <span>{_t('a90983f924404800a3b8')}</span>
      </RowBox>
      <div>{_t('157d19f9d3064000a165')}</div>
    </VerifyingAlert>
  );

  const renderRejectedAlert = (failureReasons) => (
    <RejectedAlert>
      <RowBox>
        <ICFailOutlined size={18} />
        <span>{_t('12807d730f894000a9fe')}</span>
      </RowBox>
      <ul>
        {failureReasons?.map((info) => (
          <li key={info}>{info}</li>
        ))}
      </ul>
    </RejectedAlert>
  );

  return (
    <ColumnBox gap={isH5 ? 24 : 28}>
      <div>
        <Title>{_t('e57ddb4efda64000afda')}</Title>
        <Box size={16} />
        <Region>
          <div>{_t('0418ee48e1824800ade2')}</div>
          <RowBox gap={4}>
            <RegionIcon src={regionIcon} />
            <span>{regionName}</span>
          </RowBox>
        </Region>
        <Box size={20} />
        <Divider />
      </div>
      <ColumnBox gap={16}>
        <Desc>{_tHTML('5daa3987d2434800afe9')}</Desc>
        <ExSteps size="small" direction="vertical">
          <Steps.Step
            status={isBasicVerified ? 'finish' : 'process'}
            title={
              <CertTitle>
                <span>{_t('2fd9c0dd3cde4000abb7')}</span>
                {isBasicVerifying ? (
                  <ExTag color="complementary">{_t('a90983f924404800a3b8')}</ExTag>
                ) : isBasicRejected ? (
                  <ExTag color="secondary">{_t('12807d730f894000a9fe')}</ExTag>
                ) : isBasicVerified ? (
                  <ExTag>{_t('460cb69b03104000a1fc')}</ExTag>
                ) : null}
              </CertTitle>
            }
            description={
              <Benefit
                unlockInfos={KC_PI_KYC1_BENEFITS()}
                collectInfos={[_t('f9b43fd2ffdf4000a6c5'), _t('8a5769cf4cc54800ae5b')]}
                bottomSlot={
                  isBasicVerifying ? (
                    renderVerifyingAlert()
                  ) : isBasicVerified ? (
                    <Button style={{ minWidth: 283 }} variant="outlined" onClick={onDeposit}>
                      {_t('5eb06d178a384800a162')}
                    </Button>
                  ) : isBasicRejected ? (
                    <ColumnBox gap={16}>
                      {renderRejectedAlert(failureReasonLists)}
                      <ColumnBox gap={12}>
                        <Button fullWidth onClick={onRetry}>
                          {_t('205f4884ec904800a1c2')}
                        </Button>
                      </ColumnBox>
                    </ColumnBox>
                  ) : null
                }
              />
            }
          />
          <Steps.Step
            status={isBasicVerified ? 'process' : 'wait'}
            title={
              <CertTitle>
                <span>{_t('fe9978d0f98f4000a109')}</span>
                {isPIVerifying ? (
                  <ExTag color="complementary">{_t('a90983f924404800a3b8')}</ExTag>
                ) : isPIRejected ? (
                  <ExTag color="secondary">{_t('12807d730f894000a9fe')}</ExTag>
                ) : null}
              </CertTitle>
            }
            description={
              <Benefit
                unlockInfos={KC_PI_KYC2_BENEFITS()}
                collectInfos={
                  isBasicVerified ? [_t('a279676c69734000a122'), _t('edb8be65563e4000a96a')] : []
                }
                bottomSlot={
                  isBasicVerified ? (
                    isPIUnverified ? (
                      <Button
                        onClick={() => {
                          trackClick(['englishKycResult', 'getVerify']);
                          onPIVerify();
                        }}
                      >
                        {_t('7021b44675954000a833')}
                      </Button>
                    ) : isPIVerifying ? (
                      renderVerifyingAlert()
                    ) : isPIRejected ? (
                      <ColumnBox gap={16}>
                        {renderRejectedAlert(PIFailedReasons)}
                        <ColumnBox gap={12}>
                          <Button
                            fullWidth
                            onClick={() => {
                              trackClick(['englishKycResult', 'tryAgain']);
                              onPIVerify();
                            }}
                          >
                            {_t('205f4884ec904800a1c2')}
                          </Button>
                        </ColumnBox>
                      </ColumnBox>
                    ) : null
                  ) : null
                }
              />
            }
          />
        </ExSteps>
      </ColumnBox>
      <ComplianceDialog
        open={isPIVerifyOpen}
        onCancel={() => setPIVerifyOpen(false)}
        onOk={() => {
          setPIVerifyOpen(false);
          dispatch({
            type: 'kyc/pullFinanceList',
            payload: {
              kycType: 'KYC',
            },
          });
        }}
        theme={theme.currentTheme}
        complianceType={PIComplianceInfo?.standardWaitlist?.[0]}
      />
    </ColumnBox>
  );
};

export default PIStatusCard;

/**
 * Owner: john.zhang@kupotech.com
 */

import { ICInfoOutlined } from '@kux/icons';
import { Button, Checkbox, Dialog, Steps, styled, Tooltip, useTheme } from '@kux/mui';
import { useEffect, useState } from 'react';
import { _t, _tHTML } from '@/tools/i18n';
import { ReactComponent as Close } from 'static/account/guidance/dialog-close.svg';
import { ReactComponent as FailStatus } from 'static/account/guidance/fail-status.svg';

import JsBridge from 'gbiz-next/bridge';
import { ZBX_OFFICIAL_LINK } from '../../constants';
import { DialogHeader } from './StyledComponents';

const { Step } = Steps;

const CardContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const CardBox = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
`;

const Order = styled.div`
  /* margin-top: 2px; */
  width: 20px;
  min-width: 20px;
  height: 20px;
  min-height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  border-radius: 50%;
  font-weight: 500;
  line-height: 140%;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.textEmphasis};
  /* ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 12px;
  } */
`;

const CardContentBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%;
  margin-bottom: 4px;
  color: ${({ theme }) => theme.colors.text};
`;

const GuidanceRegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

const Description = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 180%;
  a {
    color: ${({ theme }) => theme.colors.text};
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;

const OperationBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.cover2};
  border-radius: 12px;
`;

const CheckedWrap = styled.div`
  display: flex;
  gap: 8px;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%;
`;
const RegisterButton = styled(Button)`
  padding: 10px 24px;
  height: fit-content;
  width: fit-content;
  height: 40px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100%;
    height: 52px;
    line-height: 32px;
  }
`;

const DisabledButton = styled(Button)`
  padding: 10px 24px;
  width: 100%;
  height: fit-content;
  width: fit-content;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100%;
    line-height: 32px;
  }
`;

const RegisteringBox = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text60};
`;

const InfoIcon = styled(ICInfoOutlined)`
  margin-top: 2px;
  min-width: 16px;
  min-height: 16px;
`;
const InfoBox = styled.div`
  margin-bottom: 16px;
  display: flex;
  /* align-items: baseline; */
  font-size: 14px;
  font-weight: 400;
  line-height: 160%;
  color: ${({ theme }) => theme.colors.text60};
  gap: 8px;
`;

const RetryDialog = styled(Dialog)`
  width: 100%;
  .KuxDialog-body {
    width: 400px;
    min-width: 400px;

    .KuxDialog-content {
      display: flex;
      justify-content: center;
    }

    ${({ theme }) => theme.breakpoints.down('sm')} {
      min-width: 320px;
      min-width: unset;
    }
  }
  .KuxModalFooter-buttonWrapper {
    display: flex;
    justify-content: center;
    width: 100%;
  }
`;

const RetryContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const FailTips = styled.div`
  font-size: 20px;
  font-weight: 700;
  line-height: 140%;
  color: ${({ theme }) => theme.colors.text};
`;

const CloseIcon = styled(Close)`
  cursor: pointer;
`;

const StyledHeader = styled(DialogHeader)`
  display: flex;
  justify-content: end;
`;

const StyledCheckbox = styled(Checkbox)`
  .KuxCheckbox-checkbox {
    top: -3px;
  }
`;

const ButtonBox = styled.div`
  width: fit-content;
`;

const StyledSteps = styled(Steps)`
  .KuxStep-title {
    font-weight: 700;
    font-size: 16px;
    font-style: normal;
    line-height: 140%;
  }
  .KuxStep-icon {
    color: ${({ theme }) => theme.colors.textEmphasis};
    background-color: ${({ theme }) => theme.colors.text};
  }
`;

const StyledStepItem = styled(Step)``;

const CreateZBXAccountContent = ({ onRegister }) => {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [url, setUrl] = useState('');

  const isApp = JsBridge.isApp();

  const handleRegisterZBXAccount = async () => {
    try {
      setLoading(true);
      const { success, data } = await onRegister?.();
      if (success) {
        setUrl(data);
      } else {
        setShowError(true);
      }
    } catch (error) {
      console.error('show handleRegisterZBXAccount error:', error);
    } finally {
      setLoading(false);
    }
  };

  const btnContent = checked ? (
    <RegisterButton onClick={handleRegisterZBXAccount}>{_t('2a6865fe80ef4800afe7')}</RegisterButton>
  ) : (
    <Tooltip placement="top" title={_t('check.required')}>
      <ButtonBox>
        <DisabledButton disabled>{_t('2a6865fe80ef4800afe7')}</DisabledButton>
      </ButtonBox>
    </Tooltip>
  );

  const operationContent = !!url ? (
    _t('3300868ae2c34800aed9')
  ) : (
    <>
      <CheckedWrap>
        <StyledCheckbox
          checked={checked}
          size="basic"
          onChange={(e) => setChecked(e.target?.checked)}
        />
        <span>{_t('ee69d66111e94000aec7')}</span>
      </CheckedWrap>
      {!loading && btnContent}

      {loading && (
        <RegisteringBox>
          <RegisterButton loading />
          <span>{_t('73508694aac14000a3c5')}</span>
        </RegisteringBox>
      )}
    </>
  );

  // 前往 ZBX 自行注册地址待确认
  const handleCancel = () => {
    if (isApp) {
      window.location.href = ZBX_OFFICIAL_LINK;
    } else {
      window.open(ZBX_OFFICIAL_LINK);
    }
  };

  const handleRedirectZBX = (url) => {
    if (isApp) {
      window.location.href = url;
    } else {
      window.open(url);
    }
  };

  useEffect(() => {
    if (url) {
      handleRedirectZBX(url);
    }
  }, [url]);

  return (
    <GuidanceRegisterContainer>
      <Description>{_tHTML('4ce3068411fd4000ae50', { href: ZBX_OFFICIAL_LINK })} </Description>
      <OperationBox>{operationContent}</OperationBox>

      <RetryDialog
        open={showError}
        cancelText={_t('5684956167244800a509')}
        okText={_t('cb813947cd184000a901')}
        header={
          <StyledHeader>
            <CloseIcon onClick={() => setShowError(false)} />
          </StyledHeader>
        }
        onCancel={handleCancel}
        onOk={() => {
          setShowError(false);
          handleRegisterZBXAccount();
        }}
        showCloseX={true}
      >
        <RetryContent>
          <FailStatus />
          <FailTips>{_t('726f2ce5f5f44000a65e')}</FailTips>
        </RetryContent>
      </RetryDialog>
    </GuidanceRegisterContainer>
  );
};

const DialogContent = ({ onRegister }) => {
  const theme = useTheme();
  const step1Content = <CreateZBXAccountContent onRegister={onRegister} />;
  const step2Content = (
    <InfoBox>
      <InfoIcon size={16} color={theme.colors.complementary} />
      <span>{_tHTML('9103e99cd8d74000aaaf')}</span>
    </InfoBox>
  );

  return (
    <StyledSteps current={0} size="small" direction="vertical">
      <StyledStepItem title={_t('fcd40c35465b4000a328')} description={step1Content} />
      <StyledStepItem title={_t('269026f340954800a91e')} description={step2Content} />
    </StyledSteps>
  );
};

export default DialogContent;

/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ICArrowDownOutlined } from '@kux/icons';
import { Steps, styled, Tooltip } from '@kux/mui';
import { useEffect, useState } from 'react';
import { KYC_STATUS_ENUM } from 'src/constants/kyc/enums';
import { _t } from 'src/tools/i18n';
import FailureReason from '../../FailureReason';
import { StatusTag } from './StatusTag';
import { CheckReason, ExTag } from './styled';

export const ExSteps = styled(Steps)`
  & > .KuxStep-step:last-child .KuxStep-stepContent {
    margin-bottom: 16px;
  }
  .KuxStep-stepContent {
    flex: 1;
    margin-left: 16px;
  }
  .KuxStep-content {
    margin-top: 20px;
  }
  .KuxStep-tail:after {
    background: ${({ theme }) => theme.colors.divider8};
  }
  .KuxStep-icon {
    color: ${({ theme }) => theme.colors.textEmphasis};
    background-color: ${({ theme }) => theme.colors.text30};
  }
  .KuxStep-title {
    color: ${({ theme }) => theme.colors.text40};
  }
  .KuxStep-ActiveStep,
  .KuxStep-finishStep {
    .KuxStep-icon {
      color: ${({ theme }) => theme.colors.textEmphasis};
      background-color: ${({ theme }) => theme.colors.text};
    }
    .KuxStep-title {
      color: ${({ theme }) => theme.colors.text};
    }
  }
  .white-bg {
    .KuxStep-icon {
      color: ${({ theme }) => theme.colors.text40};
      background-color: ${({ theme }) => theme.colors.textEmphasis};
      border: none;
    }
    &.KuxStep-ActiveStep,
    &.KuxStep-finishStep {
      .KuxStep-icon {
        color: ${({ theme }) => theme.colors.text};
        background-color: ${({ theme }) => theme.colors.textEmphasis};
      }
    }
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    .KuxStep-icon {
      width: 20px;
      height: 20px;
      font-size: 13px;
    }
    .KuxStep-tail {
      left: 10px;
    }
    .KuxStep-content {
      margin-top: 12px;
    }
  }
`;
export const StepTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  line-height: 140%;
  display: flex;
  gap: 12px;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 16px;
  }
`;
export const StepDesc = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 140%;
`;
const SkipTag = styled(ExTag)`
  color: ${({ theme }) => theme.colors.text40};
`;
const ArrowDown = styled(ICArrowDownOutlined)`
  transition: transform 0.5s ease;
  transform: rotate(${({ active }) => (active ? 180 : 0)}deg);
  cursor: pointer;
`;
const ExStep = styled(Steps.Step)`
  .KuxStep-content {
    display: ${({ noContent }) => (noContent ? 'none' : 'block')};
  }
`;

const KycStep = ({
  icon,
  iconWhiten,
  title,
  kycStatus,
  showFailReason = true,
  canSkip = false,
  failReasonList,
  block,
  description,
  ...props
}) => {
  const [hiddenDesc, setHiddenDesc] = useState(false);

  useEffect(() => {
    setHiddenDesc(canSkip);
  }, [canSkip]);

  return (
    <ExStep
      icon={icon}
      className={iconWhiten ? 'white-bg' : ''}
      noContent={hiddenDesc}
      title={
        <>
          <StepTitle>
            <span>{title}</span>
            {kycStatus ? <StatusTag status={kycStatus} /> : null}
            {kycStatus === KYC_STATUS_ENUM.REJECTED && showFailReason ? (
              <Tooltip title={<FailureReason failureReasonLists={failReasonList} />}>
                <CheckReason>{_t('11795d4672934800a0ec')}</CheckReason>
              </Tooltip>
            ) : null}
            {canSkip ? (
              <>
                <SkipTag color="default">{_t('22803dc8632f4800a3a8')}</SkipTag>
                <ArrowDown
                  size={20}
                  active={!hiddenDesc}
                  onClick={() => setHiddenDesc(!hiddenDesc)}
                />
              </>
            ) : null}
          </StepTitle>
          {block ? <StepDesc>{_t('b9085719977c4800abe5')}</StepDesc> : null}
        </>
      }
      description={description}
      {...props}
    />
  );
};

export default function KycSteps({ current, steps = [] }) {
  return (
    <ExSteps direction="vertical" current={current} size="small">
      {steps.filter(Boolean).map(({ key, status, ...props }) => (
        <KycStep
          key={key}
          // Step 组件也有 status 入参，直接传入会覆写掉它的样式
          kycStatus={status}
          {...props}
        />
      ))}
    </ExSteps>
  );
}

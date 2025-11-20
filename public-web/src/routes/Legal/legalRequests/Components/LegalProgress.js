/**
 * Owner: odan.ou@kupotech.com
 */
import { SuccessOutlined } from '@kux/icons';
import { Steps, styled, useTheme } from '@kux/mui';
import { useMemo } from 'react';
import { eFalseStyle, eScreenStyle, eTheme, eTrueStyle, _t } from '../utils';

const StepsWrap = styled.div`
  .KuxStep-tail,
  .KuxStep-tail:after,
  .KuxStep-title:after {
    color: ${eTheme('cover16')};
    background: ${eTheme('cover16')};
  }
  .KuxStep-horizontalStep {
    flex: 1 auto;
    ${eFalseStyle('isVertical')`
      max-width: 34%;
    `}
  }
  .KuxStep-title {
    font-size: 16px;
    word-break: break-all;
    ${eScreenStyle('Max1200')`
      font-size: 14px;
    `}
    ${eScreenStyle('Max768')`
      font-size: 12px;
    `}
  }
  .KuxStep-finishStep {
    .KuxStep-icon {
      background: ${eTheme('textEmphasis')};
    }
  }
  .KuxStep-ActiveStep {
    .KuxStep-icon {
      color: ${eTheme('textEmphasis')};
      background: ${eTheme('text')};
    }
  }
  .KuxStep-waitStep {
    .KuxStep-icon {
      color: ${eTheme('textEmphasis')};
      background: ${eTheme('text20')};
    }
  }
  ${eTrueStyle('isVertical')`
    margin-left: 12px;
  `}
  ${eFalseStyle('isVertical')`
    margin-bottom: 40px;
    ${eScreenStyle('Max768')`
      margin-bottom: 24px;
    `}
  `}
`;

const { Step } = Steps;

const LegalProgress = (props) => {
  const { isError = false, currentStep = 0, direction = 'vertical', screen } = props;
  const status = isError ? 'error' : undefined;
  const theme = useTheme();
  const list = useMemo(() => {
    return [
      {
        title: _t('rwqg1wK5NEb57q2LrdjXfr', '执法机构账户登录/注册'),
        key: 'login',
        step: 0,
      },
      {
        title: _t('sKhUQ44D8pKdePsk3GsRe9', '核验身份'),
        key: 'recheck',
        step: 1,
      },
      {
        title: _t('x9Uuq2GjkGGbxqyh4YfCPa', '执法请求'),
        key: 'legalRequests',
        step: 2,
      },
    ];
  }, []);
  return (
    <StepsWrap isVertical={direction === 'vertical'} screen={screen}>
      <Steps status={status} size="small" direction={direction} current={currentStep}>
        {list.map(({ title, key, step }) => (
          <Step
            title={title}
            key={key}
            icon={
              currentStep > step ? (
                <SuccessOutlined size={28} color={theme.colors.text} />
              ) : undefined
            }
          />
        ))}
      </Steps>
    </StepsWrap>
  );
};

export default LegalProgress;

/**
 * Owner: tiger@kupotech.com
 */
import { styled, Button, Spin, Tooltip } from '@kux/mui';
import classnames from 'classnames';
import { LeftOutlined } from '@kux/icons';
import { tenantConfig } from '@packages/kyc/src/config/tenant';
import useCommonData from '@kycCompliance/hooks/useCommonData';
import useDebounceFn from '@kycCompliance/hooks/useDebounceFn';

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  .KuxCheckbox-wrapper > span {
    top: 0;
  }
  /* 表单组件隐藏cls */
  .componentHide {
    display: none;
  }
`;

export const ContentBox = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ needPt }) => (needPt ? '8px 32px 16px' : '0 32px 16px')};
  position: relative;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 28px 16px 16px;
  }

  &.isSmStyle {
    padding: 8px 16px 0;
  }
  & .KuxDatePicker-wrapper {
    width: 100%;
  }
  .KuxForm-itemHelp {
    min-height: 32px;
    .KuxForm-itemError {
      padding-bottom: 8px;
    }
  }
  .itemHelp24 {
    .KuxForm-itemHelp {
      min-height: 24px;
    }
  }

  &::-webkit-scrollbar {
    width: 4px;
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.icon40};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: 4px;
  }

  input::-webkit-input-placeholder {
    font-weight: 400;
  }

  input:-moz-placeholder {
    font-weight: 400;
  }

  input::-moz-placeholder {
    font-weight: 400;
  }

  input:-ms-input-placeholder {
    font-weight: 400;
  }
`;

export const StyledSpin = styled(Spin)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

export const PageTitle = styled.div`
  font-size: 24px;
  font-weight: 600;
  line-height: 130%;
  text-align: ${({ textCenter }) => (textCenter ? 'center' : 'left')};
  color: ${({ theme }) => theme.colors.text};
`;

export const BtnBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 20px 32px;
  /* border-top: 1px solid ${({ theme }) => theme.colors.divider8}; */
  box-shadow: 0px 1px 0px 0px #00000014 inset;
  gap: 24px;
  .KuxButton-contained{
    min-width: 120px;
  }
  .tooltipContent{
    width: fit-content;
  }
  &.justifyContentBetween{
    justify-content: space-between;
  }
  &.isSmStyle {
    padding: 16px;
    box-shadow: none;
    .tooltipContent{
      width: 100%;
    }
  }
  &.isDialogH5 {
    gap: 12px;
    box-shadow: none;
    padding: 24px 16px;
    flex-direction: column-reverse;
    .tooltipContent{
      width: 100%;
    }
  }
`;
export const Back = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  span {
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%;
    color: ${({ theme }) => theme.colors.text};
  }
`;
export const LeftIcon = styled(LeftOutlined)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;
export const PreButtonStyle = styled(Button)`
  margin-right: 24px;
  color: ${({ theme }) => theme.colors.text60};
`;

const ProgressBox = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.cover4};
`;
const ProgressBar = styled.div`
  height: 100%;
  width: ${({ width }) => width};
  background-color: ${({ theme }) => theme.colors.text};
`;

export const FooterBtnBox = ({
  onNext = () => {},
  onPre,
  preText,
  nextText,
  isNextLoading = false,
  nextBtnProps = {},
  nextTooltip,
}) => {
  const { isSmStyle, stepData, isH5 } = useCommonData();
  const { show, percent } = stepData;

  const { run: onNextDebounce } = useDebounceFn(
    () => {
      onNext();
    },
    {
      wait: 200,
    },
  );

  const isShowBackBtn = !isH5 && !isSmStyle && onPre && preText;

  const NextBtnEl = (
    <Button
      loading={isNextLoading}
      fullWidth={isSmStyle || isH5}
      size={isSmStyle || isH5 ? 'large' : 'basic'}
      onClick={onNextDebounce}
      {...nextBtnProps}
    >
      <span>{nextText}</span>
    </Button>
  );

  return (
    <>
      {/* 进度条 */}
      {!isSmStyle && !isH5 && show && tenantConfig.compliance.isShowStepBar ? (
        <ProgressBox>
          <ProgressBar width={percent} />
        </ProgressBox>
      ) : null}

      {/* 按钮组 */}
      <BtnBox
        className={classnames({
          footerBtnBox: true,
          isSmStyle,
          justifyContentBetween: false,
          isDialogH5: !isSmStyle && isH5,
        })}
      >
        {isShowBackBtn ? (
          <Button onClick={onPre} variant="text">
            {/* <LeftIcon /> */}
            <span>{preText}</span>
          </Button>
        ) : null}

        {nextText ? (
          nextTooltip ? (
            <Tooltip placement="top" trigger="click" title={nextTooltip}>
              <div className="tooltipContent">{NextBtnEl}</div>
            </Tooltip>
          ) : (
            NextBtnEl
          )
        ) : null}
      </BtnBox>
    </>
  );
};

/**
 * Owner: tiger@kupotech.com
 */
import { styled, Spin } from '@kux/mui';

export const QuestionWrapper = styled.div`
  .KuxForm-item {
    padding-left: 16px;
  }
`;
export const StyledSpin = styled(Spin)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;
export const Title = styled.div`
  font-size: 24px;
  font-weight: 700;
  line-height: 130%;
  margin-bottom: 24px;
  color: ${(props) => props.theme.colors.text};
`;
export const Question = styled.div`
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.text};
`;
export const QuestionDesc = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  margin-bottom: 14px;
  padding-left: 18px;
  color: ${({ theme }) => theme.colors.text40};
`;
export const RadioItem = styled.div`
  display: flex;
  &:not(:last-child) {
    margin-bottom: 14px;
  }
  .KuxRadio-wrapper {
    display: flex;
    align-items: flex-start;
  }
  .KuxRadio-radio {
    height: 22px;
  }
  .KuxRadio-checked .KuxRadio-inner {
    border-color: ${(props) => props.theme.colors.text} !important;
    &::after {
      background-color: ${(props) => props.theme.colors.text} !important;
    }
  }
  .KuxForm-item {
    display: inline-flex;
  }
  .KuxForm-itemHelp {
    display: none;
  }
  .KuxRadio-text {
    color: ${({ theme }) => theme.colors.text};
    line-height: 22px;
    margin-left: 8px;
  }
`;
export const CheckboxItem = styled.div`
  display: flex;
  &:not(:last-child) {
    margin-bottom: 14px;
  }
  .KuxCheckbox-wrapper {
    display: flex;
    align-items: flex-start;
    color: ${({ theme }) => theme.colors.text};
    line-height: 22px;
  }
  .KuxCheckbox-checkbox {
    margin-top: 2px;
    margin-right: 2px;
  }
  .KuxForm-item {
    display: inline-flex;
  }
  .KuxForm-itemHelp {
    display: none;
  }
`;

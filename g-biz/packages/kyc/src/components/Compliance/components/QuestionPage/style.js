/**
 * Owner: tiger@kupotech.com
 */
import { styled, Spin } from '@kux/mui';

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
export const DescWrapper = styled.div`
  width: 100%;
  font-size: 14px;
  line-height: 130%;
  font-weight: 400;
  margin-bottom: 24px;
  color: ${(props) => props.theme.colors.text40};
`;
export const Question = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 130%;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.text};
`;
export const RadioItem = styled.div`
  display: flex;
  &:not(:last-child) {
    margin-bottom: 14px;
  }
  .KuxRadio-wrapper {
    display: flex;
    align-items: center;
  }
  .KuxRadio-checked .KuxRadio-inner {
    border-color: ${(props) => props.theme.colors.primary} !important;
  }
  .KuxForm-item {
    display: inline-flex;
  }
  .KuxForm-itemHelp {
    display: none;
  }
  .KuxRadio-text {
    color: ${({ theme }) => theme.colors.text60};
  }
  &.isGreen {
    .KuxRadio-text {
      color: ${(props) => props.theme.colors.primary};
    }
    .KuxRadio-inner {
      border-color: ${(props) => props.theme.colors.primary} !important;
    }
  }
  &.isRed {
    .KuxRadio-text {
      color: ${(props) => props.theme.colors.secondary};
    }
    .KuxRadio-inner {
      border-color: ${(props) => props.theme.colors.secondary} !important;
      &::after {
        background-color: ${(props) => props.theme.colors.secondary} !important;
      }
    }
  }
`;
export const CheckboxItem = styled.div`
  display: flex;
  &:not(:last-child) {
    margin-bottom: 14px;
  }
  .KuxCheckbox-wrapper {
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.colors.text60};
  }
  .KuxForm-item {
    display: inline-flex;
  }
  .KuxForm-itemHelp {
    display: none;
  }
  &.isGreen {
    .KuxCheckbox-inner {
      border-color: ${(props) => props.theme.colors.primary} !important;
    }
    span {
      border-color: ${(props) => props.theme.colors.primary} !important;
    }
  }
  &.isRed {
    .KuxCheckbox-inner {
      background-color: ${(props) => props.theme.colors.secondary} !important;
      border-color: ${(props) => props.theme.colors.secondary} !important;
    }
    span {
      border-color: ${(props) => props.theme.colors.secondary} !important;
    }
  }
`;

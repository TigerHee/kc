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
  color: var(--color-text);
`;
export const DescWrapper = styled.div`
  width: 100%;
  font-size: 14px;
  line-height: 130%;
  font-weight: 400;
  margin-bottom: 24px;
  color: var(--color-text40);
`;
export const Question = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 130%;
  margin-bottom: 12px;
  color: var(--color-text);
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
  .KuxForm-item {
    display: inline-flex;
  }
  .KuxForm-itemHelp {
    display: none;
  }
  .KuxRadio-text {
    color: var(--color-text60);
  }
  &.isGreen {
    .KuxRadio-text {
      color: var(--color-primary);
    }
    .KuxRadio-inner {
      border-color: var(--color-primary) !important;
      &::after {
        background-color: var(--color-primary) !important;
      }
    }
  }
  &.isRed {
    .KuxRadio-text {
      color: var(--color-secondary);
    }
    .KuxRadio-inner {
      border-color: var(--color-secondary) !important;
      &::after {
        background-color: var(--color-secondary) !important;
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
    color: var(--color-text60);
  }
  .KuxForm-item {
    display: inline-flex;
  }
  .KuxForm-itemHelp {
    display: none;
  }
  .KuxCheckbox-inner {
    width: 20px;
    height: 20px;
  }
  &.isGreen {
    .KuxCheckbox-inner {
      border-color: var(--color-primary) !important;
    }
    span {
      border-color: var(--color-primary) !important;
    }
  }
  &.isRed {
    .KuxCheckbox-inner {
      background-color: var(--color-secondary) !important;
      border-color: var(--color-secondary) !important;
    }
    span {
      border-color: var(--color-secondary) !important;
    }
  }
`;

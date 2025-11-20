/**
 * Owner: garuda@kupotech.com
 * 定义一些公共的样式
 */
// 自定义 Checkbox ，不使用 @mui 里的
import { Checkbox } from '@kux/mui';

import KuxAlert from '@mui/Alert';
import InputNumber from '@mui/InputNumber';

import { styled } from '../builtinCommon';
import { InputWithToolTip } from '../builtinComponents';

export const InputNumberFull = styled(InputNumber)`
  width: 100%;
`;

export const StyledInputWithToolTip = styled(InputWithToolTip)`
  position: relative;
`;

export const FormItemWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

export const FormItemLabel = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text40};
`;

export const CheckBoxItem = styled(Checkbox)`
  display: inline-flex;
  align-items: center;
  margin-right: 14px;
  max-width: 50%;

  > span {
    top: 0;
    margin-left: 0;
    font-size: 12px;
    line-height: 1.3;
    color: ${(props) => props.theme.colors.text40};
    &:first-of-type {
      margin-right: 4px;
    }
  }

  .KuxCheckbox-inner {
    width: 14px;
    height: 14px;
    border-width: 1px;
  }

  &.KuxCheckbox-wrapper-checked {
    > span {
      &:last-of-type {
        color: ${(props) => props.theme.colors.text};
      }
    }
  }
`;

export const SpanUnderline = styled.span`
  text-decoration: underline dashed ${(props) => props.theme.colors.text20};
  cursor: help;
`;

export const Alert = styled(KuxAlert)`
  align-items: flex-start;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text60};
  .KuxAlert-icon {
    padding: 0 6px 0 0;
  }
  .KuxAlert-title {
    font-size: 12px;
    line-height: 16px;
  }
`;

// 根据条件返回选择器
export const logicThis = (v) => {
  if (v) return '&';
  return 'false';
};

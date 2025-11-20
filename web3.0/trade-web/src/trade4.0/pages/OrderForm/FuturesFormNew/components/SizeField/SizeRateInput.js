/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import clsx from 'clsx';

import { styled } from '../../builtinCommon';
import { NumberInput } from '../../builtinComponents';

const RateInput = styled(NumberInput)`
  width: 48;
  margin: 0 0 0 4px;
  padding: 0 4px;
  font-size: 12px;
  line-height: 1.3;
  height: ${(props) => (props.size === 'xssmall' ? '16px' : '24px')};
  border: 0;
  border-radius: 4px;
  background: ${(props) => props.theme.colors.cover4};
  caret-color: ${(props) => props.theme.colors.primary};
  opacity: 1;
  flex: 1;

  .KuxInput-input {
    padding: 0 0 0 2px;
    height: auto;
    font-size: 12px;
    line-height: 1.3;
    color: ${(props) => props.theme.colors.text};
    text-align: center;

    &:focus {
      color: ${(props) => props.theme.colors.primary};
      font-weight: 500;
    }
  }

  &.KuxInput-disabled {
    .KuxInput-input {
      color: ${(props) => props.theme.colors.cover16};
    }
  }

  fieldset {
    border: 0;
    border-radius: 4px;
  }

  .suffix {
    font-size: 12px;
    color: ${(props) => props.theme.colors.text20};
  }

  .KuxDivider-root{
    display: none;
  }

  &.size-rate-input-default {
    .input {
      color: ${(props) => props.theme.colors.cover16};
    }

    .suffix {
      color: ${(props) => props.theme.colors.cover16};
    }
  }
`;

const SizeRateInput = (props) => {
  return (
    <RateInput
      noStyle
      classNames={clsx('size-rate-input', !props.value ? 'size-rate-input-default' : '')}
      suffix={<span className={'suffix'}>%</span>}
      strictReg
      {...props}
    />
  );
};

export default React.memo(SizeRateInput);

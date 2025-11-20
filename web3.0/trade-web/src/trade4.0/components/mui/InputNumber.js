/*
 * owner: Borden@kupotech.com
 */
import React, { forwardRef, useCallback } from 'react';
import { isFunction } from 'lodash';
import { InputNumber } from '@kux/mui';
import styled from '@emotion/styled';

const MuiInputNumber = forwardRef(({ formatter, precision, onChange, ...otherProps }, ref) => {
  const triggerChange = useCallback((v) => {
    if (isFunction(formatter) && precision) {
      v = formatter(v, precision);
    }
    if (isFunction(onChange)) {
      onChange(v);
    }
  }, [formatter, precision, onChange]);

  return (
    <InputNumber
      ref={ref}
      precision={precision}
      onChange={triggerChange}
      {...otherProps}
    />
  );
});

export default MuiInputNumber;

const InputNumberFull = styled(InputNumber)`
  width: 100%;
`;

const InputNumberSuffixWrap = styled.div`
  display: flex;
  width: 100%;
`;

const InputNumberSuffixInput = styled.div`
  white-space: nowrap;
  flex-grow: 1;
  display: flex;
  font-size: 14px;
`;

const InputNumberSuffixContent = styled.div`
  flex-shrink: 0;
`;

export const InputNumberSuffix = forwardRef((props, ref) => {
  const { suffix, ...inputProps } = props;
  return (<InputNumberSuffixWrap>
    <InputNumberSuffixInput>
      {<InputNumberFull {...inputProps} ref={ref} />}
    </InputNumberSuffixInput>
    { !!suffix && <InputNumberSuffixContent>
      { suffix }
    </InputNumberSuffixContent>
    }
  </InputNumberSuffixWrap>);
});

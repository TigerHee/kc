import React, { useImperativeHandle, useMemo, useState, useEffect } from 'react';
import { clx } from '@/common/style';
import { ArrowRight2Icon } from '@kux/iconpack';
import { InputContainerProps } from '../types';
import { getDateDisplayText } from '../utils/date-utils';

const InputContainer = React.forwardRef<{ setInputValue: (value: any) => void }, InputContainerProps>(
  ({ value, defaultValue, format = 'YYYY/MM/DD', currentInput, onInputChange, className, inputClassName }, ref) => {
    const [innerValue, setInnerValue] = useState(defaultValue);

    useEffect(() => {
      setInnerValue(value);
    }, [value]);

    const displayText = useMemo(() => {
      if (Array.isArray(innerValue)) {
        const texts = getDateDisplayText(innerValue, format);
        return texts;
      }
      return innerValue ? [innerValue.format(format)] : [''];
    }, [format, innerValue]);

    useImperativeHandle(ref, () => {
      return {
        setInputValue: setInnerValue,
      };
    });

    if (Array.isArray(innerValue)) {
      return (
        <div className={clx('kux-mobile-picker__input-line', className)}>
          <div
            className={clx('kux-mobile-picker__input', {
              'kux-mobile-picker__input--active': currentInput === 0,
            }, inputClassName)}
            onClick={() => onInputChange?.(0)}
          >
            {displayText[0]}
          </div>
          <div className="kux-mobile-picker__arrow-wrapper">
            <ArrowRight2Icon size={16} />
          </div>
          <div
            className={clx('kux-mobile-picker__input', {
              'kux-mobile-picker__input--active': currentInput === 1,
            }, inputClassName)}
            onClick={() => onInputChange?.(1)}
          >
            {displayText[1]}
          </div>
        </div>
      );
    }

    // 单值模式
    return (
      <div className={clx('kux-mobile-picker__input-line', className)}>
        <div className={clx('kux-mobile-picker__input', inputClassName)}>
          {displayText[0]}
        </div>
      </div>
    );
  }
);

InputContainer.displayName = 'InputContainer';

export default InputContainer; 
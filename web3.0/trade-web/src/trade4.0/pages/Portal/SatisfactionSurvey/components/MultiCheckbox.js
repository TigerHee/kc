/**
 * Owner: harry.lai@kupotech.com
 */
import React, { memo } from 'react';
import clsx from 'classnames';
import { AnswerWrap } from './style';

const MultiCheckbox = ({ options, onChange, value = [] }) => {
  const handleChange = (checked, optionValue) => {
    if (checked) {
      return onChange(value.filter((v) => v !== optionValue));
    }
    onChange([...value, optionValue]);
  };

  return (
    <AnswerWrap>
      {options.map((item, idx) => {
        const { label, value: itemValue } = item;
        const isSelected = value.includes(itemValue);
        return (
          <div
            key={idx}
            className={clsx('item', isSelected && 'active')}
            onClick={() => handleChange(isSelected, itemValue)}
          >
            {label}
          </div>
        );
      })}
    </AnswerWrap>
  );
};

export default memo(MultiCheckbox);

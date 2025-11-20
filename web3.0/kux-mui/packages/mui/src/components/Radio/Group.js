/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import { RadioGroupContext } from 'context/index';
import useMergedState from 'hooks/useMergedState';
import { composeClassNames } from 'styles/index';
import classNames from 'clsx';
import Radio from './Radio';

import getRadioClassName from './className';

const useClassNames = (state) => {
  const { classNames: classNamesFromProps } = state;
  const slots = {
    group: ['group'],
  };
  return composeClassNames(slots, getRadioClassName, classNamesFromProps);
};

const RadioGroup = React.forwardRef((props, ref) => {
  const {
    options,
    disabled,
    children,
    id,
    onMouseEnter,
    onMouseLeave,
    radioType,
    size,
    onChange: onChangeFromProp,
    value: valueFromProp,
    defaultValue,
    className,
    ...others
  } = props;

  const _classNames = useClassNames({ ...others });

  const [value, setValue] = useMergedState(defaultValue, {
    value: valueFromProp,
  });

  const onChange = (event) => {
    const lastValue = value;
    const val = event.target.value;
    if (props.value === undefined) {
      setValue(val);
    }
    if (onChangeFromProp && val !== lastValue) {
      onChangeFromProp(event, event?.target?.value);
    }
  };

  const RenderRadioGroup = () => {
    let childrenToRender = children;
    if (options && options.length > 0) {
      childrenToRender = options.map((option) => {
        if (typeof option === 'string' || typeof option === 'number') {
          return (
            <Radio
              {...others}
              key={option.toString()}
              disabled={disabled}
              value={option}
              checked={value === option}
            >
              {option}
            </Radio>
          );
        }
        // 此处类型自动推导为 { label: string value: string }
        return (
          <Radio
            {...others}
            key={`KuFoxRadio-${option.value}`}
            disabled={option.disabled || disabled}
            value={option.value}
            checked={value === option.value}
          >
            {option.label}
          </Radio>
        );
      });
    }
    return (
      <div
        className={classNames(className, _classNames.group)}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        id={id}
        ref={ref}
        {...others}
      >
        {childrenToRender}
      </div>
    );
  };

  return (
    <RadioGroupContext.Provider
      value={{
        onChange,
        value,
        disabled: props.disabled,
        name: props.name,
        radioType,
        size,
      }}
    >
      {RenderRadioGroup()}
    </RadioGroupContext.Provider>
  );
});

RadioGroup.displayName = 'RadioGroup';

RadioGroup.propTypes = {
  defaultValue: PropTypes.any,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  options: PropTypes.array,
  value: PropTypes.any,
  onChange: PropTypes.func,
  radioType: PropTypes.oneOf(['radio', 'button']),
  size: PropTypes.oneOf(['small', 'middle', 'large']),
};

RadioGroup.defaultProps = {
  radioType: 'radio',
  disabled: false,
  size: 'middle',
};

export default RadioGroup;

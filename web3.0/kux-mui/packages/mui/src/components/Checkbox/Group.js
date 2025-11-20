/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { CheckBoxGroupContext } from 'context/index';
import classNames from 'clsx';
import { composeClassNames } from 'styles/index';
import useMergedState from 'hooks/useMergedState';
import PropTypes from 'prop-types';
import styled from 'emotion/index';
import Checkbox from './Checkbox';

import getCheckboxClassName from './classNames';

const GroupBox = styled.div``;

const useClassNames = (state) => {
  const { classNames: classNamesFromProps } = state;
  const slots = {
    group: ['group'],
  };
  return composeClassNames(slots, getCheckboxClassName, classNamesFromProps);
};

const CheckboxGroup = React.forwardRef(
  (
    {
      options,
      defaultValue,
      children,
      disabled,
      onChange,
      value: valueFromProps,
      name,
      className,
      classNames: classNamesFromProps,
      size,
      ...restProps
    },
    ref,
  ) => {
    const [value, setValue] = useMergedState(defaultValue, {
      value: valueFromProps,
      postState: (v) => v || [],
    });
    const [registeredValues, setRegisteredValues] = React.useState([]);

    const getOptions = React.useCallback(() => {
      return options.map((option) => {
        if (typeof option === 'string' || typeof option === 'number') {
          return {
            label: option,
            value: option,
          };
        }
        return option;
      });
    }, [options]);

    const _classNames = useClassNames({ classNames: classNamesFromProps });

    const cancelValue = (val) => {
      setRegisteredValues((prevValues) => prevValues.filter((v) => v !== val));
    };

    const registerValue = (val) => {
      setRegisteredValues((prevValues) => [...prevValues, val]);
    };

    const toggleOption = React.useCallback(
      (option) => {
        const optionIndex = value.indexOf(option.value);
        const newValue = [...value];
        if (optionIndex === -1) {
          newValue.push(option.value);
        } else {
          newValue.splice(optionIndex, 1);
        }
        if (valueFromProps === undefined) {
          setValue(newValue);
        }
        const opts = getOptions();
        onChange?.(
          newValue
            .filter((val) => registeredValues.indexOf(val) !== -1)
            .sort((a, b) => {
              const indexA = opts.findIndex((opt) => opt.value === a);
              const indexB = opts.findIndex((opt) => opt.value === b);
              return indexA - indexB;
            }),
        );
      },
      [getOptions, onChange, registeredValues, setValue, value, valueFromProps],
    );

    if (options && options.length > 0) {
      children = getOptions().map((option) => (
        <Checkbox
          isGroup
          key={option.value.toString()}
          disabled={'disabled' in option ? option.disabled : disabled}
          value={option.value}
          checked={value.indexOf(option.value) !== -1}
          onChange={option.onChange}
          style={option.style}
          classNames={classNames}
          size={size}
        >
          {option.label}
        </Checkbox>
      ));
    }

    const contextValue = React.useMemo(() => {
      return {
        toggleOption,
        value,
        disabled,
        name,
        registerValue,
        cancelValue,
      };
    }, [disabled, name, toggleOption, value]);

    return (
      <GroupBox className={classNames(className, _classNames.group)} ref={ref} {...restProps}>
        <CheckBoxGroupContext.Provider value={contextValue}>
          {children}
        </CheckBoxGroupContext.Provider>
      </GroupBox>
    );
  },
);

CheckboxGroup.displayName = 'CheckboxGroup';

CheckboxGroup.propTypes = {
  defaultValue: PropTypes.any,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  options: PropTypes.array,
  value: PropTypes.any,
  onChange: PropTypes.func,
  size: PropTypes.oneOf(['small', 'basic', 'large'])
};

CheckboxGroup.defaultProps = {
  options: [],
};

export default CheckboxGroup;

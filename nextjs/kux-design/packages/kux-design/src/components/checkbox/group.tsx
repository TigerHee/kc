import { forwardRef, useCallback, useMemo, useState, ReactNode } from 'react';
import { clsx } from '@/common';
import { useMergedState } from '@/hooks';
import { CheckBoxGroupContext } from './context';
import Checkbox from './checkbox';
import { ICheckboxOption, ICheckboxGroupProps, TValue } from './type';

export const CheckboxGroup = forwardRef<HTMLDivElement, ICheckboxGroupProps>((props, ref) => {
  const {
    options,
    defaultValue,
    children: childrenProp,
    disabled,
    onChange,
    value: valueFromProps,
    name,
    className,
    classNames,
    size,
  } = props;

  // 受控/非受控 value
  const [value, setValue] = useMergedState(defaultValue, {
    value: valueFromProps,
  });

  // 注册的 value 列表（用于排序和过滤）
  const [registeredValues, setRegisteredValues] = useState<TValue[]>([]);

  // 标准化 options
  const normalizedOptions = useMemo(() => {
    return (options || []).map((option) =>
      typeof option === 'string' || typeof option === 'number'
        ? { label: option, value: option }
        : option as ICheckboxOption
    );
  }, [options]);

  // 注册/注销 value
  const registerValue = useCallback((val: TValue) => {
    setRegisteredValues((prev) => prev.concat(val));
  }, []);
  const cancelValue = useCallback((val: TValue) => {
    setRegisteredValues((prev) => prev.filter((v) => v !== val));
  }, []);

  // 切换选项
  const toggleOption = useCallback(
    (option: { label: ReactNode; value: TValue }) => {
      const optionIndex = (value || []).indexOf(option.value);
      const newValue = [...(value || [])];
      if (optionIndex === -1) {
        newValue.push(option.value);
      } else {
        newValue.splice(optionIndex, 1);
      }
      if (typeof valueFromProps === 'undefined') {
        setValue(newValue);
      }
      // 保证顺序和过滤
      const filtered = newValue
        .filter((val) => registeredValues.includes(val))
        .sort(
          (a, b) =>
            normalizedOptions.findIndex((opt) => opt.value === a) -
            normalizedOptions.findIndex((opt) => opt.value === b)
        );
      onChange?.(filtered);
    },
    [value, valueFromProps, setValue, onChange, registeredValues, normalizedOptions]
  );

  // 渲染子项
  const children = useMemo(() => {
    if (normalizedOptions.length > 0) {
      return normalizedOptions.map((option) => (
        <Checkbox
          isGroup
          key={option.value.toString()}
          disabled={'disabled' in option ? option.disabled : disabled}
          value={option.value}
          checked={(value || []).includes(option.value)}
          onChange={option.onChange}
          style={option.style}
          classNames={classNames}
          size={size}
        >
          {option.label}
        </Checkbox>
      ));
    }
    return childrenProp;
  }, [normalizedOptions, disabled, value, classNames, size, childrenProp]);

  // context
  const contextValue = useMemo(
    () => ({
      toggleOption,
      value,
      disabled,
      name,
      registerValue,
      cancelValue,
    }),
    [toggleOption, value, disabled, name, registerValue, cancelValue]
  );

  return (
    <div className={clsx('kux-checkbox-group', className)} ref={ref}>
      <CheckBoxGroupContext.Provider value={contextValue}>
        {children}
      </CheckBoxGroupContext.Provider>
    </div>
  );
});

CheckboxGroup.displayName = 'CheckboxGroup';
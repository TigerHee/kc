/**
 * 表单类组件的公共逻辑
 */
import { useState, useRef, useCallback } from 'react';

export interface IInputSharedProps<T> {
  /**
   * 受控组件的值
   * 如果提供了 value，则组件为受控组件
   */
  value?: T;
  /**
   * 默认值
   * 如果没有提供 value，则使用 defaultValue 作为初始值
   * 注意：如果同时提供了 value 和 defaultValue，则组件仍然是受控的
   */
  defaultValue?: T;
  /**
   * 变化时的回调函数
   * 当输入值改变时触发
   */
  onChange?: (value: T) => void;
  /**
   * 是否禁用组件
   * 如果为 true，则组件不可交互
   */
  disabled?: boolean;
}



export function useFormInput<T>(props: IInputSharedProps<T>) {
  const { value, defaultValue, onChange, disabled } = props;
  const optionsRef = useRef({
    onChange,
    disabled,
  });
  optionsRef.current = { onChange, disabled };
  const [internalValue, setInternalValue] = useState<T | undefined>(defaultValue);

  const handleChange = useCallback((newValue: T) => {
    if (!optionsRef.current.disabled) {
      setInternalValue(newValue);
      optionsRef.current.onChange?.(newValue);
    }
  }, []);

  return {
    value: value !== undefined ? value : internalValue,
    onChange: handleChange,
    disabled,
  };
}

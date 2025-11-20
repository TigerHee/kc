import React from 'react';
import { clsx } from '@/common';
import { useMergedState } from '@/hooks';

export interface IBaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (event: {
    target: any;
    stopPropagation: () => void;
    preventDefault: () => void;
    nativeEvent: Event;
  }) => void;
}

export const BaseInput = React.forwardRef<HTMLInputElement, IBaseInputProps>((props, ref) => {
  const {
    name,
    id,
    type,
    disabled,
    readOnly,
    tabIndex,
    onClick,
    onFocus,
    onBlur,
    onKeyDown,
    onKeyPress,
    onKeyUp,
    value,
    required,
    onChange,
    ...others
  } = props;
  const [checked, setChecked] = useMergedState(props.defaultChecked, {
    value: props.checked,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }
    const newChecked = event.target.checked;
    if (!('checked' in props)) {
      setChecked(newChecked);
    }
    if (onChange) {
      onChange({
        target: {
          ...props,
          checked: newChecked,
        },
        stopPropagation() {
          event.stopPropagation();
        },
        preventDefault() {
          event.preventDefault();
        },
        nativeEvent: event.nativeEvent,
      });
    }
  };

  const globalProps = Object.keys(others).reduce<Record<string, any>>((prev, key) => {
    if (key.startsWith('aria-') || key.startsWith('data-') || key === 'role') {
      prev[key] = (others as any)[key];
    }
    return prev;
  }, {});

  return (
    <input
      className={clsx(props.className)}
      name={name}
      ref={ref}
      id={id}
      type={type}
      required={required}
      readOnly={readOnly}
      disabled={disabled}
      tabIndex={tabIndex}
      checked={!!checked}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}
      onKeyPress={onKeyPress}
      onChange={handleChange}
      {...(type === 'checkbox' && value === undefined ? {} : { value })}
      {...others}
      {...globalProps}
    />
  );
});

BaseInput.displayName = 'BaseInput';
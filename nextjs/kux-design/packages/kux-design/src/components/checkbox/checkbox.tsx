/**
 * Owner: sean.shi@kupotech.com
 * @description CheckBox component
 */

import React, { ReactNode, useRef, useEffect, useContext, CSSProperties } from 'react';
import { clsx } from '@/common';
import { composeRef } from './tools';
import { CheckBoxGroupContext } from './context';
import { CheckBoxBase } from './base';
import './style.scss';

interface ICheckboxProps {
  children?: ReactNode;
  isGroup?: boolean;
  classNames?: {
    wrapper?: string;
    checkbox?: string;
    input?: string;
    inner?: string;
  };
  style?: CSSProperties;
  className?: string;
  value?: any;
  disabled?: boolean;
  name?: string;
  onChange?: (...args: any[]) => void;
  checked?: boolean;
  defaultChecked?: boolean;
  checkOptions?: object;
  size?: 'basic' | 'small' | 'large';
}

const Checkbox = React.forwardRef<HTMLInputElement, ICheckboxProps>((props, ref) => {
  const {
    children,
    isGroup,
    classNames: classNames,
    className,
    value,
    ...restProps
  } = props;
  const innerRef = useRef<HTMLInputElement>(null);
  const mergedRef = composeRef(ref, innerRef);
  const context = useContext(CheckBoxGroupContext);
  const contextRef = useRef(context);
  contextRef.current = context;

  const prevValue = useRef(value);

  useEffect(() => {
    contextRef.current?.registerValue(value);
  }, [value]);

  useEffect(() => {
    if (value !== prevValue.current) {
      contextRef.current?.cancelValue(prevValue.current);
      contextRef.current?.registerValue(value);
      prevValue.current = value;
    }
    return () => contextRef.current?.cancelValue(value);

  }, [value]);

  const checkboxProps = { ...restProps };

  if (context) {
    checkboxProps.onChange = (...arg: any[]) => {
      if (restProps.onChange) {
        restProps.onChange(...arg);
      }
      if (context.toggleOption) {
        context.toggleOption({ label: children, value });
      }
    };
    checkboxProps.name = context.name;
    checkboxProps.checked = context.value?.indexOf(value) !== -1;
    checkboxProps.disabled = restProps.disabled || context.disabled;
  }

  return (
    <label
      className={clsx(
        'kux-checkbox-wrapper',
        {
          'kux-checkbox-wrapper-group': isGroup,
          'kux-checkbox-wrapper-checked': checkboxProps.checked,
          'kux-checkbox-wrapper-disabled': checkboxProps.disabled,
        },
        className,
      )}
    >
      <CheckBoxBase
        {...checkboxProps}
        classNames={clsx(
          classNames?.checkbox,
        )}
        ref={mergedRef}
        value={value}
      />
      {children !== undefined ? <span className="kux-checkbox-text-wrap">{children}</span> : null}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;

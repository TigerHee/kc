/**
 * Owner: jacky.zhou@kupotech.com
 *
 * @description Input component
 */

import './style.scss';
import { IInputProps } from './type';
import { forwardRef, useRef, useState } from 'react';
import { clsx } from '@/common';
import { InputLabel } from './components/label';
import { InputBorder } from './components/border';
import { isNullValue, resolveOnChange } from '@/common/input';
import { InputPrefix } from './components/prefix';
import { InputSuffixBox } from './components/suffix';
import { useMergedState } from '@/components/input/hooks/useMergedState';
import { useForkRef } from '@/components/input/hooks/useForkRef';
import { StatusInfo } from './components/status-info';
import { useDir } from '@/hooks';

/**
 * Input component
 */
export const Input = forwardRef<HTMLInputElement, IInputProps>(function Com(props, ref) {
  const [value, setValue] = useMergedState(props.defaultValue, {
    value: props.value,
  });
  const [focus, setFocus] = useState(false);
  const [pwsType, setPwsType] = useState(props.type === 'password');

  const dir = useDir();
  const rtl = dir === 'rtl';

  const inputRef = useRef<HTMLInputElement | null>(null);
  const forkRef = useForkRef(inputRef, ref);

  const labelFloat = getLabelFloat({ ...props, focus });

  const containerCls = getContainerCls({ ...props, focus, rtl });
  const coreCls = getCoreCls(props);
  const filedCls = getFieldCls(props);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange?.(e);
  };

  const onClear = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (inputRef.current) {
      setValue('');
      inputRef.current.focus();
      resolveOnChange(inputRef.current, e, props.onChange);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (props.onEnterPress && e.key === 'Enter') {
      props.onEnterPress(e);
    }
    if (props.onKeyDown) {
      props.onKeyDown(e);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    props.onKeyUp?.(e);
  };

  /**
   * TODO
   * 1. 支持 number 类型
   * 2. 千分位，如果要千分位，则需要展示和 value 分离
   * 3. 数字步长加减
   */

  return (
    <div className={containerCls}>
      {props.labelProps?.position === 'outline' ? (
        <InputLabel
          type={props.type}
          size={props.size}
          position="outline"
          htmlFor={props.name}
          className={props.labelProps.className}
          style={props.labelProps.style}
        >
          {props.label}
        </InputLabel>
      ) : null}
      <div className={coreCls} style={props.style}>
        <InputBorder type={props.type} {...props.labelProps} float={labelFloat}>
          {props.label}
        </InputBorder>
        {props.labelProps?.position !== 'outline' ? (
          <InputLabel
            type={props.type}
            size={props.size}
            position="inline"
            htmlFor={props.name}
            float={labelFloat}
            className={props.labelProps?.className}
            style={props.labelProps?.style}
          >
            {props.label}
          </InputLabel>
        ) : null}
        <InputPrefix type={props.type} size={props.size}>
          {props.prefix}
        </InputPrefix>
        <input
          ref={forkRef}
          id={props.name}
          name={props.name}
          type={getType({ ...props, pwsType })}
          disabled={props.disabled}
          className={filedCls}
          placeholder={props.placeholder}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onFocus={(e) => {
            props.onFocus?.(e);
            setFocus(true);
          }}
          onBlur={(e) => {
            props.onBlur?.(e);
            setFocus(false);
          }}
          {...props.inputProps}
        />
        <InputSuffixBox
          suffix={props.suffix}
          addonAfter={props.addonAfter}
          size={props.size}
          type={props.type}
          loading={props.loading}
          pwsType={pwsType}
          allowClear={props.allowClear && !isNullValue(value)}
          reverseSuffix={props.reverseSuffix}
          onClear={onClear}
          onPwsStatusChange={setPwsType}
        />
      </div>
      <StatusInfo type={props.type} size={props.size} error={props.error} disabled={props.disabled}>
        {props.statusInfo}
      </StatusInfo>
    </div>
  );
});

function getContainerCls(
  props: IInputProps & {
    focus: boolean;
    rtl: boolean;
  },
) {
  const classname = clsx('kux-input', {
    'kux-input-rtl': props.rtl,
    'kux-input-disable': props.disabled,
    'kux-input-error': props.error && !props.disabled,
    'kux-input-focus': props.focus,
  });

  return classname;
}

function getCoreCls(props: IInputProps) {
  const classname = clsx(
    'kux-input-core',
    {
      'kux-input-small': props.size === 'small',
      'kux-input-search': props.type === 'search',
      'kux-input-search-small': props.type === 'search' && props.size === 'small',
      'kux-input-search-mini': props.type === 'search' && props.size === 'mini',
      'kux-input-search-mini-allowclear':
        props.type === 'search' && props.size === 'mini' && props.allowClear,
      'kux-input-pwd': props.type === 'password',
    },
    props.className,
  );

  return classname;
}

function getFieldCls(props: IInputProps) {
  const classname = clsx('kux-input-filed', {
    'kux-input-filed-small': props.size === 'small',
    'kux-input-filed-search-small': props.type === 'search' && props.size === 'small',
    'kux-input-filed-search-mini': props.type === 'search' && props.size === 'mini',
  });

  return classname;
}

function getType(props: IInputProps & { pwsType: boolean }) {
  if (props.type === 'password') {
    if (props.pwsType) return 'password';
    return 'text';
  }
  return props.type;
}

function getLabelFloat(props: IInputProps & { focus: boolean }) {
  const float =
    (!isNullValue(props.value) ||
      props.placeholder != null ||
      props.prefix != null ||
      props.error ||
      props.focus ||
      props.labelProps?.shrink) &&
    props.type !== 'search' &&
    props.labelProps?.position !== 'outline' &&
    !isNullValue(props.label);

  return float;
}

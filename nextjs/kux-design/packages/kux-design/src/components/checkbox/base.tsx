import React from 'react';
import { clsx } from '@/common';
import { useMergedState } from '@/hooks';
import { HookIcon } from '@kux/iconpack';
import { BaseInput } from './base-input';

export interface ICheckBoxBaseProps {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  classNames: string;
  size?: 'small' | 'basic' | 'large';
  checked?: boolean;
  defaultChecked?: boolean;
  value?: string;
}

export const CheckBoxBase = React.forwardRef<HTMLInputElement, ICheckBoxBaseProps>((props, ref) => {
  const {
    onChange,
    classNames,
    size = 'small',
    ...others
  } = props;
  const [checked, setChecked] = useMergedState(props.defaultChecked, {
    value: props.checked,
  });

  const handleChange = (event: { target: any; stopPropagation: () => void; preventDefault: () => void; nativeEvent: Event; }) => {
    const newChecked = event.target.checked;
    if (!('checked' in props)) {
      setChecked(newChecked);
    }
    if (onChange) {
      // Create a synthetic React.ChangeEvent if needed, or just pass the event as is
      onChange(event as any);
    }
  };

  const innerClass = clsx(
    'kux-checkbox-inner',
    size && `kux-checkbox-inner-${size}`,
    {
      'kux-checkbox-inner-checked': !!checked,
    }
  );

  return (
    <span className={clsx('kux-checkbox', classNames)}>
      <BaseInput
        {...others}
        className={clsx('kux-checkbox-input')}
        ref={ref}
        onChange={handleChange}
        type="checkbox"
      />
      <span
        className={innerClass}
      >
        {checked && <HookIcon className='kux-checkbox-inner-icon' />}
      </span>
    </span>
  );
});

CheckBoxBase.displayName = 'CheckBoxBase';
import { clx } from '@/common/style';
import { DatePickerSize } from '../types';

interface ClassNameProps {
  size: DatePickerSize;
  error: boolean;
  disabled: boolean;
  inFocus: boolean;
  shrink: boolean;
  className?: string;
  labelProps?: { className?: string };
  popupClassName?: string;
  dropdownClassName?: string;
  picker?: string;
  allowClear?: boolean;
}

export function getDatePickerClassNames({
  size,
  error,
  disabled,
  inFocus,
  shrink,
  className,
  labelProps,
  popupClassName,
  dropdownClassName,
  picker,
  allowClear
}: ClassNameProps) {
  return {
    container: clx(
      'kux-date-picker',
      `kux-date-picker--${size}`,
      {
        'kux-date-picker--error': error,
        'kux-date-picker--disabled': disabled,
      },
      className
    ),
    wrapper: clx(
      'kux-date-picker__wrapper',
      {
        'kux-date-picker__allow-clear': allowClear,
        'kux-date-picker__wrapper--focused': inFocus,
        'kux-date-picker__wrapper--disabled': disabled,
      }
    ),
    label: clx(
      'kux-date-picker__label',
      {
        'kux-date-picker__label--shrink': shrink,
        'kux-date-picker__label--error': error,
        'kux-date-picker__label--disabled': disabled,
        'kux-date-picker__label--focused': inFocus,
      },
      labelProps?.className
    ),
    fieldset: clx(
      'kux-date-picker__fieldset',
      {
        'kux-date-picker__fieldset--error': error,
        'kux-date-picker__fieldset--focused': inFocus,
      }
    ),
    legend: clx(
      'kux-date-picker__legend',
      {
        'kux-date-picker__legend--shrink': shrink,
      }
    ),
    dropdown: clx(
      'kux-date-picker__dropdown',
      {
        'kux-date-picker__dropdown--time': picker === 'time',
      },
      popupClassName,
      dropdownClassName
    ),
  };
} 
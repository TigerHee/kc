import { clx } from '@/common/style';
import { RangePickerSize } from '../types';

interface ClassNameProps {
  size: RangePickerSize;
  error: boolean;
  disabled: boolean;
  inFocus: boolean;
  shrink: boolean;
  className?: string;
  labelProps?: { className?: string };
  popupClassName?: string;
  dropdownClassName?: string;
  allowClear?: boolean;
}

export function getRangePickerClassNames({
  size,
  error,
  disabled,
  inFocus,
  shrink,
  className,
  labelProps,
  popupClassName,
  dropdownClassName,
  allowClear,
}: ClassNameProps) {
  return {
    container: clx(
      'kux-range-picker',
      `kux-range-picker--${size}`,
      {
        'kux-range-picker--error': error,
        'kux-range-picker--disabled': disabled,
      },
      className
    ),
    wrapper: clx(
      'kux-range-picker__wrapper',
      {
        'kux-range-picker__allow-clear': allowClear,
        'kux-range-picker__wrapper--focused': inFocus,
        'kux-range-picker__wrapper--disabled': disabled,
      }
    ),
    label: clx(
      'kux-range-picker__label',
      {
        'kux-range-picker__label--shrink': shrink,
        'kux-range-picker__label--error': error,
        'kux-range-picker__label--disabled': disabled,
        'kux-range-picker__label--focused': inFocus,
      },
      labelProps?.className
    ),
    fieldset: clx(
      'kux-range-picker__fieldset',
      {
        'kux-range-picker__fieldset--error': error,
        'kux-range-picker__fieldset--focused': inFocus,
      }
    ),
    legend: clx(
      'kux-range-picker__legend',
      {
        'kux-range-picker__legend--shrink': shrink,
      }
    ),
    dropdown: clx(
      'kux-range-picker__dropdown',
      popupClassName,
      dropdownClassName
    ),
  };
} 
import React from 'react';
import momentGenerateConfig from 'rc-picker/es/generate/moment';
import en_US from '@/config/locale/picker/en_US';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CloseFilledIcon,
  DoubleLeftIcon,
  DoubleRightIcon,
  ArrowDownIcon,
} from '@kux/iconpack';
import { RangePickerProps } from '../types';

export function useCommonProps(props: RangePickerProps) {
  const { onChange, format, value, inFocus, disabled, allowClear, ...resetProps } = props;

  return React.useMemo(() => {
    const clearIcon = (
      <div className="kux-range-picker__icon kux-range-picker__icon--clear">
        <CloseFilledIcon size={16} color='var(--kux-icon40)' />
      </div>
    );

    const suffixIcon = (
      <ArrowDownIcon
        size={20}
        color={disabled ? 'var(--kux-cover20)' : 'var(--kux-text)'}
        style={{
          transition: 'all .3s ease',
          transform: inFocus ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      />
    );

    return {
      onChange,
      format,
      value,
      generateConfig: momentGenerateConfig,
      locale: en_US,
      popupClassName: 'kux-date-picker__dropdown',
      allowClear: allowClear && { clearIcon },
      superPrevIcon: <DoubleLeftIcon size={16} color='var(--kux-icon60)' />,
      superNextIcon: <DoubleRightIcon size={16} color='var(--kux-icon60)' />,
      prevIcon: <ArrowLeftIcon size={16} color='var(--kux-icon60)' />,
      nextIcon: <ArrowRightIcon size={16} color='var(--kux-icon60)' />,
      suffixIcon,
      ...resetProps,
    };
  }, [props]);
} 
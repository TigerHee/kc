import { Moment } from 'moment';
import React from 'react';

export interface BasePickerProps {
  show?: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onOk?: (date: Moment | Moment[]) => void;
  title?: React.ReactNode;
  cancelText?: string;
  okText?: string;
  cancelButtonProps?: Record<string, any>;
  okButtonProps?: Record<string, any>;
  footerProps?: Record<string, any>;
  drawerProps?: Record<string, any>;
  format?: string;
  className?: string;
  style?: React.CSSProperties;
}

export interface DatePickerProps extends BasePickerProps {
  value?: Moment;
  defaultValue?: Moment;
  onChange?: (date: Moment) => void;
  minDate?: Moment;
  maxDate?: Moment;
  mode?: 'date';
  use24Hours?: boolean;
  use12Hours?: boolean;
}

export interface TimePickerProps extends BasePickerProps {
  value?: Moment;
  defaultValue?: Moment;
  onChange?: (date: Moment) => void;
  onValueChange?: (date: Moment) => void;
}

export interface RangePickerProps extends BasePickerProps {
  value?: [Moment, Moment];
  defaultValue?: [Moment, Moment];
  onChange?: (dates: [Moment, Moment]) => void;
  renderExtraHeader?: React.ReactNode | ExtraHeaderItem[];
  minDate?: [Moment, Moment];
  maxDate?: [Moment, Moment];
  mode?: 'date';
  use12Hours?: boolean;
}

export interface ExtraHeaderItem {
  code: string;
  label: string;
  range: [Moment, Moment];
  index: number;
  selected?: boolean;
}

export interface InputContainerProps {
  theme?: any;
  value?: Moment | [Moment, Moment];
  defaultValue?: Moment | [Moment, Moment];
  format?: string;
  currentInput?: number;
  onInputChange?: (index: number) => void;
  className?: string;
  inputClassName?: string;
}

export interface ExtraHeaderProps {
  renderExtraHeader?: React.ReactNode | ExtraHeaderItem[];
  onChange?: (dates: [Moment, Moment]) => void;
  format?: string;
}

export interface MobilePickerProps {
  DatePicker: React.ComponentType<DatePickerProps>;
  TimePicker: React.ComponentType<TimePickerProps>;
  RangePicker: React.ComponentType<RangePickerProps>;
} 
import { Moment } from 'moment';
import { PickerProps } from 'rc-picker';

export type DatePickerSize = 'small' | 'medium' | 'large' | 'xlarge';
export type DatePickerMode = 'time' | 'date' | 'week' | 'month' | 'year';

export interface LabelProps {
  shrink?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface DatePickerProps extends Omit<PickerProps<Moment>, 'generateConfig' | 'locale' | 'onChange' | 'getPopupContainer'> {
  size?: DatePickerSize;
  disabled?: boolean;
  format?: string;
  error?: boolean;
  defaultValue?: Moment;
  value?: Moment;
  placeholder?: string;
  width?: number;
  label?: string;
  labelProps?: LabelProps;
  onChange?: (date: Moment | null, dateString: string) => void;
  onSelect?: (date: Moment) => void;
  disabledDate?: (date: Moment) => boolean;
  picker?: DatePickerMode;
  allowClear?: boolean;
  popupClassName?: string;
  dropdownClassName?: string;
  className?: string;
  style?: React.CSSProperties;
  inFocus?: boolean;
  getPopupContainer?: () => HTMLElement | null;
  defaultPickerValue?: Moment;
  defaultExtraFooterLocale?: string;
} 
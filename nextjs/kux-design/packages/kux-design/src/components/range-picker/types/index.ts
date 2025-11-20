import { Moment } from 'moment';
import { RangePickerProps as RcRangePickerProps } from 'rc-picker';

export type RangePickerSize = 'small' | 'medium' | 'large' | 'xlarge';

export interface LabelProps {
  shrink?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface ExtraFooterItem {
  code: string;
  label: string;
  range: [Moment, Moment];
  selected?: boolean;
}

export interface RangePickerProps extends Omit<RcRangePickerProps<Moment>, 
  'generateConfig' | 
  'locale' | 
  'onChange' | 
  'getPopupContainer' | 
  'defaultValue' | 
  'value' | 
  'placeholder' | 
  'renderExtraFooter' | 
  'onPanelChange'
> {
  size?: RangePickerSize;
  disabled?: boolean;
  format?: string;
  error?: boolean;
  defaultValue?: [Moment, Moment];
  value?: [Moment, Moment];
  placeholder?: string | [string, string];
  label?: string;
  labelProps?: LabelProps;
  onChange?: (dates: [Moment, Moment] | null, dateStrings: [string, string]) => void;
  onSelect?: (dates: [Moment, Moment]) => void;
  disabledDate?: (date: Moment) => boolean;
  separator?: string;
  width?: number;
  renderExtraFooter?: React.ReactNode | ExtraFooterItem[] | (() => React.ReactNode);
  onPanelChange?: (dates: [Moment, Moment], modes: [string, string]) => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  popupClassName?: string;
  dropdownClassName?: string;
  className?: string;
  style?: React.CSSProperties;
  inFocus?: boolean;
  getPopupContainer?: () => HTMLElement | null;
  defaultPickerValue?: [Moment, Moment];
  defaultExtraFooterLocale?: string;
  allowClear?: boolean;
} 
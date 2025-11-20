import { Moment } from 'moment';

declare interface RangePickerProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  disabled?: boolean;
  format?: string;
  error?: boolean;
  defaultValue?: Moment[];
  value?: Moment[];
  placeholder?: string[];
  onChange?: (dates: Moment[]) => void;
  separator?: string;
  width?: number;
  disabledDate?: (date: Moment) => boolean;
  popupClassName?: string;
  dropdownClassName?: string;
}
declare class RangePicker extends React.Component<RangePickerProps> {
  static defaultProps: {
    size: 'medium';
    disabled: false;
    format: 'DD/MM/YYYY';
    error: false;
    defaultValue: undefined;
    placeholder: [];
    separator: '-';
  };
}
export default RangePicker;

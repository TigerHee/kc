import { Moment } from 'moment';

declare module 'DatePicker' {
  export interface LabelProps {
    shrink?: boolean;
  }
  export interface DatePickerProps {
    size?: 'small' | 'medium' | 'large' | 'xlarge';
    disabled?: boolean;
    format?: string;
    error?: boolean;
    defaultValue?: Moment;
    value?: Moment;
    placeholder?: string;
    width?: number;
    label?: string;
    labelProps?: LabelProps;
    onChange?: (date: Moment) => void;
    onSelect?: (date: Moment) => void;
    disabledDate?: (date: Moment) => void;
    picker?: 'time' | 'date' | 'week' | 'month' | 'year';
    allowClear?: true;
    popupClassName?: string;
    dropdownClassName?: string;
  }
  export class DatePicker extends React.Component<DatePickerProps, any> {}
}
export default DatePicker;

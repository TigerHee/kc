import DateTimeFormatUtil from 'utils/dateTimeFormat';

export default function DateTimeFormat({ children, ...props }) {
  return DateTimeFormatUtil({ ...props, date: children });
}

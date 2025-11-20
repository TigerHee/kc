import NumberFormatUtil from 'utils/numberFormat';

export default function NumberFormat({ children, ...props }) {
  return NumberFormatUtil({ ...props, number: children });
}

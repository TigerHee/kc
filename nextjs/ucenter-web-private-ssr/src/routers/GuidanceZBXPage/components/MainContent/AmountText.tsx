/**
 * Owner: john.zhang@kupotech.com
 */

import { NumberFormat } from '@kux/mui';
import styles from './AmountText.module.scss';

interface AmountTextProps {
  value: string | number;
}

const AmountText: React.FC<AmountTextProps> = ({ value }) => {
  return (
    <div className={styles.amountComponent}>
      <NumberFormat>{value}</NumberFormat>
    </div>
  );
};

export default AmountText;

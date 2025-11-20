/**
 * Owner: john.zhang@kupotech.com
 */

import CoinIcon from 'src/components/common/CoinIcon';
import styles from './CoinDisplay.module.scss';

interface CoinDisplayProps {
  currency: string;
}

const CoinDisplay: React.FC<CoinDisplayProps> = ({ currency }) => {
  return (
    <div className={styles.coinBox}>
      {currency && <CoinIcon className={styles.styledCoinIcon} coin={currency} persist />}
      {currency}
    </div>
  );
};

export default CoinDisplay;

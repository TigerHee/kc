/**
 * Owner: john.zhang@kupotech.com
 */

import CoinIcon from 'src/components/common/CoinIcon';
import { useSelector } from 'src/hooks/useSelector';
import styles from './CoinDisplay.module.scss';

interface CoinDisplayProps {
  currency: string;
}

const CoinDisplay: React.FC<CoinDisplayProps> = ({ currency }) => {
  const categories = useSelector((state: any) => state.categories);
  const coin = categories?.[currency];

  return currency ? (
    <div className={styles.coinBox}>
      <CoinIcon className={styles.styledCoinIcon} coin={currency} persist />
      <div className={styles.coinTextBox}>
        <div className={styles.coinTitle}>{currency}</div>
        {coin?.name ? <div className={styles.coinFullName}>{coin.name}</div> : null}
      </div>
    </div>
  ) : null;
};

export default CoinDisplay;

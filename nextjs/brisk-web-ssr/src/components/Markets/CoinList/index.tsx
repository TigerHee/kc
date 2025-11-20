/**
 * Owner: tiger@kupotech.com
 */
import type { CoinItem } from '@/types/coin';
import CoinListItemCard from './CoinListItemCard';
import styles from './styles.module.scss';

interface CoinListProps {
  title: string;
  list: CoinItem[];
  track: string;
  style?: React.CSSProperties;
  isShowInView?: boolean;
}

const CoinList = ({ title, list, track, style, isShowInView = true }: CoinListProps) => {
  return (
    <div className={styles.coinList} style={style}>
      {isShowInView ? (
        <>
          <div className={styles.coinListTitle}>{title}</div>
          <div className={styles.coinListContent}>
            {list.map((item, index) => {
              return <CoinListItemCard key={item.currencyCode} item={item} index={index} track={track} />;
            })}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default CoinList;

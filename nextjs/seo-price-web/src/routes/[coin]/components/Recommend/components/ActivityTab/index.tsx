/**
 * Owner: will.wang@kupotech.com
 */
import { useCoinDetailStore } from '@/store/coinDetail';
import ActivityItem from './ActivityItem';
import styles from './index.module.scss';

const defaultTabs = [];

const ActivityTab = () => {
  const questInfos = useCoinDetailStore(
    (state) => state.coinInfo.currencyReferenceRecommend?.questInfos || defaultTabs,
  );
  return (
    <ul className={styles.wrapper}>
      {(questInfos || []).map((item) => (
        <li key={item.id}>
          <ActivityItem info={item} key={item.id} />
        </li>
      ))}
    </ul>
  );
};

export default ActivityTab;
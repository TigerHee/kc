/**
 * Owner: will.wang@kupotech.com
 */
import { saTrackForBiz } from '@/tools/ga';
import FAQ from './components/FAQ';
import Header from './components/Header';
import TabBar from './components/TabBar';
import styles from './styles.module.scss';
import { useMount } from 'ahooks';


/**
 *  payload:
 *    keyName: algorithm
 *      topList: INCREASE, // 涨幅榜; top-gainer
        hotCoins: HOT_CURRENCY, // 热币榜; hot-list
        newCoins: NEW_CURRENCY, // 新币列表; new-coins
 */
const IndexPageLayout = (props: any) => {
  useMount(() => {
    saTrackForBiz({}, ['BScoinPrice', ['View', '1']]);
  });

  return (
    <div className={styles.priceAllBoxWrap}>
      <Header />
      <div className={styles.priceAllMain}>
        <FAQ />
        <div className={styles.priceAllList}>
          <TabBar />
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default IndexPageLayout;

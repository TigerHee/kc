import { useEffect, useState } from 'react';
import CoinList from './CoinList';
import { tabsConfig } from './config';
import { usePriceStore } from '@/store/price';
import { useRouter } from 'kc-next/compat/router';
import { saTrackForBiz } from '@/tools/ga';
import styles from './style.module.scss';
import Title from '@/components/common/Title';
import { Tab, Tabs } from '@/components/common/Tab';
import useTranslation from '@/hooks/useTranslation';
import { useMount } from 'ahooks';


const CoinRank = () => {
  const [select, setSelect] = useState<any>(tabsConfig[0]);
  const rankList = usePriceStore((state) => state.overViewList);
  const mainCoinList = usePriceStore((state) => state.mainCoinList);
  const getMainCoinList = usePriceStore((state) => state.getMainCoinList);
  const getRankingOverViewForRanking = usePriceStore((state) => state.getRankingOverViewForRanking);

  const router = useRouter();
  const coin = router?.query.coin;

  const { _t } = useTranslation();

  
  useMount(() => {
    const param = {
      currentPage: 1,
      pageSize: 10,
      sortField: 'marketValue',
      sortType: 'DESC' as any,
      tabType: 'ALL_CURRENCY' as any,
      subCategory: 'all',
    };
    getMainCoinList(param);
    getRankingOverViewForRanking();
  });

  useEffect(() => {
    if (select?.trackId && coin) {
      saTrackForBiz({}, ['OLabelPopup', select?.trackId], {
        symbol: coin,
      });
    }
  }, [select, coin]);

  return (
    tabsConfig.length > 0 && (
      <section className={styles.wrapper} data-inspector="price-coin-rank" id="price-coin-rank">
        <header>
          <Title title={_t('t5ompQt7jkRntJHe1gLrT5')} className={styles.cardTitle}/>
        </header>
        <Tabs className={styles.extendTabs}>
          {tabsConfig.map((item) => (
            <Tab
              className={styles.extendTab}
              key={item?.value}
              active={select?.value === item?.value}
              onClick={() => setSelect(item)}
            >
              {_t(item.title)}
            </Tab>
          ))}
        </Tabs>
        <CoinList list={select.value === 'price_main' ? mainCoinList : rankList[select.value]} />
      </section>
    )
  );
};

export default CoinRank;
/**
 * Owner: kevyn.yu@kupotech.com
 */
import { isEmpty } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

import ActivityTab from './components/ActivityTab';
import FastBuyTab from './components/FastBuyTab';
import KucoinEarnTab from './components/KucoinEarnTab';
import TradingBotTab from './components/TradingBotTab';

import Title from '@/components/common/Title';
import { useRouter } from 'kc-next/compat/router';
import { useCoinDetailStore } from '@/store/coinDetail';
import useTranslation from '@/hooks/useTranslation';
import { saTrackForBiz } from '@/tools/ga';
import { Tab, Tabs } from '@/components/common/Tab';
import styles from './style.module.scss';

// 当前只有7个币种默认选中“购买”tab，其余的币种均默认选中“交易”tab
const whiteList = ['BTC', 'PAX', 'ETH', 'USDT', 'USDC', 'KCS', 'CADH'];

const Recommend = () => {
  const router = useRouter();
  const coin = router?.query.coin;
  const [select, setSelect] = useState<any>();

  const { _t } = useTranslation();

  const coinInfo = useCoinDetailStore((state) => state.coinInfo);
  const { currencyReferenceRecommend, coinName = '' } = coinInfo;

  const tabs = useMemo(() => {
    return [
      {
        id: 0,
        title: _t('rE35tTBD2FUMmhtsBF6xnv'), // 0 Activity
        component: ActivityTab,
        hide: isEmpty(currencyReferenceRecommend?.questInfos),
      },
      {
        id: 1,
        title: _t('mepA1zHusguUCLY9MEiMkk'), // 1 Trading Bot
        component: TradingBotTab,
        hide:
          isEmpty(currencyReferenceRecommend?.spotGrid) &&
          isEmpty(currencyReferenceRecommend?.contractGrid),
      },
      {
        id: 2,
        title: _t('2SnL4koe8sptDVmnMg98P6'), // 2 Kucoin Earn
        component: KucoinEarnTab,
        hide: isEmpty(currencyReferenceRecommend?.poolStakingProducts),
      },
      {
        id: 3,
        title: _t('o993CqA3GV6Mziex1pDt4B'), // 3 Fast buy
        component: FastBuyTab,
        hide: !whiteList.includes(coin as string),
      },
    ];
  }, [_t, coin, currencyReferenceRecommend]);

  

  const filteredTabs = useMemo(() => tabs.filter((item) => !item.hide), [tabs]);

  useEffect(() => {
    setSelect(filteredTabs[0]);
  }, [filteredTabs]);
  const TabContent = tabs[select?.id]?.component;

  useEffect(() => {
    saTrackForBiz({}, ['RecommendTab', `${select?.id + 1}`], {
      symbol: coin,
    });
  }, [select, coin]);
  return (
    !!filteredTabs.length && (
      <section className={styles.wrapper}>
        <header>
          <Title className={styles.extendedTitle} title={_t('09e15492c8694000aa76', { tokenName: coinName })} />
        </header>
        <Tabs>
          {filteredTabs.map((item) => (
            <Tab
              key={item.title}
              active={select?.id === item.id}
              onClick={() => setSelect(item)}
            >
              {item.title}
            </Tab>
          ))}
        </Tabs>
        {!!TabContent && <TabContent />}
      </section>
    )
  );
};

export default Recommend;
import { useEffect, useMemo, useRef } from 'react';
import { useResponsive } from '@kux/design';
import { useCompliantShow } from 'gbiz-next/compliantCenter';
import { ArrowRight2Icon } from '@kux/iconpack';
import { useCoinRankStateStore } from '@/store/coinRank';
import { addLangToPath } from '@/tools/i18n';
import { useConfigStore } from '@/store/config';
import useTranslation from '@/hooks/useTranslation';
import CoinList from './CoinList';
import PagerShow from './PagerShow';
import { TRACK_TYPE } from './config';
import styles from './styles.module.scss';
import AnimatedContent from '../CommonComponents/Animations/AnimatedContent';
import { calculateDelayTime } from '../CommonComponents/Animations/AnimatedContent/utils';

export default () => {
  const { t } = useTranslation();
  const { setCoinList, newCoins, hotCoins, topList, setRecentActivePrefix, comingList } = useCoinRankStateStore();
  const rs = useResponsive();
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // 是否展示待上线新币
  const isShowComing = useCompliantShow('compliance.homepage.newCoin.1');

  const configItems = useConfigStore(store => store.configItems);

  const isH5 = rs === 'sm';
  const isLg = rs === 'md';

  useEffect(() => {
    // 组件挂载时获取数据
    setCoinList('NEW_CURRENCY');
    setCoinList('HOT_SEARCH');
    setCoinList('INCREASE');
    if (isShowComing) {
      setRecentActivePrefix();
    }
  }, [setCoinList, setRecentActivePrefix, isShowComing]);

  // 合并上新和新币榜
  const newList = useMemo(() => {
    return [...comingList, ...newCoins].slice(0, 5);
  }, [newCoins, comingList]);

  const renderList = useMemo(() => {
    const baseConfig = [
      {
        title: t('newhomepage.tab.trending'),
        list: hotCoins,
        track: TRACK_TYPE.HOT,
      },
      {
        title: t('newhomepage.tab.newcoin'),
        list: newList,
        track: TRACK_TYPE.NEW,
      },
      {
        title: t('newhomepage.tab.top'),
        list: topList,
        track: TRACK_TYPE.GAINER,
      },
    ];

    // 如果是H5且有comingList，调整顺序
    if (isH5 && comingList?.length > 0) {
      const [hot, newcoin, top] = baseConfig;
      return [newcoin, hot, top];
    }

    return baseConfig;
  }, [isH5, newList, hotCoins, topList, comingList]);

  const viewMoreEl = (
    <AnimatedContent delay={0.8} distance={0}>
      <a className={styles.link} href={addLangToPath('/markets')} target="_blank" rel="noopener noreferrer">
        <span>{t('veEtdDLPLVfUKerEN9sTyW')}</span>
        <ArrowRight2Icon className={styles.linkIcon} rtl />
      </a>
    </AnimatedContent>
  );

  const coinCount = configItems?.webHomepageData?.backupValues?.Coins;

  return (
    <section className={styles.coinRankWrapper}>
      <AnimatedContent>
        <h2 className={styles.title}>{t('8612822c16cf4800a0d1')}</h2>
        {coinCount && <div className={styles.desc}>{t('71490fc96d154000a9b3', { count: coinCount })}</div>}
      </AnimatedContent>
      <div className={styles.listWrapper}>
        {isLg || isH5 ? (
          <PagerShow renderList={renderList} wrapperRef={wrapperRef} viewMoreEl={viewMoreEl} />
        ) : (
          <div ref={wrapperRef} className={styles.pcList}>
            {renderList.map(({ title, list, track }, index) => {
              const delay = calculateDelayTime(index, 0.2);
              return (
                <AnimatedContent key={track} delay={delay} style={{ width: '100%' }}>
                  <CoinList track={track} title={title} list={list} />
                </AnimatedContent>
              );
            })}
          </div>
        )}
      </div>

      {isLg || isH5 ? null : viewMoreEl}
    </section>
  );
};

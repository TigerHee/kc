/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, useState, useCallback } from 'react';
import { Tabs } from '@mui/Tabs';
import { _t } from 'Bot/utils/lang';
import PrimaryTab from 'src/trade4.0/components/PrimaryTab';
import { useSelector, useDispatch } from 'dva';
import useTicker from 'Bot/hooks/useTicker';
import Empty from '@mui/Empty';
import Spin from '@mui/Spin';
import { RankRowTypeTwoHead, RankRowTypeTwo, TabWrapper, Wrapper, Container } from './widgets';

const { Tab } = Tabs;

export const tabCfg = [
  {
    value: 'increase', // 涨幅榜
    lang: 'prUnH3cAy188M2YPJuoTy7',
  },
  {
    value: 'newCurrency', // 新币榜
    lang: 'eDy4Afiq8qYfMfGjeL6Kac',
  },
  {
    value: 'volume', // 成交额榜
    lang: 'qgu5nHCR8MB9SxK1AC2isV',
  },
  {
    value: 'botNum', // 机器人数
    lang: 'c5VLytbRVTkfhswGpXYdsm',
  },
];

/**
 * Market
 * 机器人排行榜-行情
 */
const Market = memo((props) => {
  const { ...restProps } = props;
  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state.loading.effects['BotRank/getCoinRank']);
  const rankMarket = useSelector((state) => state.BotRank.rankMarket);
  const [tab, setTab] = useState('increase');

  const setMergeState = (valObj) => {
    dispatch({
      type: 'BotRank/updateMarketCondition',
      payload: valObj,
    });
  };

  const fresh = useCallback(() => {
    dispatch({
      type: 'BotRank/getCoinRank',
      payload: {
        filterData: { tab },
      },
    });
  }, [tab]);

  useTicker(fresh, true, null, true);

  const rankLists = rankMarket?.[tab] || [];

  const handleChange = (_, v) => {
    setTab(v);
    setMergeState({ tab: v });
  };

  return (
    <Wrapper {...restProps}>
      <TabWrapper>
        <PrimaryTab variant="bordered" size="small" value={tab} onChange={handleChange}>
          {tabCfg.map(({ value, lang }) => (
            <Tab key={value} value={value} label={_t(lang)} />
          ))}
        </PrimaryTab>
      </TabWrapper>

      <Container>
        <RankRowTypeTwoHead tab={tab} />

        <Spin spinning={isLoading && !rankLists.length} style={{ height: '80%' }}>
          {rankLists.length ? (
            rankLists.map((item) => (
              <RankRowTypeTwo
                item={item}
                key={item.symbolCode}
                tab={tab}
                blockId="CoinRanking_Click"
                locationId={tabCfg.findIndex(({ value }) => value === tab)}
              />
            ))
          ) : (
            <Empty />
          )}
        </Spin>
      </Container>
    </Wrapper>
  );
});

export default Market;

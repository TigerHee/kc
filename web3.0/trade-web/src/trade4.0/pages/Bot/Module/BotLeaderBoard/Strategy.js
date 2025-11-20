/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { Tabs } from '@mui/Tabs';
import Button from '@mui/Button';
import Spin from '@mui/Spin';
import Empty from '@mui/Empty';
import InfiniteScroll from 'react-infinite-scroll-component';
import { _t } from 'Bot/utils/lang';
import PrimaryTab from 'src/trade4.0/components/PrimaryTab';
import { TabWrapper, Wrapper, Container, RankRowTypeOne } from './widgets';
import { useSelector, useDispatch } from 'dva';
import useDeepCompareEffect from 'src/trade4.0/hooks/common/useDeepCompareEffect';
import { objectToID } from './util';
import { fetchAction } from './constant';
import LabelCenter from './components/LabelCenter';
import StrategySelect from './components/StrategySelect';
import ConditionSelect from './components/ConditionSelect';
import CoinSelect from './components/CoinSelect';

const { Tab } = Tabs;

export const tabCfg = [
  {
    value: 'hour24ProfitRate',
    lang: '24hrank', // 利润榜
    field: {
      lang: '24hpr', // 24小时收益率
      dataKey: 'hour24ProfitRate', // 24小时收益率
    },
  },
  {
    value: 'profitRateYear',
    lang: 'fAH8WB1Mousu5PTo4A6xGU', // 年化榜
    field: {
      lang: 'ARP', // 年华
      dataKey: 'profitRateYear', // 年华
    },
  },
  {
    value: 'baseUnitProfit',
    lang: '5enUmTuSc2Bmd3oDsjWWTb', // 利润榜
    field: {
      lang: 'qyEh8evnYSN7ft2oY3gFCR', // 回报率
      dataKey: 'profitRate', // 回报率
    },
  },
  {
    value: 'profitRate',
    lang: 'qH8bbJkXnqVvZcMkNezcjC', // 回报率榜
    field: {
      lang: 'qyEh8evnYSN7ft2oY3gFCR',
      dataKey: 'profitRate',
    },
  },
  {
    value: 'copyNum',
    lang: 'd3szX4YLWwM1iEXKsYc5TQ', // 复制榜
    field: {
      lang: '24hpr',
      dataKey: 'hour24ProfitRate',
    },
  },
];

const dft = {
  items: [],
  isLoading: true,
  isFirstLoading: true,
  hasData: true,
  hasMore: true,
};

const MyButton = styled(Button)`
  display: flex;
  margin: 40px auto;
`;

const SelectorWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0 12px;
`;

const LeftWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const FullLoading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  .KuxSpin-root {
    align-self: unset;
  }
`;

/**
 * Strategy
 * 机器人排行榜-策略
 */
const Strategy = memo((props) => {
  const { ...restProps } = props;
  const [tab, setTab] = useState('hour24ProfitRate');

  const rankStrategy = useSelector((state) => state.BotRank.rankStrategy);
  const isLoading = useSelector((state) => state.loading.effects['BotRank/getStrategyRank']);
  const strategyCondition = useSelector((state) => state.BotRank.strategyCondition);

  const dispatch = useDispatch();

  const { uniqueKey, uniqueIndex } = objectToID(strategyCondition);
  const targetData = rankStrategy?.[uniqueKey] || dft;
  const rankLists = targetData?.items || [];

  const clearSelectCondition = useCallback(() => {
    dispatch({
      type: 'BotRank/updateStrategyCondition',
      payload: {
        templateType: 'ALL',
        code: 'ALL',
        condition: {},
      },
    });
  }, []);

  const fetchData = (_strategyCondition, type) => {
    dispatch({
      type: 'BotRank/getStrategyRank',
      payload: {
        filterData: _strategyCondition,
        type,
      },
    });
  };

  const fetchMoreData = React.useCallback(() => {
    fetchData(strategyCondition, fetchAction.fetchMore);
  }, [strategyCondition]);

  const setMergeState = (valObj) => {
    dispatch({
      type: 'BotRank/updateStrategyCondition',
      payload: valObj,
    });
  };

  useDeepCompareEffect(() => {
    fetchData(strategyCondition, fetchAction.conditionChange);
  }, [strategyCondition]);

  const handleChange = (_, v) => {
    setTab(v);
    setMergeState({ tab: v });
  };

  // uniqueIndex 变化意味着条件变化，需要重新创建InfiniteScroll
  const isFirstTimeLoading =
    targetData.isFirstLoading !== undefined ? targetData.isFirstLoading : true;

  return (
    <Wrapper {...restProps}>
      <TabWrapper>
        <PrimaryTab variant="bordered" size="small" value={tab} onChange={handleChange}>
          {tabCfg.map(({ value, lang }) => (
            <Tab key={value} value={value} label={_t(lang)} />
          ))}
        </PrimaryTab>
      </TabWrapper>

      <SelectorWrapper>
        <LeftWrapper>
          <StrategySelect
            value={strategyCondition.templateType}
            onChange={(val) => {
              setMergeState({ templateType: val });
            }}
          />
          <CoinSelect
            value={strategyCondition.code}
            onChange={(val) => setMergeState({ code: val })}
          />
        </LeftWrapper>
        <ConditionSelect
          value={strategyCondition.condition}
          onChange={(val) => setMergeState({ condition: val })}
        />
      </SelectorWrapper>

      <Container id="scrollableDiv">
        {isFirstTimeLoading ? (
          <FullLoading>
            <Spin size="small" type="brand" />
          </FullLoading>
        ) : (
          <InfiniteScroll
            scrollableTarget="scrollableDiv"
            key={uniqueIndex}
            dataLength={rankLists.length}
            next={fetchMoreData}
            hasMore={targetData.hasMore}
            loader={
              <p className="Flex hc mb-32">
                <Spin size="xsmall" />
              </p>
            }
            endMessage={
              targetData.hasData ? (
                <LabelCenter label={_t('stoporders8')} />
              ) : (
                <>
                  <div style={{ position: 'relative', height: '200px' }}>
                    <Empty />
                  </div>
                  <MyButton onClick={clearSelectCondition}>{_t('fiqzJnyWvpFCevQAkou6Wd')}</MyButton>
                </>
              )
            }
          >
            {rankLists.map((item) => (
              <RankRowTypeOne
                item={item}
                key={item.taskId}
                tab={tab}
                blockId="StrategyRanking_Click"
                locationId={tabCfg.findIndex(({ value }) => value === tab)}
              />
            ))}
          </InfiniteScroll>
        )}
      </Container>
    </Wrapper>
  );
});

export default Strategy;

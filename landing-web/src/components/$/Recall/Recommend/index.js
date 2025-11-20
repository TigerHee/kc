/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import { styled } from '@kufox/mui/emotion';
import changeIcon from 'assets/recall/change.svg';
import CoinIcon from 'components/common/KcCoinIcon';
import CoinCodeToName from 'components/common/CoinCodeToName';
import { px2rem } from '@kufox/mui/utils';
import { _t, addLangToPath } from 'utils/lang';
import { useDispatch, useSelector } from 'dva';
import { multiply } from 'helper';
import { formatNumber } from 'components/$/Recall/config';

import JsBridge from 'utils/jsBridge';
import { KUCOIN_HOST } from 'utils/siteConfig';
import { kcsensorsClick, saTrackForBiz } from 'utils/ga';

const RecommendWrapper = styled.div`
  margin-top: ${px2rem(21)};
  margin-bottom: ${px2rem(42)};
`;
const ChangeBatch = styled.div`
  font-weight: 400;
  font-size: ${px2rem(14)};
  line-height: 130%;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${px2rem(14)};
`;
const ChangeIcon = styled.img`
  margin-left: ${px2rem(4)};
  width: ${px2rem(16)};
  height: ${px2rem(16)};
  ${({ changing }) => (changing ? `animation: glittering 800ms linear infinite;` : '')}
  @keyframes glittering {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const CoinList = styled.div`
  display: flex;
  justify-content: space-evenly;
`;
const CoinItem = styled.div`
  background-color: ${({ theme }) => theme.colors.base};
  width: ${px2rem(108)};
  border-radius: ${px2rem(8)};
  text-align: center;
  padding: ${px2rem(17)} 0 ${px2rem(11)};
`;

const CoinIconPlaceholder = styled.div`
  width: ${px2rem(24)};
  height: ${px2rem(24)};
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.cover4};
  margin: 0 auto ${px2rem(15)};
`;

const CoinNamePlaceholder = styled.div`
  width: ${px2rem(36)};
  height: ${px2rem(12)};
  background-color: ${({ theme }) => theme.colors.cover4};
  margin: 0 auto ${px2rem(15)};
`;
const LastPricePlaceholder = styled.div`
  width: ${px2rem(82)};
  height: ${px2rem(15)};
  background-color: ${({ theme }) => theme.colors.cover4};
  margin: 0 auto ${px2rem(7)};
`;
const ChangeRatePlaceholder = styled.div`
  width: ${px2rem(48)};
  height: ${px2rem(12)};
  background-color: ${({ theme }) => theme.colors.cover4};
  margin: 0 auto ${px2rem(5)};
`;

const CoinName = styled.div`
  font-weight: 400;
  font-size: ${px2rem(14)};
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  margin: ${px2rem(9)} 0;
`;
const CoinPrice = styled.div`
  font-weight: 500;
  font-size: ${px2rem(16)};
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${px2rem(1)};
`;
const CoinRate = styled.div`
  font-weight: 400;
  font-size: ${px2rem(12)};
  line-height: 130%;
  color: ${({ theme, changeRate }) =>
    changeRate > 0
      ? theme.colors.primary
      : changeRate < 0
      ? theme.colors.secondary
      : theme.colors.cover40};
  margin-bottom: ${px2rem(7)};
`;

const Recommend = ({ optionKey }) => {
  const [activeIndex, setActiveIndex] = useState([0, 0, 0]);
  const [changing, setChanging] = useState(false);
  const dispatch = useDispatch();
  const { isInApp } = useSelector(state => state.app);
  const getCoinsLoading = useSelector(
    state => state.loading.effects['userRecall/getRecommendCoins'],
  );
  const loading = useSelector(state => state.loading.effects['userRecall/getSymbolTick']);
  const { queue1Coins, queue2Coins, queue3Coins, cacheSymbolTickMap, generalInfo } = useSelector(
    state => state.userRecall,
  );

  const getSymbolTickInfo = async symbols => {
    if (!symbols) {
      let activeSymbols = [];
      [queue1Coins, queue2Coins, queue3Coins].forEach((item, index) => {
        activeSymbols.push(item[activeIndex[index]].symbolCode);
      });
      symbols = activeSymbols.join(',');
    }
    await dispatch({ type: 'userRecall/getSymbolTick', payload: { symbols } });
  };

  const handleChange = async () => {
    if (changing || loading) return;
    kcsensorsClick(['recommendRefresh', '1']);
    setChanging(true);
    const newActiveIndex = [];
    let activeSymbols = [];
    [queue1Coins, queue2Coins, queue3Coins].forEach((item, index) => {
      let afterIndex = activeIndex[index] + 1;
      if (!item[afterIndex]) afterIndex = 0;
      activeSymbols.push(item[afterIndex].symbolCode);
      newActiveIndex[index] = afterIndex;
    });
    setActiveIndex(newActiveIndex);
    await getSymbolTickInfo(activeSymbols.join(','));
    setChanging(false);
  };

  useEffect(
    () => {
      dispatch({ type: 'userRecall/getRecommendCoins' });
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (queue1Coins.length) getSymbolTickInfo();
    },
    [queue1Coins],
  );

  useEffect(
    () => {
      if (queue1Coins.length) {
        saTrackForBiz({}, ['recommend', '1'], {
          optionKey,
          allItemAmount: generalInfo?.curStageOrder,
        });
      }
    },
    [optionKey, generalInfo, queue1Coins],
  );

  useEffect(
    () => {
      let timer = null;
      if (queue1Coins.length) {
        timer = setInterval(() => {
          getSymbolTickInfo();
        }, 2000);
      }
      return () => {
        timer && clearInterval(timer);
      };
    },
    [queue1Coins, activeIndex],
  );

  const handleClickCoin = (symbolCode, queueIndex) => {
    kcsensorsClick(['recommend', '1'], {
      optionKey,
      allItemAmount: generalInfo?.curStageOrder,
      clickPosition: ['queue_one', 'queue_two', 'queue_three'][queueIndex],
    });
    if (isInApp) {
      JsBridge.open({ type: 'jump', params: { url: `/market?symbol=${symbolCode}` } });
    } else {
      window.location.href = addLangToPath(`${KUCOIN_HOST}/trade/${symbolCode}`);
    }
  };

  return (
    <RecommendWrapper>
      <ChangeBatch onClick={handleChange}>
        <span>{_t('k935RdaZqADpxgDPQxxo6x')}</span>
        <ChangeIcon src={changeIcon} changing={changing} />
      </ChangeBatch>
      <CoinList>
        {[queue1Coins, queue2Coins, queue3Coins].map((currentQueue, index) => {
          const currentItem = currentQueue[activeIndex[index]];
          const changeRate = currentItem
            ? cacheSymbolTickMap[currentItem.symbolCode]?.changeRate
            : '';
          return changing || getCoinsLoading || !currentItem ? (
            <CoinItem key={index}>
              <CoinIconPlaceholder />
              <CoinNamePlaceholder />
              <LastPricePlaceholder />
              <ChangeRatePlaceholder />
            </CoinItem>
          ) : (
            <CoinItem key={index} onClick={() => handleClickCoin(currentItem.symbolCode, index)}>
              <CoinIcon currency={currentItem.code} showName={false} size={24} />
              <CoinName>
                <CoinCodeToName coin={currentItem.code} />
              </CoinName>
              <CoinPrice>
                {formatNumber(cacheSymbolTickMap[currentItem.symbolCode]?.lastTradedPrice) ?? '--'}
              </CoinPrice>
              {changeRate ? (
                <CoinRate changeRate={changeRate}>
                  {changeRate > 0 ? '+' : ''}
                  {multiply(changeRate, 100, 2)}%
                </CoinRate>
              ) : (
                <CoinRate>--</CoinRate>
              )}
            </CoinItem>
          );
        })}
      </CoinList>
    </RecommendWrapper>
  );
};

export default Recommend;

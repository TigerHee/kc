/**
 * Owner: roger.chen@kupotech.com
 */
import React, {useCallback, useState, useMemo, useEffect} from 'react';
import {
  IntersectionObserverView,
  IntersectionObserver,
} from 'rn-intersection-observer';
import {RefreshControl} from 'react-native';
import {KRNEventEmitter} from '@krn/bridge';
import {forEach} from 'lodash';
import {useSelector, useDispatch} from 'react-redux';
import styled from '@emotion/native';
import useSocket from 'hooks/useSocket';
import Bottom from 'components/Gembox/Bottom';
import CoinInfo from 'components/Gembox/CoinInfo';
import TradeInfo from 'components/Gembox/TradeInfo';
import MoreCoin from 'components/Gembox/MoreCoin';
import {onPageView} from 'utils/tracker';
import {
  pageId,
  _getHighLightsParamsObj,
  _onClickTrack,
} from 'components/Gembox/config';
import {_onExpose, _getHighLightsContent} from 'components/Gembox/config';
import {getNativeInfo} from 'utils/helper';
import {DEFAULT_LANG} from 'config';

const GemboxView = styled.View`
  flex: 1;
`;

const Content = styled.ScrollView`
  margin: 0 12px 56px;
`;

let intoPageTime = 0; // 进入页面的时间
const GemboxWrapper = () => {
  const {topOneInfo, hotCoinList, isFav} =
    useSelector(state => state.gembox) || {};
  const {
    name,
    heatValue,
    changeRate,
    symbolCode,
    highLights = [],
    topic,
  } = topOneInfo;
  const [exposeTopOneName, setExposeTopOneName] = useState('');
  const [exposeTopicName, setExposeTopicName] = useState('');
  const [exposeMoreCoinName, setExposeMoreCoinName] = useState('');
  const [exposeActiveName, setExposeActiveName] = useState('');
  const {
    socket,
    Topic,
    setTopics: setTopicsGembox,
    cleanTopics: cleanTopicsGembox,
  } = useSocket();
  const {setTopics: setTopicsMarket, cleanTopics: cleanTopicsMarket} =
    useSocket();
  const [refreshing, setRefreshing] = React.useState(false);
  const dispatch = useDispatch();
  const onScroll = useCallback(() => {
    IntersectionObserver.emitEvent('topicBox');
    IntersectionObserver.emitEvent('moreCoin');
    IntersectionObserver.emitEvent('herald');
  }, []);

  const allItemContent = useMemo(() => {
    return _getHighLightsContent(highLights);
  }, [highLights]);

  const getHighLightsParams = useMemo(() => {
    return _getHighLightsParamsObj(highLights);
  }, [highLights]);

  useEffect(() => {
    if (name && isFav !== undefined && name !== exposeTopOneName) {
      // 在有 isFav 有返回值了后再曝光
      _onExpose({
        blockId: 'topOne',
        locationId: 1,
        properties: {
          postTitle: name,
          likes: heatValue,
          intervals: changeRate,
          allItemContent,
          yesOrNo: isFav,
          ...getHighLightsParams,
        },
      });
      setExposeTopOneName(name);
    }
  }, [
    name,
    isFav,
    exposeTopOneName,
    heatValue,
    changeRate,
    allItemContent,
    getHighLightsParams,
  ]);

  useEffect(() => {
    if (name) {
      queryLikeCounts(name);
    }
  }, [name, queryLikeCounts]);
  const onTopicBoxChange = useCallback(
    value => {
      const {isInsecting} = value;
      if (!isInsecting) {
        return;
      }
      // 话题
      const {title, topicType, tradeDirection} = topic || {};
      if (name && name !== exposeTopicName && title) {
        _onExpose({
          blockId: 'topic',
          locationId: 1,
          properties: {
            commentType: topicType,
            commentContext: title,
            commentPosition: tradeDirection,
          },
        });
        setExposeTopicName(name);
      }
    },
    [name, exposeTopicName, topic],
  );
  const onMoreCoinChange = useCallback(
    value => {
      const {isInsecting} = value;
      if (!isInsecting) {
        return;
      }
      // 更多热币
      if (name && name !== exposeMoreCoinName) {
        forEach(hotCoinList || [], (item, index) => {
          _onExpose({
            blockId: 'moreCoin',
            locationId: 1,
            properties: {
              postTitle: item.name,
              likes: item.heatValue,
              sortPosition: index + 1,
            },
          });
        });
        setExposeMoreCoinName(name);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name, exposeMoreCoinName],
  );
  const onHeraldChange = useCallback(
    value => {
      const {isInsecting} = value;
      if (!isInsecting) {
        return;
      }
      // 活动
      if (name && name !== exposeActiveName) {
        _onExpose({
          blockId: 'notice',
          locationId: 1,
        });
        setExposeActiveName(name);
      }
    },
    [name, exposeActiveName],
  );

  // 订阅Markesocket
  useEffect(() => {
    if (symbolCode) {
      setTopicsMarket([[Topic.MARKET_SNAPSHOT, {SYMBOLS: [symbolCode]}]]);
    }
  }, [Topic.MARKET_SNAPSHOT, setTopicsMarket, symbolCode]);

  // 订阅gemboxsocket
  useEffect(() => {
    (async function () {
      const {lang} = await getNativeInfo();
      setTopicsGembox([[`/app-home/gem-box:${lang || DEFAULT_LANG}`]]);
    })();
  }, [setTopicsGembox]);

  useEffect(() => {
    // 监听返回消息
    (async function () {
      let _lang = DEFAULT_LANG;
      const info = await getNativeInfo();
      _lang = info.lang;
      socket.topicMessage(`/app-home/gem-box:${_lang}`)(
        arr => {
          const {data} = arr[0] || {};
          if (data) {
            dispatch({
              type: 'gembox/updateCurrencyList',
              payload: data,
            });
          }
        },
        500,
        true,
      );
    })();
  }, [dispatch, socket]);

  useEffect(() => {
    intoPageTime = Date.now();
  }, []);

  const pageView = () => {
    // 页面浏览上报
    try {
      const _diff = Date.now() - (intoPageTime || 0);
      onPageView({pageId, eventDuration: _diff});
      intoPageTime = 0;
    } catch (e) {}
  };

  // 进入后台事件
  const _enterBackground = useCallback(() => {
    cleanTopicsGembox();
    cleanTopicsMarket();
    pageView();
  }, [cleanTopicsGembox, cleanTopicsMarket]);

  // 进入前台事件
  const _enterForeground = useCallback(() => {
    if (symbolCode) {
      setTopicsMarket([[Topic.MARKET_SNAPSHOT, {SYMBOLS: [symbolCode]}]]);
      dispatch({
        type: 'gembox/checkIsFav',
        payload: {symbolCode},
      });
    }
    (async function () {
      let _lang = DEFAULT_LANG;
      const info = await getNativeInfo();
      _lang = info.lang;
      setTopicsGembox([[`/app-home/gem-box:${_lang}`]]);
    })();
    intoPageTime = Date.now();
  }, [
    Topic.MARKET_SNAPSHOT,
    dispatch,
    setTopicsGembox,
    setTopicsMarket,
    symbolCode,
  ]);

  // 统一监听事件
  useEffect(() => {
    const subEnterBackground = KRNEventEmitter.addListener(
      'onHide',
      _enterBackground,
    );
    const subEnterForeground = KRNEventEmitter.addListener(
      'onShow',
      _enterForeground,
    );
    return () => {
      subEnterBackground && subEnterBackground.remove();
      subEnterForeground && subEnterForeground.remove();
    };
  }, [_enterBackground, _enterForeground]);

  const onRefresh = useCallback(
    position => {
      setRefreshing(true);
      dispatch({
        type: 'gembox/getCurrencyList',
      }).then(coinName => {
        queryLikeCounts(coinName);
        setRefreshing(false);
      });
      // 点击埋点
      _onClickTrack({
        blockId: 'update',
        locationId: 1,
        properties: {
          position,
        },
      });
    },
    [dispatch, queryLikeCounts],
  );

  const queryLikeCounts = useCallback(
    coinName => {
      dispatch({
        type: 'gembox/queryLikeCounts',
        payload: {
          currency: coinName || name,
        },
      });
    },
    [dispatch, name],
  );

  useEffect(() => {
    const subscription = KRNEventEmitter.addListener(
      'onLoginSuccess',
      async () => {
        setTimeout(async () => {
          queryLikeCounts();
        }, 300);
      },
    );
    return () => {
      subscription && subscription.remove();
    };
  }, [dispatch, queryLikeCounts]);
  return (
    <GemboxView>
      <Content
        onScroll={onScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => onRefresh('pull')}
            tintColor="#21C397"
          />
        }>
        <CoinInfo />
        <TradeInfo onRefresh={onRefresh} />
        <IntersectionObserverView
          scope="moreCoin"
          thresholds={[0.5]}
          throttle={200}
          onIntersectionChange={onMoreCoinChange}>
          <MoreCoin />
        </IntersectionObserverView>
      </Content>
      <Bottom />
    </GemboxView>
  );
};

export default GemboxWrapper;

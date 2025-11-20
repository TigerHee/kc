/**
 * Owner: odan.ou@kupotech.com
 */

import ComponentWrapper from '@/components/ComponentWrapper';
import { styled } from '@/style/emotion';
import { getModelAuctionInfo, getSymbolAuctionInfo } from '@/utils/business';
import { eTheme } from '@/utils/theme';
import Spin from '@mui/Spin';
import { PushConf } from 'common/utils/socketProcess';
import { connect } from 'dva';
import wsSubscribe from 'hocs/wsSubscribe';
import { isEmpty, isEqual } from 'lodash';
import React, { Component, memo, useContext, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import callAuctionStore from 'src/pages/Trade3.0/stores/store.callAuction';
import { name, WrapperContext } from './config';

import Auction from './Auction';

const LayoutAuctionWrap = styled.div`
  width: 100%;
  height: 100%;
  z-index: 18;
  position: absolute;
  top: 0;
`;

const LayoutAuction = styled.div`
  width: 100%;
  height: 100%;
  z-index: 20;
  line-height: 1.3;
  display: flex;
  align-items: stretch;
  position: absolute;
  padding: 16px 12px 0;
  top: 0;
  flex-direction: column;
  background: ${eTheme('overlay')};
  color: ${eTheme('text')};
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  > div {
    width: inherit;
  }
`;

/**
 * 集合竞价
 * @param {{
 *  isMulti: boolean,
 *  currentSymbol: string,
 *  auctionData: Record<string, any>,
 * }} props
 */
const CallAuction = (props) => {
  const { isMulti, currentSymbol, ...others } = props;
  const screen = useContext(WrapperContext);
  const vertical = screen === 'sm' || screen === 'md' || screen === 'lg';
  const dispatch = useDispatch();
  const { fetchLoading, auctionConf } = useSelector((state) => {
    return {
      fetchLoading: state.loading.effects['callAuction/getAuctionConf'],
      auctionConf: state.callAuction.auctionMap[currentSymbol]?.auctionConf || {},
    };
  }, shallowEqual);
  const loading = isEmpty(auctionConf) && fetchLoading;
  const symbolInfo = useSelector(
    (state) => state.symbols?.symbolsMap?.[currentSymbol],
    shallowEqual,
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'symbols/pullSymbols' });
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [dispatch, currentSymbol]); // 依赖 currentSymbol

  return (
    <LayoutAuction className="layout-auction">
      <Spin spinning={loading} style={{ height: '100%' }}>
        <Auction
          {...others}
          auctionConf={auctionConf}
          key={currentSymbol}
          screen={screen}
          currentSymbol={currentSymbol}
          symbolInfo={symbolInfo}
          vertical={vertical}
        />
      </Spin>
    </LayoutAuction>
  );
};

const CallAuctionPoint = memo((props) => {
  return (
    <LayoutAuctionWrap>
      <ComponentWrapper name={name} breakPoints={[281, 480, 768, 1024]}>
        <CallAuction {...props} />
      </ComponentWrapper>
    </LayoutAuctionWrap>
  );
});

@wsSubscribe({
  getTopics: (Topic, props) => {
    const { currentSymbol } = props;
    return [[PushConf.CallAuctionInfo.topic, { SYMBOLS: [currentSymbol] }]];
  },
  didUpdate: (prevProps, currentProps) => {
    const { openOrderGroup } = currentProps;
    const isNotGroupEq = prevProps.openOrderGroup !== openOrderGroup;
    // 集合竞价订阅发生变化
    const auctionChange = prevProps.showAuction !== currentProps.showAuction;
    return currentProps.coinPair !== prevProps.coinPair || isNotGroupEq || auctionChange;
  },
})
class CallAuctionTopic extends Component {
  render() {
    return <CallAuctionPoint {...this.props} />;
  }
}

// 集合竞价，推送数据处理
@connect((state, props) => {
  const {
    symbolInfo: { symbolCode },
  } = props;
  return {
    currentSymbol: symbolCode,
    showAuction: getModelAuctionInfo(state, symbolCode).showAuction,
  };
})
@callAuctionStore.columnStoreHoc((state, props) => {
  const { currentSymbol } = props;
  const {
    auctionDataMap: { [currentSymbol]: auctionData = {} },
  } = state.callAuction;
  return {
    auctionData,
  };
})
class CallAuctionWrap extends Component {
  render() {
    const { showAuction } = this.props;
    // debugger
    return showAuction ? <CallAuctionTopic {...this.props} /> : null;
  }
  auctionHandle = () => {
    const { dispatch, currentSymbol } = this.props;
    dispatch({
      // 判断是否展示集合竞价
      type: 'callAuction/auctionHandle',
      payload: {
        currentSymbol,
      },
    });
  };
  componentDidUpdate(prevProps) {
    const { showAuction, currentSymbol, symbolInfo } = this.props;
    if (
      prevProps.showAuction !== showAuction ||
      prevProps.currentSymbol !== currentSymbol ||
      !isEqual(symbolInfo, prevProps.symbolInfo)
    ) {
      this.auctionHandle();
    }
  }
  componentDidMount() {
    this.auctionHandle();
  }
}

/**
 * 集合竞价
 * @param {{
 *  symbol: string,
 *  isMulti?: boolean,
 * }} props
 */
const CallAuctionPage = (props) => {
  const { symbol, isMulti = false } = props;
  const symbolInfo = useSelector((state) => state.symbols.symbolsMap?.[symbol], shallowEqual);
  const auctionWhiteAllowList = useSelector((state) => state.callAuction.auctionWhiteAllowList);
  const auctionWhiteAllowStatusMap = useSelector(
    (state) => state.callAuction.auctionWhiteAllowStatusMap,
  );

  const { showAuction } = getSymbolAuctionInfo(
    symbolInfo,
    auctionWhiteAllowList,
    auctionWhiteAllowStatusMap,
  );
  const dispatch = useDispatch();
  // 币对更新时，将上一个币对的集合竞价信息设置为false
  // useEffect(() => {
  //   if (!showAuction) {
  //     dispatch({
  //       type: 'callAuction/auctionHandle',
  //       payload: {
  //         isClose: true,
  //         currentSymbol: symbol,
  //       },
  //     });
  //   }
  // }, [symbol, showAuction, dispatch]);

  // 启用/停用集合竞价轮训
  useEffect(() => {
    if (showAuction) {
      // 启用兜底轮训
      dispatch({ type: 'callAuction/pull@polling', payload: { coinPair: symbol } });
      return () => {
        // 停用兜底轮训
        dispatch({ type: 'callAuction/pull@polling:cancel' });
      };
    }
  }, [symbol, showAuction, dispatch]);
  if (!showAuction) return null;
  return <CallAuctionWrap symbolInfo={symbolInfo} isMulti={isMulti} />;
};

export default CallAuctionPage;

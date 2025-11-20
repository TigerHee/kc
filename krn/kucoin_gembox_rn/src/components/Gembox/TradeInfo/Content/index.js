/**
 * Owner: roger.chen@kupotech.com
 */
import React, {useCallback, useState, useEffect, useMemo} from 'react';
import styled from '@emotion/native';
import {Platform} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {Button} from '@krn/ui';
import TradeItemView from './TradeItem';
import TradeReason from './TradeReason';
import UserTradeInfoSheet from '../UserTradeInfoSheet';
import OrderInfoSheet from '../OrderInfoSheet';
import Broadcast from '../Broadcast';
import {TAB_MAP, USER_TREADEINFO_TAB_MAP} from '../config';
import {openNative} from '@krn/bridge';
import {
  _onExpose,
  _onClickTrack,
  _getHighLightsContent,
  _updatePercentNumber,
  _getHighLightsParamsObj,
} from 'components/Gembox/config';
import {forEach} from 'lodash';
import {getNativeInfo} from 'utils/helper';
import useLang from 'hooks/useLang';
import {useMount} from 'react-use';

const ContentView = styled.View`
  width: 100%;
  background: #ffffff;
  padding: 16px 14px 14px;
  border: 1px solid ${({theme}) => theme.color.complementary};
  border-top-width: 0;
  border-bottom-width: 3px;
  border-bottom-left-radius: 14px;
  border-bottom-right-radius: 14px;
`;
const BtnWrapper = styled.View`
  width: 100%;
  margin-top: 5px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const BuyBtn = styled(Button)`
  flex: 1;
  height: 40px;
  border: 1px solid #00142a;
`;
const SellBtn = styled(Button)`
  flex: 1;
  height: 40px;
  background: #ffb547;
  border: 1px solid #00142a;
`;
const FuturesBtn = styled(Button)`
  flex: 2;
  height: 40px;
  background: #ed6666;
  border: 1px solid #00142a;
  margin-left: 6px;
`;
const Content = props => {
  const {activeStatus} = props;
  const {_t} = useLang();
  const dispatch = useDispatch();
  const {topOneInfo, changeRate, isFav} =
    useSelector(state => state.gembox) || {};
  const {
    name,
    highLights = [],
    futureSymbol,
    symbolCode,
    heatValue,
  } = topOneInfo;
  const [activeTradeInfoTab, setActiveTradeInfoTab] = useState(
    USER_TREADEINFO_TAB_MAP.BIG_MONEY,
  );
  const [activeOrderInfoTab, setActiveOrderInfoTab] = useState(TAB_MAP.buy);

  const [exposeBuyBlock, setExposeBuyBlock] = useState('');

  const [exposeSellBlock, setExposeSellBlock] = useState('');

  const [iosVersionForbid, setIosVersionForbid] = useState(true);

  // 取得当前大户，熟手买入卖出比例
  const getAllItemAmount = useMemo(() => {
    let buyBigMoney = '';
    let buyProTrader = '';
    let sellBigMoney = '';
    let sellProTrader = '';
    forEach(highLights || [], (item, index) => {
      const {type, tradeDirection, param} = item;
      const _param = _updatePercentNumber(param);
      if (type === 'BIG_MONEY' && tradeDirection === 'BUY') {
        buyBigMoney = _param;
      } else if (type === 'BIG_MONEY' && tradeDirection === 'SELL') {
        sellBigMoney = _param;
      } else if (type === 'PRO_TRADER' && tradeDirection === 'BUY') {
        buyProTrader = _param;
      } else if (type === 'PRO_TRADER' && tradeDirection === 'SELL') {
        sellProTrader = _param;
      }
    });
    return {
      buy: {
        bigMoney: buyBigMoney,
        proTrader: buyProTrader,
      },
      sell: {
        bigMoney: sellBigMoney,
        proTrader: sellProTrader,
      },
    };
  }, [highLights]);

  const openUserTradeInfoSheet = useCallback(
    val => {
      setActiveTradeInfoTab(val);
      dispatch({
        type: 'gembox/update',
        payload: {
          openUserTradeInfoSheet: true,
        },
      });
      // 点击埋点
      _onClickTrack({
        blockId: 'specialDetail',
        locationId: 1,
        properties: {
          groupId:
            val === USER_TREADEINFO_TAB_MAP.BIG_MONEY
              ? 'bigMoney'
              : 'proTrader',
          allItemAmount:
            getAllItemAmount[activeStatus === TAB_MAP.buy ? 'buy' : 'sell'][
              val === USER_TREADEINFO_TAB_MAP.BIG_MONEY
                ? 'bigMoney'
                : 'proTrader'
            ],
          position: activeStatus === TAB_MAP.buy ? 'buyBlock' : 'sellBlock',
        },
      });
    },
    [activeStatus, dispatch, getAllItemAmount],
  );
  const openOrderInfoSheet = useCallback(
    val => {
      setActiveOrderInfoTab(val);
      dispatch({
        type: 'gembox/update',
        payload: {
          openOrderInfoSheet: true,
        },
      });
    },
    [dispatch],
  );

  useEffect(() => {
    // 曝光埋点
    if (
      name &&
      activeStatus === TAB_MAP.buy &&
      isFav !== undefined &&
      name !== exposeBuyBlock
    ) {
      exposeSpecialDetail({
        groupId: 'bigMoney',
        allItemAmount: getAllItemAmount.buy.bigMoney,
        position: 'buyBlock',
      });
      exposeSpecialDetail({
        groupId: 'proTrader',
        allItemAmount: getAllItemAmount.buy.proTrader,
        position: 'buyBlock',
      });
      exposeBtn('buy');
      setExposeBuyBlock(name);
    }
    if (
      name &&
      activeStatus === TAB_MAP.sell &&
      isFav !== undefined &&
      name !== exposeSellBlock
    ) {
      exposeSpecialDetail({
        groupId: 'bigMoney',
        allItemAmount: getAllItemAmount.sell.bigMoney,
        position: 'sellBlock',
      });
      exposeSpecialDetail({
        groupId: 'proTrader',
        allItemAmount: getAllItemAmount.sell.proTrader,
        position: 'sellBlock',
      });
      exposeBtn('sell');
      if (futureSymbol && iosVersionForbid) {
        exposeBtn();
      }
      setExposeSellBlock(name);
    }
  }, [
    activeStatus,
    exposeBtn,
    exposeBuyBlock,
    exposeSellBlock,
    exposeSpecialDetail,
    futureSymbol,
    getAllItemAmount,
    isFav,
    name,
    iosVersionForbid,
  ]);

  useMount(async () => {
    const nativeInfo = await getNativeInfo();
    const {version} = nativeInfo || {};
    if (Platform.OS === 'ios' && version === '3.66.0') {
      setIosVersionForbid(false);
    }
  });

  const allItemContent = useMemo(() => {
    return _getHighLightsContent(highLights);
  }, [highLights]);

  const getHighLightsParams = useMemo(() => {
    return _getHighLightsParamsObj(highLights);
  }, [highLights]);

  const onTrade = useCallback(
    direction => {
      if (!symbolCode) {
        return;
      }
      let url = '';
      if (direction) {
        url =
          direction === 'sell'
            ? `/trade?symbol=${symbolCode}&isBuy=false`
            : `/trade?symbol=${symbolCode}&isBuy=true`;
      } else {
        url = `/kumex/trade?symbol=${futureSymbol}&side=sell`;
      }
      openNative(url);
      // 点击埋点
      _onClickTrack({
        blockId: 'tradeButton',
        locationId: 1,
        properties: {
          postTitle: name,
          likes: heatValue,
          intervals: changeRate || topOneInfo.changeRate, // 24h涨跌幅
          ...getHighLightsParams,
          allItemContent,
          yesOrNo: isFav,
          clickPosition: direction || 'short',
        },
      });
    },
    [
      futureSymbol,
      allItemContent,
      changeRate,
      getHighLightsParams,
      heatValue,
      isFav,
      name,
      symbolCode,
      topOneInfo.changeRate,
    ],
  );
  const exposeSpecialDetail = useCallback(
    ({groupId, allItemAmount, position}) => {
      _onExpose({
        blockId: 'specialDetail',
        locationId: 1,
        properties: {
          groupId,
          allItemAmount,
          position,
        },
      });
    },
    [],
  );
  const exposeBtn = useCallback(
    direction => {
      _onExpose({
        blockId: 'tradeButton',
        locationId: 1,
        properties: {
          postTitle: name,
          likes: heatValue,
          intervals: changeRate || topOneInfo.changeRate, // 24h涨跌幅
          ...getHighLightsParams,
          allItemContent,
          yesOrNo: isFav,
          clickPosition: direction || 'short',
        },
      });
    },
    [
      allItemContent,
      changeRate,
      getHighLightsParams,
      heatValue,
      isFav,
      name,
      topOneInfo.changeRate,
    ],
  );
  return (
    <ContentView>
      <TradeItemView
        type={USER_TREADEINFO_TAB_MAP.BIG_MONEY}
        activeStatus={activeStatus}
        source={highLights.filter(
          i =>
            i.type === USER_TREADEINFO_TAB_MAP.BIG_MONEY &&
            i.tradeDirection === activeStatus,
        )}
        name={name}
        openUserTradeInfoSheet={openUserTradeInfoSheet}
      />
      <TradeItemView
        type={USER_TREADEINFO_TAB_MAP.PRO_TRADER}
        activeStatus={activeStatus}
        source={highLights.filter(
          i =>
            i.type === USER_TREADEINFO_TAB_MAP.PRO_TRADER &&
            i.tradeDirection === activeStatus,
        )}
        name={name}
        openUserTradeInfoSheet={openUserTradeInfoSheet}
      />
      {name && (
        <TradeReason
          {...props}
          type={activeStatus}
          list={highLights.filter(i => i.tradeDirection === activeStatus)}
          openOrderInfoSheet={openOrderInfoSheet}
        />
      )}
      {name ? (
        activeStatus === TAB_MAP.buy ? (
          <BtnWrapper>
            <BuyBtn
              size="large"
              onPress={() => onTrade('buy')}
              textStyle={{
                fontWeight: 'bold',
                fontSize: 16,
                color: '#000000',
              }}>
              {_t('iTpvm3N1XM3Fgvwg3czeEb')}
            </BuyBtn>
          </BtnWrapper>
        ) : (
          <BtnWrapper>
            <SellBtn
              size="large"
              onPress={() => onTrade('sell')}
              textStyle={{
                fontWeight: 'bold',
                fontSize: 16,
                color: '#000000',
              }}>
              {_t('stT8qSzw57q2gZaefAyoCL')}
            </SellBtn>
            {futureSymbol && iosVersionForbid ? (
              <FuturesBtn
                size="large"
                onPress={() => onTrade()}
                textStyle={{
                  fontWeight: 'bold',
                  fontSize: 16,
                  color: '#000000',
                }}>
                {_t('6jt5jpdrqtksbaqdguELDZ')}
              </FuturesBtn>
            ) : null}
          </BtnWrapper>
        )
      ) : (
        <BtnWrapper>
          <BuyBtn
            size="large"
            onPress={null}
            textStyle={{
              fontWeight: 'bold',
              fontSize: 16,
              color: '#000000',
            }}>
            {''}
          </BuyBtn>
        </BtnWrapper>
      )}
      <Broadcast activeStatus={activeStatus} />
      <UserTradeInfoSheet defaultActiveTab={activeTradeInfoTab} />
      <OrderInfoSheet defaultActiveTab={activeOrderInfoTab} />
    </ContentView>
  );
};

export default Content;

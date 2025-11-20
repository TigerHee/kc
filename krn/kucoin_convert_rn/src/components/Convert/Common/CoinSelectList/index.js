/**
 * Owner: willen@kupotech.com
 */
import React, {useState, useMemo, useEffect} from 'react';
import Seach from './Seach';
import CoinList from './CoinList';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import useLang from 'hooks/useLang';
import useTracker from 'hooks/useTracker';
import HeaderPro from 'components/Common/HeaderPro';
// import useCoinMap from 'hooks/useCoinMap';
import useOrderList from 'hooks/useOrderList';
import useDisableTextInput from 'hooks/useDisableTextInput';
import {delt, divide, getCoinAvailableBalance, multiply} from 'utils/helper';
import {storage} from '@krn/toolkit';
import {isEmpty, uniq} from 'lodash';
import useMarginMarkMap from 'hooks/useMarginMarkMap';
import reduce from 'lodash/reduce';

const ORDER_COMMON_KEY = 'ORDER_COMMON_KEY';
const LIMIT_ORDER_COMMON_KEY = 'LIMIT_ORDER_COMMON_KEY';

const filterByMap = (target = [], map = {}) => {
  if (isEmpty(map)) return target;
  return target?.filter(coin => map[coin]) ?? [];
};

const getLocalKey = isMarket => {
  return isMarket ? ORDER_COMMON_KEY : LIMIT_ORDER_COMMON_KEY;
};

function processArray(a, b) {
  // 来去重
  const uniqueSet = uniq([a, ...b]);

  // 确保返回的数组长度最多为 10
  return uniqueSet?.slice(0, 10);
}

const trimName = (name, filter) =>
  name && name.toLowerCase().includes(filter.toLowerCase().trim());

const U = 'USDT';

export default ({params}) => {
  const navigation = useNavigation();
  const {_t} = useLang();
  const {onClickTrack} = useTracker();

  const {direction = 'from', coinSelected, type, backRoute, orderType} = params;

  const isFromHome = type === 'convert';
  const isMarket = orderType === 'MARKET';
  const isFromDirection = direction === 'from';

  const selectAccountType = useSelector(
    state => state.convert.selectAccountType,
  );
  const from = useSelector(state => state.convert.from);
  const to = useSelector(state => state.convert.to);

  // const categories = useSelector(state => state.symbols.categories) || {};

  const isLogin = useSelector(state => state.app.isLogin);
  const mainMap = useSelector(state => state.app.mainMap) || {};
  const tradeMap = useSelector(state => state.app.tradeMap) || {};
  const prices = useSelector(state => state.app.prices);
  const rates = useSelector(state => state.app.rates);
  const currency = useSelector(state => state.app.currency);

  const marginMarkMap = useMarginMarkMap(orderType);

  const {orderCoinList, orderHotsList} = useOrderList(orderType);
  const [commonSelectedList, setCommonSelectedList] = useState([]);

  // const coinMap = useCoinMap();

  const [filter, setFilter] = useState('');

  const loading = useSelector(
    state => state.loading.effects['convert/getConvertCurrencyConfig'],
  );

  const shoudleDisableTextInput = useDisableTextInput();

  /**
   * 如果是历史订单过来的就用 orderList 的数据
   * 如果首页进来的就用 coinMap 的数据
   * 他们都区分 市价和限价数据
   * orderList 和 coinMap 在切换 市价和限价 tab 的时候就会存起来
   */
  const coinList = useMemo(() => {
    if (!isFromHome) return orderCoinList;
    let _orderCoinList = orderCoinList;
    if (!isFromDirection) {
      _orderCoinList = _orderCoinList.filter(el => el.currency !== from.coin);
    }

    if (orderType === 'LIMIT' && !isFromDirection) {
      // 现价单、from非USDT, to选择的是USDT, 那么to的列表只能选择USDT
      if (from.coin !== U && to.coin === U) {
        return _orderCoinList.filter(el => el.currency === U);
      }
    }

    return _orderCoinList;
  }, [isFromHome, orderType, isFromDirection, orderCoinList, from]);

  const availCoinMap = useMemo(() => {
    return reduce(
      coinList,
      (a, b) => {
        a[b.currency] = b;
        return a;
      },
      {},
    );
  }, [coinList]);

  const filterList = useMemo(() => {
    let searchList;
    // 关键词过滤
    if (filter.length) {
      searchList = coinList.filter(item => {
        return trimName(item.name, filter) || trimName(item.fullName, filter);
      });
    } else {
      searchList = coinList;
    }
    if (isFromHome) {
      // 将币种数量、法币价值、币种数量 * 法币价值塞入数组供遍历使用
      const balanceList = [];
      const otherList = [];
      searchList.forEach(item => {
        let balance = getCoinAvailableBalance({
          coin: item.coin,
          precision: undefined,
          mainMap,
          tradeMap,
          accountType: selectAccountType,
          isLogin,
        });
        const currencyPrice = prices[item.coin] || 0;
        // 币种转USD的价值，小于0.1视为无资产
        const amountByUSD = divide(
          multiply(balance, currencyPrice),
          rates[currency] || 9999,
        );
        if (delt(amountByUSD, 0.1)) balance = 0;

        if (balance > 0) {
          balanceList.push({
            ...item,
            currencyPrice: currencyPrice,
            balance,
            amountByCurrency: multiply(balance, currencyPrice),
          });
        } else {
          otherList.push({...item, currencyPrice: currencyPrice});
        }
      });
      // 拥有资产的币种按照「拥有价值」折合法币排序，未拥有的资产按照币种字母排序
      const newList = balanceList
        .sort((a, b) => b.amountByCurrency - a.amountByCurrency)
        .concat(otherList.sort((a, b) => a.name?.localeCompare(b.name)));

      return newList.map(item => {
        item.selected = item.coin === coinSelected;
        return item;
      });
    }

    return searchList.map(item => {
      item.selected = item.coin === coinSelected;
      return item;
    });
  }, [
    filter,
    coinList,
    mainMap,
    tradeMap,
    selectAccountType,
    prices,
    rates,
    currency,
    coinSelected,
    isFromHome,
  ]);

  const handleSearch = text => {
    setFilter(text);
  };

  const handleDelete = async () => {
    const key = getLocalKey(isMarket);
    await storage.setItem(key, []);
    setCommonSelectedList([]);
  };

  const handleSelect = (info, index) => {
    if (isFromHome) {
      setStorageCommonList(info.coin);
      try {
        onClickTrack({
          blockId: 'coinChooseNew',
          locationId: isFromDirection ? 1 : 2,
          properties: {
            symbol: info.coin,
            search_text: !!filter,
            has_value: !!info.balance,
            index: index + 1,
          },
        });
      } catch (e) {}
    }
    if (info.coin === coinSelected) {
      // 选择的币种没有变化，不做任何操作直接返回
      navigation.goBack();
    } else {
      navigation.navigate({
        name: backRoute,
        params: {...params, coinSelected: info.coin},
        merge: true,
      });
    }
  };

  const getStorageCommonList = async () => {
    const key = getLocalKey(isMarket);
    const list = await storage.getItem(key);
    return list || [];
  };

  const setStorageCommonList = async v => {
    const key = getLocalKey(isMarket);

    const list = await getStorageCommonList();
    const newList = processArray(v, list);

    await storage.setItem(key, newList);

    setCommonSelectedList(newList || []);
  };

  const getInitStorageCommonList = async () => {
    const list = await getStorageCommonList();
    setCommonSelectedList(list || []);
  };

  useEffect(() => {
    if (isFromHome) {
      getInitStorageCommonList();
    }
  }, []);

  return (
    <>
      <HeaderPro
        title={
          isFromDirection
            ? _t('f1fUs5np2HnVWsgQPhB9LC')
            : _t('1izXduRcCW4CqMQTDi3Nry')
        }
        onPressBack={() => navigation.goBack()}
      />

      {!shoudleDisableTextInput && <Seach handleSearch={handleSearch} />}
      <CoinList
        showBalance={isFromHome}
        type={type}
        list={filterList}
        commonSelectedList={filterByMap(commonSelectedList, availCoinMap)}
        orderHotsList={filterByMap(orderHotsList, availCoinMap)}
        handleSelect={handleSelect}
        handleDelete={handleDelete}
        loading={loading}
        marginMarkMap={marginMarkMap}
        keywords={filter}
      />
    </>
  );
};

/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, {memo, useState, useEffect, useRef, useMemo} from 'react';
import styled from '@emotion/native';
import {useTheme} from '@krn/ui';
import icon from 'assets/convert/switch_horiental.png';
import {TouchableOpacity, Platform} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CoinCodeToName from 'components/Common/CoinCodeToName';
import {
  handleInputAmountByPrecision,
  changeBackground,
  divide,
  getInputTitle,
  // delt,
  // degt,
} from 'utils/helper';
// import useInterval from 'hooks/useInterval';
import useLang from 'hooks/useLang';
import {limitQuotePrice} from 'services/convert';
import {useFocusEffect} from '@react-navigation/native';
import usePolling from 'hooks/usePolling';
import useIsSymbolDisabled from 'hooks/useIsSymbolDisabled';

const Wrapper = styled.View`
  background-color: ${({theme, changeBg}) =>
    theme.colorV2[changeBg ? 'primary4' : 'cover4']};
  border-radius: 12px;
  padding: 14px 12px;
  margin-top: 12px;
`;

const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`;

const Title = styled.Text`
  color: ${({theme}) => theme.colorV2.text60};
  font-size: 14px;
  font-weight: 400;
  line-height: 18.2px;
`;

const Price = styled.Text`
  color: ${({theme}) => theme.colorV2.text40};

  font-size: 13px;
  font-weight: 400;
  line-height: 16.9px;
`;

const OneCoin = styled.Text`
  color: ${({theme}) => theme.colorV2.text40};
  font-size: 12px;
  font-weight: 400;
  line-height: 15.6px;
  width: 100%;
`;

const EqCoin = styled.Text`
  font-size: 16px;
  font-weight: 500;
  line-height: ${() => (Platform.OS === 'android' ? undefined : '20.8px')};
  color: ${({theme}) => theme.colorV2.text40};
`;

const InputRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Input = styled.TextInput`
  font-size: 16px;
  font-weight: 600;
  /* line-height: 20.8px; */
  flex: 1;
  color: ${({theme}) => theme.colorV2.text};
  text-align: ${({theme}) => (theme.isRTL ? 'right' : 'left')};
`;

const TransferBtn = styled.Image`
  width: 14px;
  height: 14px;
  margin-left: 4px;
  margin-top: -2px;
`;

// const TipText = styled.Text`
//   margin: 8px 12px 0;
//   font-size: 12px;
//   font-weight: 400;
//   line-height: 15.6px;
//   color: ${({theme}) => theme.colorV2.secondary};
// `;

const getCoinPrecision = (coin, from, to) => {
  return coin === from.coin ? from.precision : to.precision;
};

const getCoinMarketPrice = (coin, fromCoin, data) => {
  return coin === fromCoin ? data.price : data.inversePrice;
};

/**
 * LimitPriceArea
 * 输入限价单价格区域
 * 1. 每 5s 一轮训市价，点击市价填充输入框价格
 * 2. 价格变化需要去计算 get 数量，并计算反向价格 用于切换，用 1 除以价格得到反向价格
 * 3.
 */
const LimitPriceArea = memo(props => {
  const {...restProps} = props;
  const theme = useTheme();
  const isSymbolDisabled = useIsSymbolDisabled();
  const [changeBg, setChangeBg] = useState(false);
  const [pageFocus, setPageFocus] = useState(false);

  const [firstLoaded, setFirstLoaded] = useState(false);
  const {_t, numberFormat} = useLang();
  const dispatch = useDispatch();

  const from = useSelector(state => state.convert.from);
  const to = useSelector(state => state.convert.to);
  const limitPriceInfo = useSelector(state => state.convert.limitPriceInfo);
  const limitMarketPriceInfo = useSelector(
    state => state.convert.limitMarketPriceInfo,
  );
  const priceInfo = useSelector(state => state.convert.priceInfo);
  const orderType = useSelector(state => state.convert.orderType);
  const currentEstimates = useSelector(state => state.convert.currentEstimates);
  const isLogin = useSelector(state => state.app.isLogin);

  const {loopDurationTime} = priceInfo;

  const isLimit = orderType === 'LIMIT';

  // const {numberFormat} = useLang();

  // 标记请求时序，废弃过期请求
  const countRef = useRef(0);

  const updateRefreshing = v => {
    dispatch({
      type: 'convert/update',
      payload: {
        limitRefreshing: v,
      },
    });
  };

  /**
   * initial - 第一次询价，需要填充输入框的价格
   * 根据 币种 去获取市价
   * 获取第一次的市价需要进行一系列的初始化，如果切换了币种就按照第一次来
   * 轮训的时候只需要更新市价
   * 如果 toggle 和轮训结果在同一时间操作可能会导致拿到的 limitPriceInfo 不一致，需要用 同步的数据 toggleRef 来比对一下
   * 轮巡中有闭包导致 limitPriceInfo 拿得永远是第一次的值，所以 用 ref 引用来存值
   */
  const getMarketPriceApi = async (params, initial = false) => {
    const {fromCurrency, toCurrency} = params;

    if (isSymbolDisabled) return;
    try {
      if (initial) {
        updateRefreshing(true);
        countRef.current = 0;
      }
      countRef.current += 1;
      const count = countRef.current;

      // 获取市价
      const {data} = await limitQuotePrice(params);

      // 防止接口还没返回就切换了币种，导致数据错乱
      const shouldUpdateValue = count === countRef.current;

      if (!shouldUpdateValue) {
        updateRefreshing(false);

        return;
      }

      // 初始化请求去更新 价格相关数据
      if (initial) {
        // 输入框展示的价格
        const oneCoinPrice = getCoinMarketPrice(
          fromCurrency,
          data.fromCurrency,
          data,
        );
        // 反向的价格
        const eqCoinPrice = getCoinMarketPrice(
          toCurrency,
          data.fromCurrency,
          data,
        );

        const payload = {
          oneCoin: fromCurrency,
          eqCoin: toCurrency,
          oneCoinPrice,
          eqCoinPrice,
        };
        dispatch({
          type: 'convert/update',
          payload: {
            limitPriceInfo: payload,
            limitMarketPriceInfo: data,
          },
        });
      } else {
        dispatch({
          type: 'convert/update',
          payload: {
            limitMarketPriceInfo: data,
          },
        });
      }
    } catch (error) {
      console.log('limit quote price error');
    }

    if (initial) {
      updateRefreshing(false);
    }
  };

  // 轮训 更新市价
  // useInterval(
  //   () =>
  //     getMarketPriceApi({
  //       fromCurrency: from.coin,
  //       toCurrency: to.coin,
  //       fromSize: from.amount,
  //       toSize: to.amount,
  //     }),
  //   shouldClear ? null : loopDurationTime,
  // );

  const api = params => getMarketPriceApi(params, false);

  const {startPolling, cancelPolling} = usePolling({
    api,
    loopCounts: 0,
    intervalCounts: Math.floor(loopDurationTime / 1000) || 5,
  });

  /**
   * 轮训 更新市价
   */
  useEffect(() => {
    if (isLimit && firstLoaded && pageFocus) {
      const params = {
        fromCurrency: from.coin,
        toCurrency: to.coin,
        fromSize: from.amount,
        toSize: to.amount,
      };
      startPolling(params);
    } else {
      cancelPolling();
    }
  }, [
    isLimit,
    firstLoaded,
    pageFocus,
    from.coin,
    to.coin,
    from.amount,
    to.amount,
  ]);

  /**
   * 切换币种直接重新开始
   */
  useEffect(() => {
    if (isLimit && isLogin) {
      // 切换币种需要清空之前的数据
      const payload = {
        oneCoin: from.coin,
        eqCoin: to.coin,
      };
      setFirstLoaded(false);

      getMarketPriceApi(
        {
          fromCurrency: from.coin,
          toCurrency: to.coin,
        },
        true,
      ).then(() => {
        // 与轮巡间隔保持一致
        setTimeout(() => {
          setFirstLoaded(true);
        }, loopDurationTime || 5000);
      });

      dispatch({
        type: 'convert/update',
        payload: {
          limitPriceInfo: payload,
          limitMarketPriceInfo: {},
        },
      });
    }
  }, [from.coin, to.coin, isLimit, isLogin]);

  useFocusEffect(
    React.useCallback(() => {
      setPageFocus(true);

      // 页面失焦时清除定时器
      return () => {
        setPageFocus(false);
      };
    }, []),
  );

  /**
   * 点击 切换 需要调换价格模块 币种，输入框数据，市价的数据
   * 需要去计算 get 数量
   */
  const handleTogglePress = () => {
    const {oneCoin, eqCoin, oneCoinPrice, eqCoinPrice} = limitPriceInfo;

    const payload = {
      oneCoin: eqCoin,
      eqCoin: oneCoin,
      oneCoinPrice: eqCoinPrice,
      eqCoinPrice: oneCoinPrice,
    };

    dispatch({
      type: 'convert/update',
      payload: {
        limitPriceInfo: payload,
        realInputFocus: 'price',
        focusType: 'price',
      },
    });
  };

  /**
   * 价格输入框的值改变
   * 按照 eqCoin 币种精度进行截取
   * 反向值 需要用 1 除以 输入框的值，精度按照 oneCoin 的精度进行截取
   *
   */
  const handleChangeText = amount => {
    const {oneCoin} = limitPriceInfo;
    // 当前输入框取 eqCoin 的币种精度
    // const inputPrecision = getCoinPrecision(eqCoin, from, to);
    const reverseInputPrecision = getCoinPrecision(oneCoin, from, to);

    amount = handleInputAmountByPrecision(amount);

    const eqCoinPrice = divide('1', amount, reverseInputPrecision);

    dispatch({
      type: 'convert/update',
      payload: {
        limitPriceInfo: {
          ...limitPriceInfo,
          oneCoinPrice: amount,
          eqCoinPrice,
        },
        realInputFocus: 'price',
      },
    });
    dispatch({
      type: 'convert/handleLimitLogic',
      payload: {
        direction: 'price',
      },
    });
  };

  // 显示的市价
  const limitMarketPrice = getCoinMarketPrice(
    limitPriceInfo.oneCoin,
    limitMarketPriceInfo.fromCurrency,
    limitMarketPriceInfo,
  );

  /**
   * 点击市价
   * 填充输入框价格
   * 同时更新反响价格
   * 然后去走计算逻辑
   */
  const handleMarketPricePress = async () => {
    await dispatch({
      type: 'convert/update',
      payload: {
        limitPriceInfo: {
          ...limitPriceInfo,
          oneCoinPrice: limitMarketPrice,
          eqCoinPrice: getCoinMarketPrice(
            limitPriceInfo.eqCoin,
            limitMarketPriceInfo.fromCurrency,
            limitMarketPriceInfo,
          ),
        },
        // focusType: 'price',
      },
    });
    await dispatch({
      type: 'convert/handleLimitLogic',
      payload: {
        direction: 'price',
      },
    });
  };

  // 切换另外一个输入框的背景色
  useEffect(() => {
    if (currentEstimates === 'price' && limitPriceInfo.oneCoinPrice) {
      changeBackground(setChangeBg);
    } else {
      setChangeBg(false);
    }
  }, [limitPriceInfo.oneCoinPrice, currentEstimates]);

  // const tip = useMemo(() => {
  //   if (from.amount && to.amount) {
  //     if (
  //       limitPriceInfo.oneCoin === from.coin &&
  //       delt(limitPriceInfo.oneCoinPrice, limitMarketPrice)
  //     ) {
  //       return _t('uoTqfmLbhMfgM6w6dYdDfA');
  //     }

  //     if (
  //       limitPriceInfo.oneCoin === to.coin &&
  //       degt(limitPriceInfo.oneCoinPrice, limitMarketPrice)
  //     ) {
  //       return _t('aTSugS3m11DTyKAseD3jdq');
  //     }
  //   }
  // }, [
  //   limitPriceInfo.oneCoin,
  //   limitPriceInfo.eqCoin,
  //   from.coin,
  //   to.Coin,
  //   from.amount,
  //   to.amount,
  //   limitPriceInfo.oneCoinPrice,
  //   limitMarketPrice,
  // ]);

  const title = useMemo(() => {
    return getInputTitle(
      'price',
      currentEstimates,
      _t('jcnDzL7F7x7NjMTUHEtK1i'),
      _t('5XPoKV1QmsuC5YBb38Pj7d'),
    );
  }, [currentEstimates]);

  return (
    <>
      <Wrapper {...restProps} changeBg={changeBg}>
        <TitleRow>
          <Title>{title}</Title>
          <TouchableOpacity activeOpacity={1} onPress={handleMarketPricePress}>
            <Price>
              {_t('abre3o31LoFyQmSsHXDnMV', {
                num: limitMarketPrice ? numberFormat(limitMarketPrice) : '--',
              })}
            </Price>
          </TouchableOpacity>
        </TitleRow>
        <OneCoin>
          1 <CoinCodeToName coin={limitPriceInfo?.oneCoin} /> ≈{' '}
        </OneCoin>
        <InputRow>
          <Input
            selectionColor={theme.colorV2.primary}
            // isIOS={Platform.OS === 'ios'}
            placeholder={_t('application.joinus.20')}
            placeholderTextColor={theme.colorV2.text20}
            onChangeText={handleChangeText}
            keyboardType="numeric"
            inputmode="numeric"
            value={limitPriceInfo.oneCoinPrice}
            // value={inputFormatter(inputAmount, numberFormat)}
          />
          <EqCoin>
            <CoinCodeToName coin={limitPriceInfo?.eqCoin} />
          </EqCoin>

          <TouchableOpacity
            activeOpacity={1}
            onPress={handleTogglePress}
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
            <TransferBtn source={icon} />
          </TouchableOpacity>
        </InputRow>
      </Wrapper>
      {/* {tip && <TipText>{tip}</TipText>} */}
    </>
  );
});

export default LimitPriceArea;

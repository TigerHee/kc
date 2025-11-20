/**
 * Owner: willen@kupotech.com
 */
import React, {useState, useCallback, useMemo, useEffect, useRef} from 'react';
import styled from '@emotion/native';
import InputItem from './InputItem';
import MarginTips from './MarginTips';
import Switch from './Switch';
import {useDispatch, useSelector} from 'react-redux';
import {debounce} from 'lodash';
import useLang from 'hooks/useLang';
import RestrictedModal from './RestrictedModal';
import PreviewSheet from './PreviewSheet';
import {cloneDeep} from 'lodash';
import {DEFAULT_BASE, MARGIN_MARKS_TIPS} from '../config';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import PriceConvert from './PriceConvert';
import PriceRow from './PriceRow';
import {View, useWindowDimensions, Platform} from 'react-native';
import {storage} from '@krn/toolkit';
import {getCoinAvailableBalance} from 'utils/helper';
import useTracker from 'hooks/useTracker';
import useIsSymbolDisabled from 'hooks/useIsSymbolDisabled';
import More from './More';
import AccountSheet from './AccountSheet/index';
import DepositeSheet from './DepositeSheet/index';
import AccountSelect from './AccountSelect/index';
import withAuth from 'hooks/withAuth';
import LimitPriceArea from './LimitPriceArea';
import {Button} from '@krn/ui';
import useCoinMap from 'hooks/useCoinMap';
import useMarginMarkMap from 'hooks/useMarginMarkMap';
import usePolling from 'hooks/usePolling';
import useAppState from 'hooks/useAppState';
import {KRNEventEmitter} from '@krn/bridge';
import {getIsKC} from 'site/index';
import getCurrencyConfig from 'utils/getCurrencyConfig';

const AuthSwitch = Switch;
const AuthButton = withAuth(Button);

const channel = Platform.OS === 'ios' ? 'IOS' : 'ANDROID';

const FormInput = styled.View`
  flex: 1;
  margin: 16px;
`;

const BtnWrap = styled.View`
  margin: 32px 0 0;
`;

const ExtraCont = styled.View`
  position: absolute;
  top: 0;
  z-index: 2;
  padding: 4px 9px;

  background-color: ${({theme}) =>
    theme.type === 'dark'
      ? theme.colorV2.complementary
      : theme.colorV2.primary};
  border-radius: ${({theme}) =>
    theme.isRTL ? '0 24px 0 24px' : '24px 0 24px 0'};

  ${({theme}) => (theme.isRTL ? 'right: 0' : 'left: 0')};
`;

const Fee = styled.Text`
  font-size: 10px;
  font-weight: 600;
  color: white;
`;

export default ({params = {}, step, setStep}) => {
  const {_t} = useLang();
  const navigation = useNavigation();
  const isSymbolDisabled = useIsSymbolDisabled();
  const submitedRef = useRef(false);
  const isKC = getIsKC();

  const confirmOrderLoading = useSelector(
    state => state.loading.effects['convert/confirmOrder'],
  );
  const quotePriceLoading = useSelector(
    state => state.loading.effects['convert/quotePrice'],
  );
  const [balance, setBalance] = useState(null);
  const [pageFocus, setPageFocus] = useState(false);
  const appStateVisible = useAppState();

  const loginStatusLoading = useSelector(s => s.loading.effects['app/getUser']);
  const [buttonLoading, setButtonLoading] = useState(false);
  const screenHeight = Math.round(useWindowDimensions().height);

  const priceInfo = useSelector(state => state.convert.priceInfo);
  const selectAccountType = useSelector(
    state => state.convert.selectAccountType,
  );
  const focusType = useSelector(state => state.convert.focusType);
  const from = useSelector(state => state.convert.from);
  const to = useSelector(state => state.convert.to);
  const fromValidate = useSelector(state => state.convert.fromValidate);
  const toValidate = useSelector(state => state.convert.toValidate);
  const formStatus = useSelector(state => state.convert.formStatus);
  const baseConfig = useSelector(state => state.convert.baseConfig);

  const orderType = useSelector(state => state.convert.orderType);
  const limitPriceInfo = useSelector(state => state.convert.limitPriceInfo);
  const fromAvailableBalance = useSelector(
    state => state.convert.fromAvailableBalance,
  );
  const toAvailableBalance = useSelector(
    state => state.convert.toAvailableBalance,
  );
  const refreshing = useSelector(state => state.convert.refreshing);
  const limitRefreshing = useSelector(state => state.convert.limitRefreshing);

  const isLogin = useSelector(state => state.app.isLogin);
  const mainMap = useSelector(state => state.app.mainMap);
  const tradeMap = useSelector(state => state.app.tradeMap);

  const coinMap = useCoinMap();
  const marginMarkMap = useMarginMarkMap(orderType);

  const isLimit = orderType === 'LIMIT';

  const kyc3TradeLimitInfo = useSelector(
    state => state.convert.kyc3TradeLimitInfo,
  );
  const {onClickTrack, onCustomEvent} = useTracker();

  const dispatch = useDispatch();

  const handleSwitchFromAndTo = useCallback(
    debounce(
      () => {
        if (!isLimit && quotePriceLoading) return;
        dispatch({type: 'convert/switchFromAndToCoin'});
      },
      500,
      {leading: true, trailing: false},
    ),
    [quotePriceLoading, isLimit],
  );

  const api = () =>
    dispatch({
      type: 'convert/quotePrice',
      payload: {needRefresh: false, step, formStatus: 'normal'},
    });

  const onPollingEnd = useCallback(() => {
    dispatch({type: 'convert/update', payload: {formStatus: 'expire'}});
  }, []);

  const {countdownCounter, startPolling, cancelPolling} = usePolling({
    api,
    onPollingEnd,
    intervalCounts: Math.floor(priceInfo.loopDurationTime / 1000) || 5,
  });

  /**
   * 1. 如果输入框没值 || 校验没通过
   * 2. 过期
   * 3. 限价
   * 4. kyc
   * 以上条件需要取消询价
   */
  useEffect(() => {
    // 什么时候应该清掉 定时器
    const shouldCancelPolling =
      !pageFocus ||
      !fromValidate ||
      !toValidate ||
      formStatus === 'expire' ||
      isLimit ||
      kyc3TradeLimitInfo.title;

    if (shouldCancelPolling && formStatus !== 'error') {
      cancelPolling();
    } else {
      startPolling();
    }
  }, [
    formStatus,
    kyc3TradeLimitInfo.title,
    isLimit,
    fromValidate,
    toValidate,
    pageFocus,
  ]);

  /**
   * 获取某个币种对应账户下的可用额度
   */

  useEffect(() => {
    const _fromAvailableBalance = getCoinAvailableBalance({
      coin: from.coin,
      precision: from.precision,
      mainMap,
      tradeMap,
      accountType: selectAccountType,
      isLogin,
    });
    const _toAvailableBalance = getCoinAvailableBalance({
      coin: to.coin,
      precision: to.precision,
      mainMap,
      tradeMap,
      accountType: selectAccountType,
      isLogin,
    });

    dispatch({
      type: 'convert/update',
      payload: {
        fromAvailableBalance: _fromAvailableBalance,
        toAvailableBalance: _toAvailableBalance,
      },
    });
  }, [
    isLogin,
    mainMap,
    tradeMap,
    selectAccountType,
    from.coin,
    from.precision,
    to.coin,
    to.precision,
  ]);

  // 刷新询价次数 (限频500ms)
  /**
   * 市价单去掉后端接口询价
   * 限价单是前端去计算各个输入框的值
   * 市价询价
   * 输入框值变化时
   * 从其他页面跳过来时
   */
  const refreshPrice = useCallback(
    debounce(dir => {
      if (isLimit) {
        dispatch({
          type: 'convert/handleLimitLogic',
          payload: {
            direction: dir,
          },
        });
        return;
      }
      dispatch({
        type: 'convert/quotePrice',
        payload: {needRefresh: true, step, formStatus: 'normal'},
      });
    }, 500),
    [step, isLimit],
  );

  const properties = {
    from_symbol: from.coin,
    to_symbol: to.coin,
    from_amount: from.amount,
    to_amount: to.amount,
    input_position: focusType,
    account_type: selectAccountType,
  };

  // 埋点
  const track = (data, _isLimit) => {
    const {code, msg, success, return_span} = data[0] || {};

    onClickTrack({
      blockId: 'orderPreviewNew',
      locationId: 2,
      properties: {
        ...properties,
        result: success ? 'success' : 'error',
        return_span: return_span,
      },
    });
    onCustomEvent('trade_results', {
      blockId: 'trade_results',
      locationId: 1,
      properties: {
        is_success: success,
        fail_reason: success ? 'none' : `${code || ''}:${msg || ''}`,
        fail_reason_code: code || '',
        trade_pair: `${properties.from_symbol}-${properties.to_symbol}`,
        trade_service_type: 'flash_trade',
        pricing_type: _isLimit ? 'limit' : 'market',
      },
    });
  };

  /**
   * 下单，区分限价和市价
   */
  const handleClickSubmit = useCallback(async () => {
    if (
      (!isLimit && !priceInfo.tickerId) ||
      confirmOrderLoading ||
      submitedRef.current
    )
      return;

    submitedRef.current = true;

    await storage.setItem('PRE_ORDER', {from: from.coin, to: to.coin});

    const payload = isLimit
      ? {
          fromCurrency: from.coin,
          toCurrency: to.coin,
          fromSize: from.amount,
          toSize: to.amount,
          accountTypes:
            selectAccountType === 'BOTH'
              ? ['MAIN', 'TRADE']
              : [selectAccountType],
          channel,
          isLimit,
        }
      : {
          accountType: selectAccountType,
          tickerId: priceInfo.tickerId,
          channel,
          isLimit,
        };
    // 100ms内disable,不loading
    Promise.all([
      dispatch({
        type: 'convert/confirmOrder',
        payload,
      }),
    ])
      .then(data => {
        submitedRef.current = false;
        track(data, isLimit);
        // 强制kyc3限制（400303 母账号交易受限 400304 子账号交易受限）
        if ([400303, 400304].includes(+data?.[0]?.code)) {
          setStep(1);
          dispatch({
            type: 'convert/getKyc3TradeLimitInfo',
            payload: {status: 'KYC_LIMIT'},
          });
          return;
        }
        dispatch({
          type: 'convert/update',
          payload: {orderResult: data[0] || {}},
        });
        setStep(3);
        navigation.navigate('ConvertResultPage', payload);
      })
      .catch(e => {
        submitedRef.current = false;
      });
  }, [
    confirmOrderLoading,
    dispatch,
    navigation,
    priceInfo.tickerId,
    selectAccountType,
    isLimit,
    limitPriceInfo,
    limitPriceInfo.oneCoin,
    limitPriceInfo.oneCoinPrice,
    limitPriceInfo.eqCoinPrice,
    setStep,
    from,
    to,
  ]);

  const initAccount = async () => {
    await dispatch({type: 'app/getSmallExchangeConfig'});
    await dispatch({type: 'app/pullAccountCoins'});
  };

  /**
   * 每次进入页面之后都要去拉取账户信息
   */
  useFocusEffect(
    React.useCallback(() => {
      if (isLogin) {
        initAccount();
      }
      setPageFocus(true);

      return () => {
        setPageFocus(false);
      };
    }, [isLogin]),
  );

  useEffect(() => {
    if (isLogin) {
      const showSubscription = KRNEventEmitter.addListener('onShow', () => {
        initAccount();
      });

      return () => {
        showSubscription?.remove();
      };
    }
  }, [isLogin]);

  /**
   * 从其他业务携带 query 参数调过来
   * 或者记录上一次成交的 币种
   * 只有初始化才会执行
   */
  useEffect(() => {
    (async () => {
      const data = (await storage.getItem('PRE_ORDER')) || {};
      // 获取所有交易对
      dispatch({
        type: 'convert/getAllSymbolList',
        payload: {
          // 默认币种: route传入 -> 上次交易
          queryFrom: params?.from || data.from,
          queryTo: params?.from ? params?.to : data.to,
        },
      });
    })();
  }, [dispatch, params?.from, params?.to]);

  /**
   * 切换订单类型需要清空 from, to 的 amount
   */
  useEffect(() => {
    if (orderType) {
      dispatch({
        type: 'convert/getConvertCurrencyConfig',
        payload: {
          orderType: orderType,
        },
      });
    }

    const payload = {
      from: {
        ...from,
        amount: '',
      },
      to: {
        ...to,
        amount: '',
      },
      limitMarketPriceInfo: {},
    };

    dispatch({type: 'convert/update', payload});
  }, [orderType]);

  // 选择币种之后会执行
  const updatePayloadWhenCoinSelected = () => {
    try {
      if (params?.type === 'convert') {
        // 现在选择的
        const nowCoin = params.coinSelected || DEFAULT_BASE;
        const direction = params.direction || 'from';
        const payload = cloneDeep({from, to});
        // 之前选择的
        const preToCoin = to.coin;
        const preFromCoin = from.coin;

        if (direction === 'from') {
          if (nowCoin === preToCoin) {
            payload.from = to;
            payload.to = from;
          } else {
            const meta = getCurrencyConfig({
              from: nowCoin,
              to: preToCoin,
              coinMap,
              orderType,
            });
            payload.from = {
              ...payload.from,
              ...meta.from,
              amount: '',
            };
            payload.to = {...payload.to, ...meta.to};
          }
        } else {
          const meta = getCurrencyConfig({
            from: preFromCoin,
            to: nowCoin,
            coinMap,
            orderType,
          });

          payload.from = {...payload.from, ...meta.from};
          payload.to = {...payload.to, ...meta.to, amount: ''};
        }

        // 修改的当前激活方向的币种时，则清空两侧输入框
        if (direction === focusType || isLimit) {
          payload.from = {...payload.from, amount: ''};
          payload.to = {...payload.to, amount: ''};
        }

        dispatch({type: 'convert/update', payload});

        if (!isLimit) {
          refreshPrice(direction);
        }
      }
    } catch (error) {
      console.log('switch coin error');
    }
  };

  /**
   * 从币种列表选币跳转过来逻辑
   * 从 url 上 获取相关参数
   */
  useEffect(() => {
    updatePayloadWhenCoinSelected();
  }, [params]);

  /**
   * 杠杆代币时提示文案
   */
  const marginMartTip = useMemo(() => {
    const marginMark = marginMarkMap[from.coin] || marginMarkMap[to.coin];
    return marginMark?.value ? MARGIN_MARKS_TIPS[marginMark.value] : null;
  }, [marginMarkMap, from.coin, to.coin]);

  // user-info接口超过500ms还未返回结果，将按钮设置为登录中
  useEffect(() => {
    let timer;
    if (loginStatusLoading) {
      timer = setTimeout(() => setButtonLoading(true), 500);
    } else {
      setButtonLoading(false);
      timer && clearTimeout(timer);
    }
    return () => {
      setButtonLoading(false);
      timer && clearTimeout(timer);
    };
  }, [loginStatusLoading]);

  const buttonDisabled = useMemo(() => {
    return buttonLoading || baseConfig?.downtime || isSymbolDisabled;
  }, [buttonLoading, baseConfig?.downtime, isSymbolDisabled]);

  /**
   * 提交按钮的文案和action
   */
  const submitButtonProps = useMemo(() => {
    if (buttonLoading) {
      return {text: _t('c8PzBFFrKbkwpSCGHNTVoa'), action: ''};
    }

    // 已经做了登陆拦截了，这里就不需要在触发登陆了
    if (!isLogin) {
      return {text: _t('31pkhNAP8zVjGmSNeEpduX'), action: ''};
    }
    // 交易对禁用
    if (isSymbolDisabled) {
      return {text: _t('19ae9caf668a4000ab6b'), action: ''};
    }

    // 刷新报价
    if (!isLimit && (formStatus === 'error' || formStatus === 'expire')) {
      return {text: _t('5UQyhPJEGrJYMBux5dUmiB'), action: 'refresh'};
    }

    // 输入数量
    if (
      !from.amount ||
      !to.amount ||
      (isLimit && !limitPriceInfo.oneCoinPrice)
    ) {
      return {text: _t('7SC1QGsDyKE4WDGPfqJRD9'), action: 'validate'};
    }

    // 市价预览
    if (!isLimit && from.amount && to.amount) {
      return {
        text: _t('7RiVCUUeoCzKQZpcsFXEBt', {
          currency: to.coin,
        }),
        action: 'order',
      };
    }

    // 限价预览
    if (isLimit && from.amount && to.amount && limitPriceInfo.oneCoinPrice) {
      return {text: _t('gUGpera12sewHr4b4p56Ej'), action: 'order'};
    }
  }, [
    buttonLoading,
    isLogin,
    formStatus,
    from.amount,
    to.amount,
    isLimit,
    to.coin,
    limitPriceInfo.oneCoinPrice,
    isSymbolDisabled,
  ]);

  /**
   * 预览
   */
  const handleClickPreview = () => {
    const {action} = submitButtonProps;

    // 刷新报价
    if (action === 'refresh') {
      refreshPrice();
    }

    // 空值教研
    if (action === 'validate') {
      //
      dispatch({
        type: 'convert/update',
        payload: {
          triggerEmptyValidate: true,
        },
      });
    }

    // 下单
    if (action === 'order') {
      if (!fromValidate || !toValidate) {
        return;
      }
      try {
        onClickTrack({
          blockId: 'convertInputNew',
          locationId: 6,
          properties: {
            from_symbol: from.coin,
            to_symbol: to.coin,
            from_amount: from.amount,
            to_amount: to.amount,
            input_position: focusType,
            account_type: selectAccountType,
            return_span: '',
            valid_span: priceInfo.loopDurationTime,
          },
        });
      } catch (e) {
        console.log('e', e);
      }

      if (!isLimit) {
        dispatch({
          type: 'convert/update',
          payload: {
            // priceInfo: {...priceInfo, autoLoopCount: 1},
            oldInfo: {fromCurrency: '', amount: 0, toCurrency: ''},
            // from: {...from},
            // to: {...to},
          },
        });

        // 如果当前时刻没有请求，就触发一次请求，做倒计时
        if (!quotePriceLoading) {
          // dispatch({
          //   type: 'convert/quotePrice',
          //   payload: {needRefresh: true, step},
          // });
          startPolling();
        }
      } else {
        // 限价税收
        const payload = {
          fromCurrency: from.coin,
          toCurrency: to.coin,
          fromSize: from.amount,
          toSize: to.amount,
          accountTypes:
            selectAccountType === 'BOTH'
              ? ['MAIN', 'TRADE']
              : [selectAccountType],
          channel,
        };
        dispatch({
          type: 'convert/limitOrderTax',
          payload: payload,
        });
      }
      setStep(2);
    }
  };

  // app 在后台运行的时候把 loading 置为 false
  useEffect(() => {
    if (appStateVisible === 'background') {
      dispatch({
        type: 'convert/update',
        payload: {
          limitRefreshing: false,
          refreshing: false,
        },
      });
    }
  }, [appStateVisible]);

  return (
    <FormInput
      bounces={false}
      contentContainerStyle={
        // 当主屏高度太小时，启用滚动条
        screenHeight < 750 ? null : {justifyContent: 'space-between', flex: 1}
      }>
      <View>
        <AccountSelect />

        {/* from */}
        <InputItem
          setStep={setStep}
          direction="from"
          onChange={refreshPrice}
          setBalance={setBalance}
          data={{...from, availableBalance: fromAvailableBalance}}
        />
        {/* switch */}
        <AuthSwitch
          onPress={handleSwitchFromAndTo}
          compact={baseConfig?.message}
          loading={refreshing || limitRefreshing}
        />
        {/* to */}
        <InputItem
          setStep={setStep}
          direction="to"
          onChange={refreshPrice}
          data={{...to, availableBalance: toAvailableBalance}}
        />

        {/* 限价单输入框模块 */}
        {isLimit && <LimitPriceArea />}

        {/* 杠杆 ETF 代币提示模块 */}
        {marginMartTip && isKC ? <MarginTips text={_t(marginMartTip)} /> : null}

        {/* 市价单 价格预览模块 */}
        {!isLimit && <PriceRow />}
        {/* 市价单 ErrorTip 模块，包含过期 和 服务异常 */}
        {!isLimit ? <PriceConvert /> : null}

        <BtnWrap>
          <ExtraCont pointerEvents="none">
            <Fee>{_t('5UoUji8yQgm9qSDZjADU5i')}</Fee>
          </ExtraCont>
          <AuthButton
            size="large"
            onPress={handleClickPreview}
            disabled={buttonDisabled}
            loading={{
              spin: buttonLoading,
              color: '#fff',
              size: 'small',
            }}>
            {submitButtonProps.text}
          </AuthButton>
        </BtnWrap>
        {/* 只有 KC 需要展示更多 */}
        {isKC && <More />}
      </View>

      {/* kyc 的弹窗 */}
      <RestrictedModal
        show={!!kyc3TradeLimitInfo?.title}
        onClose={() =>
          dispatch({type: 'convert/update', payload: {kyc3TradeLimitInfo: {}}})
        }
        title={kyc3TradeLimitInfo?.title}
        content={kyc3TradeLimitInfo?.content}
        buttonAgree={kyc3TradeLimitInfo?.buttonAgree}
        buttonAgreeAppUrl={kyc3TradeLimitInfo?.buttonAgreeAppUrl}
        buttonRefuse={
          kyc3TradeLimitInfo?.buttonRefuse || _t('2SDpaTU7ZKhWG2tVWybVqr')
        }
        buttonRefuseAppUrl={kyc3TradeLimitInfo?.buttonRefuseAppUrl}
      />
      <AccountSheet coin={from.coin} precision={from.precision} />
      <DepositeSheet coin={from.coin} accountType={selectAccountType} />
      {/* 点击确认订单显示预览 */}
      {step === 2 ? (
        <PreviewSheet
          properties={properties}
          step={step}
          setStep={setStep}
          balance={balance}
          confirmOrderLoading={confirmOrderLoading}
          quotePriceLoading={quotePriceLoading}
          onSubmitClick={handleClickSubmit}
          refreshPrice={refreshPrice}
          countdownCounter={countdownCounter}
        />
      ) : null}
    </FormInput>
  );
};

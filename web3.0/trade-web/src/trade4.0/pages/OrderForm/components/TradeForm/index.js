/*
 * owner: borden@kupotech.com
 */
import React, {
  useRef,
  useState,
  Suspense,
  Fragment,
  forwardRef,
  useCallback,
  useImperativeHandle,
} from 'react';
import {
  has,
  pick,
  isNil,
  reduce,
  isEqual,
  toPairs,
  debounce,
} from 'lodash';
import { useDispatch, useSelector } from 'dva';
import { Box } from '@kux/mui';
import Form from '@mui/Form';
import { InputNumberSuffix } from '@mui/InputNumber';
import { _t, _tHTML } from 'src/utils/lang';
import { divide, multiply, normalizeNumber } from 'src/helper';
import { useGetCurrentSymbolInfo } from '@/hooks/common/useSymbol';
import usePair from '@/hooks/common/usePair';
import useStateRef from '@/hooks/common/useStateRef';
import useIsMargin from '@/hooks/useIsMargin';
import useSensorFunc from '@/hooks/useSensorFunc';
import { getAvailableBalance } from '@/hooks/useAvailableBalance';
import { getMarginOrderModeType } from '@/hooks/useMarginOrderModeType';
import { execMaybeFn } from '@/utils/tools';
import voice from '@/utils/voice';
import { getStateFromStore } from '@/utils/stateGetter';
import { numberFormatter, calcMaxVolume, getPriceForCalc } from '../../utils';
import useOrderType from '../../hooks/useOrderType';
import useBPP from './hooks/useBPP';
import useEvent from './hooks/useEvent';
import usePercent from './hooks/usePercent';
import usePriceInput from './hooks/usePriceInput';
import useAmountInput from './hooks/useAmountInput';
import useVolumeInput from './hooks/useVolumeInput';
import useAmountConfig from './hooks/useAmountConfig';
import useInitForm from './hooks/useInitForm';
import useRangeInput from './hooks/useRangeInput';
import useBorrowingAmount from './hooks/useBorrowingAmount';
import useAuctionValidator from './hooks/useAuctionValidator';
import useOrderState from '../../hooks/useOrderState';
import useSide from '../../hooks/useSide';
import useLastPrice from './hooks/useLastPrice';
import Unit from './components/Unit';
import AvaliableBar from './components/AvaliableBar';
import OrderButtons from './components/OrderButtons';
import Advanced from './components/Advanced';
import getMaxAmount from './utils/getMaxAmount';
import { TRADE_SIDE_MAP } from '../../config';
import { useYScreen } from '@/pages/OrderForm/config';
import useOrderCurrency from '@/pages/OrderForm/hooks/useOrderCurrency.js';
import AdvancedSelect from './components/Advanced/AdvancedSelect';
import {
  MarketPrice,
  PercentButtons,
  OrderButtonsBox,
  StyledInputNumber,
  StyledCoinCurrency,
  StyledInputWithToolTip,
} from './style';

const { FormItem, useForm } = Form;

const MarginSetting = React.lazy(() => {
  return import(
    /* webpackChunkName: 'tradev4-orderFormMarginSetting' */ './components/MarginSetting'
  );
});
const MarginOrderInfo = React.lazy(() => {
  return import(
    /* webpackChunkName: 'tradev4-orderFormMarginOrderInfo' */ './components/MarginOrderInfo'
  );
});

const LeverConfirmModal = React.lazy(() => {
  return import(
    /* webpackChunkName: 'tradev4-orderFormLeverConfirmModal' */ '@/pages/Portal/LeverConfirmModal'
  );
});
const OrderComfirmModal = React.lazy(() => {
  return import(
    /* webpackChunkName: 'tradev4-orderFormOrderComfirmModal' */ '@/pages/Portal/OrderComfirmModal'
  );
});

const TradeFormContent = React.memo(({
  onSubmit, isFloat, lastPrice: lastPriceVal, innerRef: ref,
}) => {
  const [form] = useForm();
  // 提交锁
  const isSubmitLocked = useRef(false);
  const dispatch = useDispatch();
  const { side } = useSide();
  const yScreen = useYScreen();
  const isMargin = useIsMargin();
  const sensorFunc = useSensorFunc();
  const price = Form.useWatch('price', form);
  const limitPrice = Form.useWatch('limitPrice', form);
  const triggerPrice = Form.useWatch('triggerPrice', form);
  const amount = Form.useWatch('amount', form);
  const volume = Form.useWatch('volume', form);
  const unitDict = useSelector((state) => state.symbols.unitDict);
  const { showAuction } = useOrderState();
  const { amountPrecision, amountMin, amountIncrement } = useAmountConfig();
  const { checkBPP, isNeedCheckBPP } = useBPP();
  const { symbol, baseInfo, quoteInfo } = usePair();
  const currentSymbolInfo = useGetCurrentSymbolInfo();
  const { isMarket, isTrigger, orderType, orderTypeConfig } = useOrderType();
  const prices = useSelector((state) => state?.currency?.prices);

  const hideVolume = orderTypeConfig?.showVolume === false;
  const isBuy = side === TRADE_SIDE_MAP.buy.value;
  const isMarketBuy = isMarket && isBuy;
  const { precision } = baseInfo;
  const { pricePrecision, priceIncrement } = currentSymbolInfo;
  const { currency: quote, currencyName: quoteName } = quoteInfo;

  const [errors, setErrors] = useState(null);
  const [focusField, setFocusField] = useState(null);
  const [BPPConfirmOpen, setBPPConfirmOpen] = useState(false);
  const [levelConfirmOpen, setLevelConfirmOpen] = useState(false);
  const { currency } = useOrderCurrency({ side });
  // 劫持setFieldsValue, 来触发price、amount、volume三者的联动
  const setFieldsValue = (values) => {
    const changedValues = pick(values, ['price', 'amount', 'volume']);
    form.setFieldsValue(values);
    onValuesChange(changedValues);
  };

  useEvent({ setFieldsValue });
  const initForm = useInitForm({ form, setErrors, setFocusField });
  const { quoteMinSize } = currentSymbolInfo;
  const unitValue = unitDict[quote] || '';
  // console.log(unitDict, 'unitDict--------');
  const maxVolume = calcMaxVolume(quoteMinSize, unitValue);
  const priceForCalc = getPriceForCalc(orderType, side, price, limitPrice);
  // 一些参数
  const commonParamsRef = useStateRef({
    lastPriceVal,
    isBuy,
    showAuction,
  });
  const showAdvanced = !!execMaybeFn(
    orderTypeConfig?.showAdvanced,
    commonParamsRef.current,
  );
  const auctionRules = useAuctionValidator();

  const limitPriceInput = usePriceInput({
    ...execMaybeFn(
      orderTypeConfig?.limitPriceConf?.itemConf,
      commonParamsRef.current,
    ),
    name: 'limitPrice',
    price: limitPrice,
    lastPriceVal,
  });
  const priceInput = usePriceInput({
    extraRules: auctionRules,
    ...execMaybeFn(orderTypeConfig?.priceConf?.itemConf),
    name: 'price',
    price,
    lastPriceVal,
    // lastPriceVal: '', // mock
  });
  const amountInput = useAmountInput({ form, amount, maxVolume, price: priceForCalc });
  const volumeInput = useVolumeInput({ unitValue });

  const triggerPriceInput = usePriceInput({
    ...execMaybeFn(
      orderTypeConfig?.triggerConf?.itemConf,
      commonParamsRef.current,
    ),
    name: 'triggerPrice',
    price: triggerPrice, // 触发价格不自动带入最新价格 不需要传递lastPriceVal
  });
  const rangeInput = useRangeInput({
    ...execMaybeFn(orderTypeConfig?.rangeConf?.itemConf),
    name: 'pop',
    setFieldsValue,
  });
  const percentProps = usePercent({
    setFieldsValue,
    price: priceForCalc,
  });
  // 杠杆下单应借入数量信息
  const { borrowingAmount, showBorrowingInfo } = useBorrowingAmount({
    amount,
    price: priceForCalc,
  });
  // 通用数量数量框属性
  const commonInputNumberProps = {
    variant: 'filled',
    size: yScreen === 'sm' ? 'small' : 'medium',
  };

  useImperativeHandle(ref, () => ({
    submitCallback,
  }));

  const onCancelLevelConfirm = useCallback(() => {
    setLevelConfirmOpen(false);
  }, []);

  const onCanceBPPConfirm = useCallback(() => {
    setBPPConfirmOpen(false);
  }, []);

  // 关闭提示，如果值是空，则去掉错误信息
  const onFieldFocus = useCallback(
    async (key) => {
      setFocusField({ [key]: true });
      const values = form.getFieldsValue(true);
      const value = values[key];
      const isEmptyValue = isNil(value);
      if (!isEmptyValue) {
        try {
          await form.validateFields([key]);
          setErrors(null);
        } catch (e) {
          if (e?.errorFields[0]?.errors) {
            setErrors((pre) => ({
              ...pre,
              [key]: e?.errorFields[0]?.errors[0],
            }));
          }
        }
      } else {
        setErrors((pre) => ({ ...pre, [key]: undefined }));
      }
      const nextErrorInfo = toPairs(errors)
        .filter((v) => v[1] && isNil(values[v[0]]))
        .map((v) => ({
          name: v[0],
          errors: [],
        }));
      form.setFields(nextErrorInfo);
    },
    [errors, form],
  );

  const onFieldBlur = useCallback((key) => {
    setFocusField((pre) => ({ ...pre, [key]: false }));
  }, []);

  const onFieldsChange = useCallback((_, allFields) => {
    const nextErrors = reduce(
      allFields,
      (a, b) => {
        a[b.name[0]] = b.errors[0];
        return a;
      },
      {},
    );
    setErrors((pre) => (!isEqual(pre, nextErrors) ? nextErrors : pre));
  }, []);

  const onValuesChange = useCallback(
    debounce((changedValues) => {
      if (isMarket) return;
      const allValues = { ...form.getFieldsValue(true), ...changedValues };
      if (has(changedValues, 'amount') || has(changedValues, 'price')) {
        let nextVolume;
        try {
          if (+allValues.price && +allValues.amount) {
            nextVolume = normalizeNumber(
              multiply(+allValues.amount, +allValues.price).toFixed(),
              pricePrecision,
            );
          }
          form.setFieldsValue({ volume: nextVolume });
          if (!isNil(nextVolume)) {
            form.validateFields(['volume']).catch((err) => {
              const nextFocusField = reduce(
                err?.errorFields,
                (a, b) => {
                  a[b.name] = true;
                  return a;
                },
                {},
              );
              setFocusField(nextFocusField);
            });
          }
        } catch (e) {
          console.log('price or amount error', e);
        }
      } else if (has(changedValues, 'volume')) {
        if (+allValues.price) {
          let nextAmount;
          try {
            if (+allValues.volume) {
              nextAmount = normalizeNumber(
                divide(+allValues.volume, +allValues.price),
                amountPrecision,
              );
            }
            if (isBuy) {
              const maxAmount = getMaxAmount({ side, price: +allValues.price });
              // 非市价买单，取扣掉手续费的最大可用(包含可借)*百分比
              // 下单金额小于等于账户余额，但若加上手续费却大于账户余额的时候，此时按照用户最大可交易数量，进行下单，而非拦截报错
              const { maxAvailableBalance } = getAvailableBalance({ side, currency });
              if (+allValues.volume <= +maxAvailableBalance && +maxAmount <= +nextAmount) {
                const nextMaxVolume = normalizeNumber(
                  multiply(+allValues.price, +maxAmount),
                  amountPrecision,
                );
                form.setFieldsValue({ amount: maxAmount });
                form.setFieldsValue({ volume: nextMaxVolume });
                return;
              }
            }
            form.setFieldsValue({ amount: nextAmount });
          } catch (e) {
            console.log('price or volume error', e);
          }
        } else if (+allValues.amount) {
          let nextPrice;
          try {
            if (+allValues.volume) {
              nextPrice = normalizeNumber(
                divide(+allValues.volume, +allValues.amount),
                pricePrecision,
              );
            }
            form.setFieldsValue({ price: nextPrice });
          } catch (e) {
            console.log('amount or volume error', e);
          }
        }
      } else if (has(changedValues, 'timeInForce')) {
        form.setFieldsValue({ timeInForce: changedValues.timeInForce });
      }
    }, 500),
    [
      side,
      isMarket,
      amountPrecision,
      pricePrecision,
      precision,
      currency,
    ],
  );

  const getInputWithToolTipProps = (name, title, coin, value) => {
    const disabled = !focusField?.[name];
    const rate = prices && coin && prices[coin] ? prices[coin] : '';
    const newTitle = !disabled ? errors?.[name] || title : null;
    const hide =
      !!(!rate || value === null || isNaN(+value)) && !errors?.[name];
    return {
      disabled,
      title: newTitle,
      hideToolTip: hide,
    };
  };

  const getFieldFocusEventsProps = (name) => {
    return {
      onBlur: () => onFieldBlur(name),
      onFocus: () => onFieldFocus(name),
    };
  };

  // 提交接口的回调
  const submitCallback = useCallback(
    (res) => {
      // 成功发布委托
      if (res?.success) {
        const { retentionData } = getStateFromStore(state => state.futuresSetting);
        // 如果没有设置保留表单项，则清空表单输入
        if (!retentionData) {
          initForm();
        }
        if (levelConfirmOpen) {
          onCancelLevelConfirm();
        }
        if (BPPConfirmOpen) {
          onCanceBPPConfirm();
        }
      }
    },
    [initForm, levelConfirmOpen, BPPConfirmOpen, onCancelLevelConfirm, onCanceBPPConfirm],
  );

  // 继续提交
  const submitFormat = orderTypeConfig?.submitFormat;
  const continueSubmit = useCallback(async (params) => {
    if (onSubmit) {
      params =
        typeof submitFormat === 'function'
          ? submitFormat(params, commonParamsRef.current)
          : params;

      isSubmitLocked.current = true;
      const { currentMarginOrderMode } = getMarginOrderModeType({ side: params?.side });
      const res = await onSubmit({ ...params, currentMarginOrderMode }); // 传入当前表单的下单模式
      isSubmitLocked.current = false;

      submitCallback(res);
    }
  }, [onSubmit, submitCallback, submitFormat]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      sensorFunc(['trading', side, 'click'], { symbol, orderType });
      if (isSubmitLocked.current) return;
      form
        .validateFields()
        .then(async (params) => {
          const values = {
            ...params,
            showAdvanced,
          };
          // 暂存
          dispatch({
            type: 'tradeForm/update',
            payload: {
              formValues: {
                side,
                vals: values,
                tradeType: orderType,
              },
            },
          });
          if (borrowingAmount) {
            setLevelConfirmOpen(true);
            return;
          }
          const isShowBPP = await checkBPP(side);
          if (isShowBPP) {
            setBPPConfirmOpen(true);
            return;
          }
          continueSubmit({ values, side });
        })
        .catch((err) => {
          voice.notify('error_boundary');
          const nextFocusField = reduce(
            err?.errorFields,
            (a, b) => {
              a[b.name] = true;
              return a;
            },
            {},
          );
          setFocusField(nextFocusField);
        });
    },
    [
      sensorFunc,
      side,
      symbol,
      form,
      showAdvanced,
      dispatch,
      orderType,
      borrowingAmount,
      checkBPP,
      continueSubmit,
    ],
  );
  const step = isMarketBuy ? maxVolume : amountMin || amountIncrement;
  return (
    <Fragment>
      {/* ****** 杠杆借入确认 ***** */}
      {Boolean(borrowingAmount) && (
        <Suspense fallback={<div />}>
          <LeverConfirmModal
            onOk={continueSubmit}
            open={levelConfirmOpen}
            onCancel={onCancelLevelConfirm}
            borrowingAmount={borrowingAmount}
            showBorrowingInfo={showBorrowingInfo}
          />
        </Suspense>
      )}
      {/* ****** 破产价格保护确认 ***** */}
      {isNeedCheckBPP && (
        <Suspense fallback={<div />}>
          <OrderComfirmModal
            onOk={continueSubmit}
            open={BPPConfirmOpen}
            onCancel={onCanceBPPConfirm}
          />
        </Suspense>
      )}
      {/* ****** 杠杆设置区 ***** */}
      {isMargin && (
        <Suspense fallback={<Box height={24} />}>
          <MarginSetting isFloat={isFloat} />
        </Suspense>
      )}
      {/* ****** 可用 ***** */}
      <AvaliableBar />
      <Form
        form={form}
        onFieldsChange={onFieldsChange}
        data-inspector="trade-orderForm-form"
        initialValues={{ timeInForce: 'GTC' }}
      >
        {/* ****** 限制价格 ***** */}
        {!!orderTypeConfig?.limitPriceConf && (
          <StyledInputWithToolTip
            {...getInputWithToolTipProps(
              'limitPrice',
              limitPrice ? <StyledCoinCurrency coin={quote} value={limitPrice} /> : null,
              quote,
              limitPrice,
            )}
          >
            <FormItem
              noStyle
              {...limitPriceInput.formItemProps}
              {...execMaybeFn(orderTypeConfig?.limitPriceConf?.itemProps)}
            >
              <StyledInputNumber
                {...commonInputNumberProps}
                placeholder={isBuy ? _t('trd.form.dirc.buy') : _t('trd.form.dirc.sell')}
                {...getFieldFocusEventsProps('limitPrice')}
                {...limitPriceInput.inputProps}
                {...execMaybeFn(orderTypeConfig?.limitPriceConf?.inputProps)}
                min={0}
                // min={+limitPrice <= 0 ? 0 : +priceIncrement || 0}
                className={
                  !limitPrice || limitPrice === '0' || (limitPrice && limitPrice === priceIncrement) // 价格缺省时 ｜ 价格为最小精度时禁止点击
                    ? 'disabled_minus'
                    : ''
                }
              />
            </FormItem>
          </StyledInputWithToolTip>
        )}
        {/* ****** 触发价 ***** */}
        {(isTrigger || !!orderTypeConfig?.triggerConf) && (
          <StyledInputWithToolTip {...getInputWithToolTipProps('triggerPrice')}>
            <FormItem
              noStyle
              {...triggerPriceInput.formItemProps}
              {...execMaybeFn(orderTypeConfig?.triggerConf?.itemProps)}
            >
              <StyledInputNumber
                {...commonInputNumberProps}
                placeholder={_t('trd.form.stop.price')}
                {...getFieldFocusEventsProps('triggerPrice')}
                {...triggerPriceInput.inputProps}
                {...execMaybeFn(orderTypeConfig?.triggerConf?.inputProps)}
                min={0}
                // min={+triggerPrice <= 0 ? 0 : +priceIncrement || 0}
                className={
                  !triggerPrice ||
                  triggerPrice === '0' ||
                  (triggerPrice && triggerPrice === priceIncrement) // 价格缺省时 ｜ 价格为最小精度时禁止点击
                    ? 'disabled_minus'
                    : ''
                }
              />
            </FormItem>
          </StyledInputWithToolTip>
        )}
        {/* *** 回调幅度 **** */}
        {!!orderTypeConfig?.rangeConf && (
          <StyledInputWithToolTip {...getInputWithToolTipProps('pop')}>
            <FormItem
              noStyle
              {...rangeInput.formItemProps}
              {...execMaybeFn(orderTypeConfig?.rangeConf?.itemProps)}
            >
              <InputNumberSuffix
                {...commonInputNumberProps}
                placeholder={_t('trd.form.tso.ratio')}
                {...getFieldFocusEventsProps('pop')}
                {...rangeInput?.inputProps}
                {...execMaybeFn(orderTypeConfig?.rangeConf?.inputProps)}
              />
            </FormItem>
          </StyledInputWithToolTip>
        )}
        {/* ****** 高级限价单类型 ***** */}
        {orderType === 'advancedLimit' && (
          <FormItem noStyle name="timeInForce">
            <AdvancedSelect onChange={(v) => onValuesChange({ timeInForce: v })} />
          </FormItem>
        )}
        {/* ****** 价格 ***** */}
        {orderType !== 'timeWeightedOrder' && (
          <StyledInputWithToolTip
            {...getInputWithToolTipProps(
              'price',
              price ? <StyledCoinCurrency coin={quote} value={price} /> : null,
              quote,
              price,
            )}
            {...execMaybeFn(orderTypeConfig?.priceConf?.itemProps)}
          >
            {isMarket && <MarketPrice>{_t('trd.form.best.market.price')}</MarketPrice>}
            <FormItem noStyle {...priceInput.formItemProps}>
              <StyledInputNumber
                {...commonInputNumberProps}
                isMarket={isMarket}
                onChange={(v) => onValuesChange({ price: v })}
                placeholder={isBuy ? _t('trd.form.dirc.buy') : _t('trd.form.dirc.sell')}
                data-inspector={isBuy ? 'trade-orderForm-form-buy' : 'trade-orderForm-form-sell'}
                {...getFieldFocusEventsProps('price')}
                {...priceInput.inputProps}
                {...execMaybeFn(orderTypeConfig?.priceConf?.inputProps)}
                min={0}
                // min={+price <= 0 ? 0 : +priceIncrement || 0}
                className={
                  !price || price === '0' || (price && price === priceIncrement)
                    ? 'disabled_minus'
                    : '' // 价格缺省时 ｜ 价格为最小精度时禁止点击
                }
              />
            </FormItem>
          </StyledInputWithToolTip>
        )}
        {/* ****** 数量 ***** */}
        <StyledInputWithToolTip {...getInputWithToolTipProps('amount')}>
          <FormItem noStyle {...amountInput.formItemProps}>
            <StyledInputNumber
              {...commonInputNumberProps}
              onChange={(v) => onValuesChange({ amount: v })}
              data-inspector={
                isBuy ? 'trade-orderForm-form-buy-amount' : 'trade-orderForm-form-sell-amount'
              }
              {...getFieldFocusEventsProps('amount')}
              {...amountInput.inputProps}
              // min={+amount <= 0 ? 0 : isMarketBuy ? maxVolume : +amountMin}
              min={0}
              className={
                !amount || amount === '0' || (amount && +amount === +step) // 数量缺省时 ｜ 数量为最小精度时禁止点击
                  ? 'disabled_minus'
                  : ''
              }
              // 市价 ｜ 市价止损买入时 默认最小价格为该币对的最小下单金额与0.1U的较大值
              // 其他为买入/卖出数量时 默认最小数量为币对base币种最小下单数量
            />
          </FormItem>
        </StyledInputWithToolTip>
        {/* ****** 百分比按钮组 ***** */}
        {orderTypeConfig?.showPercent !== false && <PercentButtons {...percentProps} />}
        {/* ****** 成交量 ***** */}
        {!isMarket && (
          <StyledInputWithToolTip
            isHidden={hideVolume}
            {...getInputWithToolTipProps(
              'volume',
              !hideVolume && volume ? <StyledCoinCurrency coin={quote} value={volume} /> : null,
              quote,
              volume,
            )}
          >
            <FormItem noStyle name="volume" {...(hideVolume ? null : volumeInput.formItemProps)}>
              <StyledInputNumber
                {...commonInputNumberProps}
                autoFixPrecision={false}
                precision={pricePrecision}
                formatter={numberFormatter}
                unit={<Unit coinName={quoteName} />}
                placeholder={_t('orders.col.funds')}
                data-inspector={
                  isBuy ? 'trade-orderForm-form-buy-volume' : 'trade-orderForm-form-sell-volume'
                }
                onChange={(v) => onValuesChange({ volume: v })}
                {...getFieldFocusEventsProps('volume')}
                min={0}
              />
            </FormItem>
          </StyledInputWithToolTip>
        )}
        {/* ****** 杠杆下单后的借还数据 ***** */}
        {isMargin && (
          <Suspense fallback={<div />}>
            <MarginOrderInfo
              amount={amount}
              price={priceForCalc}
              borrowingAmount={borrowingAmount}
              showBorrowingInfo={showBorrowingInfo}
            />
          </Suspense>
        )}
        {/* ****** 高级模式 ***** */}
        {showAdvanced && <Advanced amount={amount} />}
        {/* ****** 下单按钮 ***** */}
        <OrderButtonsBox>
          <OrderButtons
            data-inspector={
              isBuy
                ? 'trade-orderForm-form-buy-orderButton'
                : 'trade-orderForm-form-sell-orderButton'
            }
            onClick={handleSubmit}
          />
        </OrderButtonsBox>
      </Form>
    </Fragment>
  );
});

const TradeForm = ({ onSubmit, isFloat }, ref) => {
  // 最新成交价，因最新价格更新太频繁，这里做一下缓存
  const lastPrice = useLastPrice();
  return (
    <TradeFormContent innerRef={ref} onSubmit={onSubmit} isFloat={isFloat} lastPrice={lastPrice} />
  );
};

export default forwardRef(TradeForm);

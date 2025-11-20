/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-04-23 23:01:53
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-05-14 00:21:28
 * @FilePath: /trade-web/src/trade4.0/pages/OrderForm/components/TradeForm/formModules/TimeWeightedForm.js
 * @Description: 时间加权委托 form 文件
 */

import React, {
  useRef,
  useState,
  Fragment,
  useCallback,
  forwardRef,
  useMemo,
  useImperativeHandle,
} from 'react';
import { isNil, reduce, isEqual, toPairs } from 'lodash';
import { useDispatch, useSelector } from 'dva';
import Form from '@mui/Form';
import { _t, _tHTML } from 'src/utils/lang';
import { divide, multiply, add } from 'src/helper';
import { useGetCurrentSymbolInfo } from '@/hooks/common/useSymbol';
import usePair from '@/hooks/common/usePair';
import useStateRef from '@/hooks/common/useStateRef';
import useSensorFunc from '@/hooks/useSensorFunc';
import { getMarginOrderModeType } from '@/hooks/useMarginOrderModeType';
import { execMaybeFn } from '@/utils/tools';
import voice from '@/utils/voice';
import { getStateFromStore } from '@/utils/stateGetter';
import useOrderType from '../../../hooks/useOrderType';
import useEvent from '../hooks/useEvent';
import useInitForm from '../hooks/useInitForm';
import usePriceInput from '../hooks/usePriceInput';
import useTotalAmountInput from '../hooks/useTotalAmountInput';
import useSingleAmountInput from '../hooks/useSingleAmountInput';
import usePriceVarInput from '../hooks/usePriceVarInput';
import useDurationInput from '../hooks/useDurationInput';
import useAmountConfig from '../hooks/useAmountConfig';
import useOrderState from '../../../hooks/useOrderState';
import useSide from '../../../hooks/useSide';
import useLastPrice from '../hooks/useLastPrice';
import OrderButtons from '../components/OrderButtons';
import { TRADE_SIDE_MAP } from '../../../config';
import { useYScreen } from '@/pages/OrderForm/config';
import { formatNumber } from '@/utils/format';
import DoubleValidateDialog from '../components/DoubleValidateDialog';
import useTimeWeightedOrderConfig from '../hooks/useTimeWeightedOrderConfig';
import AvaliableBar from '@/pages/OrderForm/components/TradeForm/components/AvaliableBar/index.js';
import { doubleValidateFields, limitPriceValidator } from './utils/timeWeightedUtils';
import {
  OrderButtonsBox,
  StyledInputNumber,
  StyledCoinCurrency,
  StyledInputWithToolTip,
  ExpectedVolume,
  ExpectedVolumeTitle,
  ExpectedVolumeNumber,
  ExpectedFormatNumber,
  ExpectedLine,
  ExpectedUnit,
  TimeSeparator,
} from '../style';

const { FormItem, useForm } = Form;

const submitFormat = (data) => {
  const { totalAmount, singleAmount, priceVar, price, distanceType, limitPrice, ...others } =
    data?.values || {};
  let calcPriceVar;
  if (distanceType === 'PERCENT') {
    calcPriceVar = divide(priceVar, 100);
  } else {
    calcPriceVar = priceVar;
  }
  return {
    ...data,
    values: {
      ...others,
      priceLimit: limitPrice,
      size: totalAmount,
      singleOrderSize: singleAmount,
      distanceType,
      distanceValue: calcPriceVar,
    },
  };
};

const TimeWeightedForm = ({ onSubmit }, ref) => {
  const [form] = useForm();
  // 提交锁
  const isSubmitLocked = useRef(false);
  const dispatch = useDispatch();
  const { side } = useSide();
  const yScreen = useYScreen();
  const sensorFunc = useSensorFunc();
  const totalAmount = Form.useWatch('totalAmount', form);
  const distanceType = Form.useWatch('distanceType', form);
  const singleAmount = Form.useWatch('singleAmount', form);
  const limitPrice = Form.useWatch('limitPrice', form);
  const durationHour = Form.useWatch('durationHour', form);
  const durationMinute = Form.useWatch('durationMinute', form);
  const { showAuction } = useOrderState();
  const { amountMin, amountIncrement } = useAmountConfig();
  const { symbol, quoteInfo } = usePair();
  const currentSymbolInfo = useGetCurrentSymbolInfo();
  const { orderType, orderTypeConfig } = useOrderType();
  const prices = useSelector((state) => state?.currency?.prices);
  const isBuy = side === TRADE_SIDE_MAP.buy.value;
  const { pricePrecision, priceIncrement } = currentSymbolInfo;
  const { currency: quote, currencyName: quoteName } = quoteInfo;
  const [errors, setErrors] = useState(null);
  const [focusField, setFocusField] = useState(null);
  const { timeWeightedOrderConfig, pricesUSD } = useTimeWeightedOrderConfig();
  const [validateDialog, setValidateDialog] = useState({ visible: false, contentText: [] });
  const setFieldsValue = (values) => {
    form.setFieldsValue(values);
  };
  useEvent({ setFieldsValue });
  const initForm = useInitForm({ form, setErrors, setFocusField });
  // 最新成交价
  const lastPriceVal = useLastPrice();

  // 一些参数
  const commonParamsRef = useStateRef({
    lastPriceVal,
    isBuy,
    showAuction,
    timeWeightedOrderConfig,
    pricesUSD,
  });

  // 通用数量数量框属性
  const commonInputNumberProps = {
    variant: 'filled',
    size: yScreen === 'sm' ? 'small' : 'medium',
  };

  useImperativeHandle(ref, () => ({
    submitCallback,
  }));

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

  const getInputWithToolTipProps = (name, title, coin, value) => {
    const disabled = !focusField?.[name];
    const rate = prices && coin && prices[coin] ? prices[coin] : '';
    const newTitle = !disabled ? errors?.[name] || title : null;
    const hide = !!(!rate || value === null || isNaN(+value)) && !errors?.[name];
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
        const { retentionData } = getStateFromStore((state) => state.futuresSetting);
        // 如果没有设置保留表单项，则清空表单输入
        if (!retentionData) {
          initForm();
        }
      }
    },
    [initForm],
  );

  // 继续提交
  const continueSubmit = useCallback(
    async (params) => {
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
    },
    [onSubmit, submitCallback, submitFormat, setValidateDialog],
  );

  const handleSubmit = useCallback(
    (e) => {
      // 如果 e 存在并且具有 preventDefault 方法，那么调用它
      if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
      }
      let validateResult = false;
      if (e && typeof e === 'object' && !e.preventDefault) {
        validateResult = e?.validateResult;
      }
      sensorFunc(['trading', side, 'click'], { symbol, orderType });
      if (isSubmitLocked.current) return;
      form
        .validateFields()
        .then(async (params) => {
          const values = {
            ...params,
          };
          // 时间加权委托，需要有二次弹窗确认
          const doubleValidateResult = doubleValidateFields({
            values,
            side,
            lastPriceVal,
            timeWeightedOrderConfig,
          });
          if (!doubleValidateResult?.result && !validateResult) {
            setValidateDialog((prevState) => ({
              ...prevState,
              contentText: doubleValidateResult.contentText,
              visible: true,
            }));
            return false;
          }
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
      lastPriceVal,
      form,
      dispatch,
      orderType,
      continueSubmit,
      validateDialog,
      timeWeightedOrderConfig,
    ],
  );

  /* ****** 时间加权委托start ***** */
  // 委托总量
  const totalAmountInput = useTotalAmountInput({
    form,
    totalAmount,
    timeWeightedOrderConfig,
    pricesUSD,
  });

  // 单笔数量
  const singleAmountInput = useSingleAmountInput({
    form,
    singleAmount,
    totalAmount,
    timeWeightedOrderConfig,
  });

  // 委托价优于盘口价，挂单距离
  const priceVarInput = usePriceVarInput({
    ...execMaybeFn(orderTypeConfig?.priceVar?.itemConf, commonParamsRef.current),
    name: 'priceVar',
    setFieldsValue,
    lastPriceVal,
    timeWeightedOrderConfig,
    distanceType,
  });

  // 订单总时长
  const durationHourInput = useDurationInput({
    ...execMaybeFn(orderTypeConfig?.duration?.itemConf, commonParamsRef.current),
    name: 'durationHour',
    setFieldsValue,
    durationHour,
    durationMinute,
    totalAmount,
    singleAmount,
    getFieldFocusEventsProps,
    commonInputNumberProps,
    yScreen,
    timeWeightedOrderConfig,
  });

  const durationMinuteInput = useDurationInput({
    ...execMaybeFn(orderTypeConfig?.duration?.itemConf, commonParamsRef.current),
    name: 'durationMinute',
    setFieldsValue,
    durationHour,
    durationMinute,
    totalAmount,
    singleAmount,
    getFieldFocusEventsProps,
    commonInputNumberProps,
    yScreen,
    timeWeightedOrderConfig,
  });

  const limitPriceInput = usePriceInput({
    extraRules: [
      {
        validator: (_, value) => limitPriceValidator({ value, ...commonParamsRef.current }),
      },
    ],
    name: 'limitPrice',
    price: limitPrice,
    lastPriceVal,
    timeWeightedOrderConfig,
  });

  const estVolume = useMemo(() => {
    if (isNil(totalAmount) || isNil(limitPrice)) {
      return undefined;
    }
    return multiply(totalAmount, limitPrice);
  }, [totalAmount, limitPrice]);

  /* ****** 时间加权委托end ***** */

  const step = amountMin || amountIncrement;
  return (
    <Fragment>
      {/* ****** 可用 ***** */}
      <AvaliableBar />
      <Form
        form={form}
        onFieldsChange={onFieldsChange}
        data-inspector="trade-orderForm-form"
        initialValues={{ distanceType: 'FIXED' }}
      >
        {/* ****** 委托总量 ***** */}
        <StyledInputWithToolTip {...getInputWithToolTipProps('totalAmount')}>
          <FormItem noStyle {...totalAmountInput.formItemProps}>
            <StyledInputNumber
              {...commonInputNumberProps}
              placeholder={_t('aC64uhZ9E2rgKaMwQmBgpy')}
              {...getFieldFocusEventsProps('totalAmount')}
              {...totalAmountInput.inputProps}
              min={0}
              // min={+limitPrice <= 0 ? 0 : +priceIncrement || 0}
              className={
                !totalAmount || totalAmount === '0' || (totalAmount && +totalAmount === +step) // 数量缺省时 ｜ 数量为最小精度时禁止点击
                  ? 'disabled_minus'
                  : ''
              }
            />
          </FormItem>
        </StyledInputWithToolTip>
        {/* ****** 单笔数量 ***** */}
        <StyledInputWithToolTip {...getInputWithToolTipProps('singleAmount')}>
          <FormItem noStyle {...singleAmountInput.formItemProps}>
            <StyledInputNumber
              {...commonInputNumberProps}
              placeholder={_t('3Vxdu1Xchn2NhqKtXcA5kR')}
              {...getFieldFocusEventsProps('singleAmount')}
              {...singleAmountInput.inputProps}
              min={0}
              // min={+limitPrice <= 0 ? 0 : +priceIncrement || 0}
              className={
                !singleAmount || singleAmount === '0' || (singleAmount && +singleAmount === +step) // 数量缺省时 ｜ 数量为最小精度时禁止点击
                  ? 'disabled_minus'
                  : ''
              }
            />
          </FormItem>
        </StyledInputWithToolTip>
        {/* ****** 委托价优于盘口价 ***** */}
        <StyledInputWithToolTip {...getInputWithToolTipProps('priceVar')}>
          <FormItem noStyle {...priceVarInput.formItemProps}>
            <StyledInputNumber
              ellipsis
              {...commonInputNumberProps}
              placeholder={_t('eWBvcELJDN6zm8c3T21MhJ')}
              {...getFieldFocusEventsProps('priceVar')}
              {...priceVarInput.inputProps}
            />
          </FormItem>
        </StyledInputWithToolTip>
        {/* ****** 订单总时长 ***** */}
        <div className="flex ksb kvc">
          <StyledInputWithToolTip {...getInputWithToolTipProps('durationHour')}>
            <FormItem noStyle {...durationHourInput.formItemProps}>
              <StyledInputNumber
                ellipsis
                {...commonInputNumberProps}
                placeholder={_t('94neD5BsfRFpVCamnWvXvX')}
                {...getFieldFocusEventsProps('durationHour')}
                {...durationHourInput.inputProps}
              />
            </FormItem>
          </StyledInputWithToolTip>
          <TimeSeparator>{':'}</TimeSeparator>
          {/* ****** 订单总时长 ***** */}
          <StyledInputWithToolTip {...getInputWithToolTipProps('durationMinute')}>
            <FormItem noStyle {...durationMinuteInput.formItemProps}>
              <StyledInputNumber
                ellipsis
                {...commonInputNumberProps}
                placeholder={_t('94neD5BsfRFpVCamnWvXvX')}
                {...getFieldFocusEventsProps('durationMinute')}
                {...durationMinuteInput.inputProps}
              />
            </FormItem>
          </StyledInputWithToolTip>
        </div>
        {/* ****** 限制价格 ***** */}
        <StyledInputWithToolTip
          {...getInputWithToolTipProps(
            'limitPrice',
            limitPrice ? <StyledCoinCurrency coin={quote} value={limitPrice} /> : null,
            quote,
            limitPrice,
          )}
        >
          <FormItem noStyle {...limitPriceInput.formItemProps}>
            <StyledInputNumber
              {...commonInputNumberProps}
              placeholder={_t('sX1rfDBFez5jhKAvJiWicf')}
              {...getFieldFocusEventsProps('limitPrice')}
              {...limitPriceInput.inputProps}
              onChange={(value) => {
                let val = String(value);
                let integerPart = val.split('.')[0];
                const decimalPart = val.split('.')[1] || '';
                if (integerPart.length > 12) {
                  integerPart = integerPart.slice(0, 12);
                  val = `${integerPart}.${decimalPart}`;
                  setFieldsValue({ limitPrice: val });
                }
              }}
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
        {/* ****** 预计成交额 ***** */}
        <ExpectedVolume>
          <ExpectedVolumeTitle>{_t('2GPyxEN8p5HaHRy2ZAXuZW')}</ExpectedVolumeTitle>
          <ExpectedVolumeNumber>
            {isNil(estVolume) ? (
              <ExpectedLine>--</ExpectedLine>
            ) : (
              <ExpectedFormatNumber>
                {formatNumber(estVolume, {
                  pointed: true,
                  fixed: pricePrecision,
                  dropZ: false,
                })}
              </ExpectedFormatNumber>
            )}
            <ExpectedUnit>{quoteName}</ExpectedUnit>
          </ExpectedVolumeNumber>
        </ExpectedVolume>
        {/* ****** 下单按钮 ***** */}
        <OrderButtonsBox>
          <OrderButtons onClick={handleSubmit} />
        </OrderButtonsBox>
      </Form>
      <DoubleValidateDialog
        validateDialog={validateDialog}
        setValidateDialog={setValidateDialog}
        handleSubmit={handleSubmit}
      />
    </Fragment>
  );
};

export default React.memo(forwardRef(TimeWeightedForm));

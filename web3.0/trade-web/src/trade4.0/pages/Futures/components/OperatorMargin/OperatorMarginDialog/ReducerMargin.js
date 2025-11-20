/**
 * Owner: garuda@kupotech.com
 * 减少保证金
 */
import Decimal from 'decimal.js';
import { debounce } from 'lodash';
import React, { forwardRef, useCallback, useEffect, useState } from 'react';

import { ADJUST_MARGIN, SK_REDUCER_KEY } from '@/meta/futuresSensors/withdraw';
import { formatCurrency } from '@/utils/futures/formatCurrency';
import { trackClick } from 'src/utils/ga';
import { lessThanOrEqualTo, multiply, toFixed } from 'utils/operation';

import { useGetAppendMarginDetail } from '@/hooks/futures/useGetFuturesPositionsInfo';
import { useMaxWithdrawMargin, useOperatorMargin } from '@/hooks/futures/useOperatorMargin';
import { _t } from 'utils/lang';

import NumberTextField from '@/components/NumberInput';
import Form from '@mui/Form';
import Slider from '@mui/RadioSlider';
import Tooltip from '@mui/Tooltip';
import AdjustCard from './AdjustCard';
import AmountBar from './AmountBar';

import { REDUCER_TABS } from '../config';
import { useMinimumPrecision } from '../hooks';
import { marks, validateReducerMargin } from '../utils';

import { floadToPercent } from '../../../import';
import { FooterInfo, FormWrapper, SliderWrapper } from './style';

const { FormItem, useForm, useWatch } = Form;

const ReducerMargin = (props, ref) => {
  const [rate, setRate] = useState(0);
  // const dispatch = useDispatch();
  const [form] = useForm();
  const { getMaxWithdrawMargin } = useOperatorMargin();
  const [isError, setIsError] = useState(false);

  // 监听当前输入框的值
  const inputMargin = useWatch('margin', form);

  // 获取当前仓位的数据
  const { settleCurrency = 'USDT', symbol } = useGetAppendMarginDetail();

  const { minimumMargin, inputPrecision, inputStep, precision } = useMinimumPrecision(
    settleCurrency,
    symbol,
  );

  // 获取最大可提取保证金
  const maxMargin = useMaxWithdrawMargin(symbol);

  const handleRateChange = (v) => {
    // 最大值
    const max = toFixed(maxMargin)(inputPrecision, Decimal.ROUND_DOWN);
    let marginValue = '';
    if (v === 1) {
      marginValue = `${max}`;
    } else {
      marginValue = toFixed(multiply(max)(v))(inputPrecision, Decimal.ROUND_DOWN);
    }
    form.setFieldsValue({ margin: marginValue });
    setRate(v);
  };

  // 进入页面请求一次
  useEffect(() => {
    getMaxWithdrawMargin(symbol);
  }, [getMaxWithdrawMargin, symbol]);

  // 产品要求监听输入去请求一次最大可提取保证金，这里做 1.5 s 的防抖
  const handleInputChangeDebounce = useCallback(
    debounce(() => {
      if (symbol) {
        getMaxWithdrawMargin(symbol);
      }
    }, 1500),
    [getMaxWithdrawMargin, symbol],
  );

  // 监听 error 消息
  const handleCheckError = useCallback(
    debounce(() => {
      const inputError = form.getFieldError('margin');
      if (inputError && inputError.length) {
        setIsError(true);
      } else {
        setIsError(false);
      }
      // 不需要监听 form
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 16),
    [],
  );

  // 监听 values 输入框变化，触发校验以及请求
  const onValuesChange = useCallback(() => {
    setRate(0);
    handleCheckError();
    handleInputChangeDebounce();
  }, [handleCheckError, handleInputChangeDebounce]);

  const handleCheckMargin = useCallback(
    (rule, value) => {
      return validateReducerMargin({
        _t,
        inputPrecision,
        value,
        minimumMargin,
        maxMargin,
        settleCurrency: formatCurrency(settleCurrency),
      });
    },
    [inputPrecision, maxMargin, minimumMargin, settleCurrency],
  );

  const handleAppendMax = useCallback(() => {
    const maxMarginNumber = toFixed(maxMargin)(inputPrecision, Decimal.ROUND_DOWN);
    if (lessThanOrEqualTo(maxMarginNumber)(0)) {
      form.setFieldsValue({ margin: '0' });
    } else {
      form.setFieldsValue({ margin: maxMarginNumber });
    }
    // 不需要监听 form
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxMargin, inputPrecision]);

  const handleSubmit = useCallback(() => {
    return form.validateFields();
    // 不需要监听 form
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formReset = useCallback(() => {
    form.resetFields();
    // 不需要监听 form
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // input focus 埋点
  const handleInputFocus = useCallback(() => {
    trackClick([ADJUST_MARGIN, '2'], { MarginDirection: SK_REDUCER_KEY });
  }, []);

  // 埋点
  const handleClose = useCallback(() => {
    trackClick([ADJUST_MARGIN, '5'], { MarginDirection: SK_REDUCER_KEY });
  }, []);

  React.useImperativeHandle(ref, () => ({
    submit: handleSubmit,
    reset: formReset,
    setFields: form.setFields,
  }));

  const format = useCallback((v) => floadToPercent(v, { isPositive: false }), []);

  return (
    <>
      <FormWrapper form={form} onValuesChange={onValuesChange}>
        <FormItem
          name={'margin'}
          label={_t('reducer.margin.title')}
          rules={[{ validator: handleCheckMargin }]}
        >
          <NumberTextField
            size="xlarge"
            fullWidth
            onFocus={handleInputFocus}
            placeholder={_t('append.margin.min', {
              amount: minimumMargin,
            })}
            variant="default"
            labelProps={{ shrink: true }}
            autoComplete="off"
            step={inputStep}
            // suffix={
            //   <>
            //     <MaxButton onClick={handleAppendMax} variant="text">
            //       MAX
            //     </MaxButton>
            //     <DividerLine type="vertical" />
            //     <UnitSpan>{formatCurrency(settleCurrency)}</UnitSpan>
            //   </>
            // }
          />
        </FormItem>
      </FormWrapper>
      <SliderWrapper>
        <Slider
          marks={marks}
          min={0}
          max={1}
          value={rate === undefined ? 0 : rate}
          step={0.01}
          onChange={handleRateChange}
          tipFormatter={format}
        />
      </SliderWrapper>
      <AmountBar
        currency={formatCurrency(settleCurrency)}
        amount={maxMargin}
        modalTitle={_t('kyc.auth.title')}
        tooltip={_t('max.reducer.margin.tips')}
      >
        <span className="operator-tips">{_t('max.reducer.margin')}</span>
      </AmountBar>
      <AdjustCard
        type={REDUCER_TABS}
        inputMargin={inputMargin}
        precision={precision}
        isError={isError}
      />
      <FooterInfo>
        <div>{_t('operator.margin.tips')}</div>
        <Tooltip
          placement="top"
          title={_t('reducer.margin.more')}
          modalTitle={_t('reducer.margin.title')}
          onClose={handleClose}
        >
          <span className="lean-more">{_t('global.more')}</span>
        </Tooltip>
      </FooterInfo>
    </>
  );
};

export default React.memo(forwardRef(ReducerMargin));

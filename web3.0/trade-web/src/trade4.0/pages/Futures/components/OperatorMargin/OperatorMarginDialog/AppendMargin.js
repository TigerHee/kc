/**
 * Owner: garuda@kupotech.com
 * 追加保证金
 */
import Decimal from 'decimal.js';
import { debounce } from 'lodash';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';

import { ADJUST_MARGIN, SK_ADD_KEY } from '@/meta/futuresSensors/withdraw';
import { formatCurrency } from '@/utils/futures/formatCurrency';
import { trackClick } from 'src/utils/ga';
import { multiply, toFixed } from 'utils/operation';

import useAvailableBalance from '@/hooks/futures/useAvailableBalance';
import { useGetAppendMarginDetail } from '@/hooks/futures/useGetFuturesPositionsInfo';
import { _t } from 'utils/lang';

import NumberTextField from '@/components/NumberInput';
import Form from '@mui/Form';
import Tooltip from '@mui/Tooltip';
import AdjustCard from './AdjustCard';
import AmountBar from './AmountBar';

import Slider from '@mui/RadioSlider';
import { APPEND_TABS } from '../config';
import { useMinimumPrecision } from '../hooks';
import { marks, validateAppendMargin } from '../utils';

import { floadToPercent } from '../../../import';
import { FooterInfo, FormWrapper, SliderWrapper } from './style';

const { FormItem, useForm, useWatch } = Form;

const AppendMargin = (props, ref) => {
  const [rate, setRate] = useState(0);
  // const dispatch = useDispatch();
  const [form] = useForm();
  const [isError, setIsError] = useState(false);

  // 监听当前输入框的值
  const inputMargin = useWatch('margin', form);

  // 获取当前仓位的数据
  const { settleCurrency = 'USDT', symbol } = useGetAppendMarginDetail();

  const availableBalance = useAvailableBalance(settleCurrency);

  const { minimumMargin, inputPrecision, inputStep, precision } = useMinimumPrecision(
    settleCurrency,
    symbol,
  );

  const maxMargin = useMemo(() => {
    return availableBalance;
  }, [availableBalance]);

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

  const onValuesChange = useCallback(() => {
    handleCheckError();
    setRate(0);
  }, [handleCheckError]);

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

  const handleCheckMargin = useCallback(
    (rule, value) => {
      return validateAppendMargin({
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
    form.setFieldsValue({ margin: maxMarginNumber });
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
    trackClick([ADJUST_MARGIN, '2'], { MarginDirection: SK_ADD_KEY });
  }, []);

  // 埋点
  const handleClose = useCallback(() => {
    trackClick([ADJUST_MARGIN, '5'], { MarginDirection: SK_ADD_KEY });
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
          label={_t('append.position.label')}
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
      <AmountBar currency={formatCurrency(settleCurrency)} amount={maxMargin}>
        <span className="operator-tips">{_t('max.append.margin')}</span>
      </AmountBar>
      <AdjustCard
        type={APPEND_TABS}
        inputMargin={inputMargin}
        precision={precision}
        isError={isError}
      />
      <FooterInfo>
        <div>{_t('operator.margin.tips')}</div>
        <Tooltip
          placement="top"
          title={_t('append.margin.more')}
          modalTitle={_t('add.margin.title')}
          onClose={handleClose}
        >
          <span className="lean-more">{_t('global.more')}</span>
        </Tooltip>
      </FooterInfo>
    </>
  );
};

export default React.memo(forwardRef(AppendMargin));

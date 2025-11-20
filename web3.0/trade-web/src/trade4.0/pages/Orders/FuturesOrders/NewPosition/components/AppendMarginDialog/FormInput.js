/**
 * Owner: clyne@kupotech.com
 */
import React, { forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import Decimal from 'decimal.js';
import { toFixed, dividedBy, lessThan, greaterThan, multiply } from 'utils/operation';
import Form from '@mui/Form';
import Button from '@mui/Button';
import {
  voice,
  useBTCUnitObject,
  getCurrenciesPrecision,
  NumberInput,
  useI18n,
  useUserFee,
  formatCurrency,
  useAvailableBalance,
  styled,
  fx,
} from '@/pages/Futures/import';
import { namespace } from '../../config';

const UnitSpan = styled.span`
  ${fx.fontWeight('500')}
  ${fx.fontSize('16')}
  ${fx.lineHeight('21')}
  ${(props) => fx.color(props, 'text30')}
  ${fx.marginRight('8')}
`;

const MaxButton = styled(Button)`
  ${(props) => fx.color(props, 'primary')}
  ${fx.fontSize('16')}
`;

const { FormItem, useForm } = Form;

const name = 'margin';
const FormInput = (props, ref) => {
  const { _t } = useI18n();
  const dispatch = useDispatch();
  const [form] = useForm();
  const { settleCurrency, symbol, isTrialFunds, trialCode } = useSelector(
    (state) => state[namespace].appendMarginDetail,
    isEqual,
  );
  const { takerFeeRate } = useUserFee();
  const { settleCurrencyIsBtc } = useBTCUnitObject(settleCurrency);
  const availableBalance = useAvailableBalance(settleCurrency, isTrialFunds);
  const { precision } = getCurrenciesPrecision(settleCurrency);
  const inputStep = Decimal(10).pow(-precision).toNumber();
  const inputPrecision = settleCurrencyIsBtc ? Decimal(inputStep).dp() : precision;
  const marginCurrency = formatCurrency(settleCurrency);

  const minMargin = React.useMemo(() => {
    let min = toFixed(multiply(dividedBy(1)(takerFeeRate))(1e-8))(precision, Decimal.ROUND_UP);
    const step = Decimal(10).pow(-precision).toNumber();
    min = min > step ? min : step;

    return min;
  }, [precision, takerFeeRate]);

  const handleCheckMargin = (rule, value) => {
    const valid = new RegExp(`^(0|[1-9][0-9]*)(\\.[0-9]{1,${inputPrecision}})?$`).test(value);

    if (!valid) {
      return Promise.reject(_t('input.tips.margin', { precision: String(inputPrecision) }));
    }

    const maxMargin = availableBalance;

    if (!+value) {
      return Promise.reject(_t('append.margin.input.required'));
    }

    if (lessThan(value)(minMargin)) {
      return Promise.reject(
        `${_t('append.margin.input.min', {
          amount: minMargin,
        })}${marginCurrency}`,
      );
    }

    if (greaterThan(value)(maxMargin)) {
      return Promise.reject(_t('append.margin.input.max'));
    }

    return Promise.resolve();
  };

  const appendMax = () => {
    const unitFixed = +precision;
    const availableBalanceNumber = toFixed(availableBalance)(unitFixed, Decimal.ROUND_DOWN);
    form.setFieldsValue({ margin: availableBalanceNumber });
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const submitValue = values.margin;
        dispatch({
          type: `${namespace}/appendMargin`,
          payload: {
            value: submitValue,
            symbol,
            isTrialFunds,
            trialCode,
          },
        });
      })
      .catch(() => {
        voice.notify('error_boundary');
      });
  };

  const formReset = () => {
    form.resetFields();
  };

  React.useImperativeHandle(ref, () => ({
    submit: handleSubmit,
    reset: formReset,
  }));

  return (
    <Form form={form}>
      <FormItem
        name={name}
        label={_t('append.position.label')}
        rules={[{ validator: handleCheckMargin }]}
      >
        <NumberInput
          variant="default"
          size="xlarge"
          fullWidth
          placeholder={_t('append.margin.min', {
            amount: minMargin,
          })}
          autoComplete="off"
          step={inputStep}
          suffix={
            <>
              <UnitSpan>{formatCurrency(marginCurrency)}</UnitSpan>
              <MaxButton onClick={appendMax} variant="text">
                MAX
              </MaxButton>
            </>
          }
        />
      </FormItem>
    </Form>
  );
};

export default forwardRef(FormInput);

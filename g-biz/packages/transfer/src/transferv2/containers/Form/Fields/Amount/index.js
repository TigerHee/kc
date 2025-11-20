/**
 * Owner: solar@kupotech.com
 */
import { InputNumber2 as InputNumber } from '@kux/mui';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useProps } from '@transfer/hooks/props';
import { StyledFormItem } from '../../style';
import { StyledFiatShow, StyledMax } from './style';
import { useForceFormFieldChange, useFormField } from '../../../../hooks/fields';
import { useTransferSelector, useTransferDispatch } from '../../../../utils/redux';
import TotalShow from '../../components/TotalShow';
import Fiat from '../../../../components/Fiat';

function Max() {
  const dispatchTransfer = useTransferDispatch();
  const { t: _t } = useTranslation('transfer');
  const total = useTransferSelector((state) => state.total);
  const forceFormUpdate = useForceFormFieldChange();
  const fillMax = useCallback(() => {
    forceFormUpdate(() => ({
      amount: total,
    }));
    dispatchTransfer({
      type: 'update',
      payload: {
        hasError: false,
      },
    });
  }, [total, dispatchTransfer, forceFormUpdate]);
  return (
    <StyledMax
      type="brandGreen"
      variant="text"
      onClick={fillMax}
      disabled={total <= 0}
      className="max-button"
    >
      {_t('i59WspMk1h9yP5tAzyCXt5')}
    </StyledMax>
  );
}

const numReg = /^[0-9]+(\.?[0-9]*)?$/;

function FiatShow() {
  const hasError = useTransferSelector((state) => state.hasError);
  const amount = useFormField('amount');
  const currency = useFormField('currency');
  return (
    <StyledFiatShow>
      {Boolean(+amount && !hasError) && <Fiat currency={currency} amount={amount} />}
    </StyledFiatShow>
  );
}

export default function Amount(props) {
  const { t: _t } = useTranslation('transfer');
  const currentLang = useProps((state) => state.currentLang);
  const total = useTransferSelector((state) => state.total);
  const precision = useTransferSelector((state) => state.precision);
  const isNotAllowed = useTransferSelector((state) => Boolean(state.notAllowedAccounts?.length));

  // const currencyInfo = useCurrencyInfo();
  const isBatchEnable = useTransferSelector((state) => state.isBatchEnable);
  const amountValidator = useCallback(
    (rule, value) => {
      if (value === '') {
        return Promise.reject(_t('form.required'));
      }
      if (!numReg.test(value) || +value < 0) {
        return Promise.reject(_t('trans.amount.num.err'));
      }
      value = +value;
      if (total >= 0 && value > total) {
        const avaliableMax = `${_t('transfer.trans.avaliable')} ${total}`;
        return Promise.reject(avaliableMax);
      }
      return Promise.resolve();
    },
    [total, _t],
  );

  if (isBatchEnable) return null;
  return (
    <>
      <TotalShow />
      <StyledFormItem
        name="amount"
        rules={[
          {
            validator: amountValidator,
          },
        ]}
        label={_t('margin.number')}
        help={<FiatShow />}
      >
        <InputNumber
          labelProps={{ shrink: true }}
          unit={<Max />}
          controls={false}
          size="xlarge"
          precision={precision}
          // 当有不支持账户时，屏蔽数字输入框
          disabled={isNotAllowed}
          className="transfer-amount"
          separator
          lang={currentLang}
          {...props}
        />
      </StyledFormItem>
    </>
  );
}

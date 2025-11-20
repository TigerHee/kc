/*
 * @owner: borden@kupotech.com
 */
import React, { Fragment } from 'react';
import { _t } from 'utils/lang';
import Form from '@mui/Form';
import { useGetCurrentSymbolInfo } from '@/hooks/common/useSymbol';
import ValidateTooltip from '@/components/InputWithTooltip/ValidateTooltip';
import { validateEmpty, numberFormatter } from '@/pages/OrderForm/utils';
import amountValidator from '@/pages/OrderForm/components/TradeForm/utils/amountValidator';
import { StyledInputNumber } from './style';

const { FormItem } = Form;

const QuickOrderForm = (props) => {
  const { form, getSide, inputClassName } = props;
  const currentSymbolInfo = useGetCurrentSymbolInfo();
  const { symbol = '', baseIncrement, basePrecision } = currentSymbolInfo;
  const [baseName] = symbol.split('-');

  return (
    <div>
      <Form form={form}>
        <FormItem
          size="small"
          name="amount"
          rules={[
            {
              validator: validateEmpty,
              validateTrigger: 'onSubmit',
            },
            {
              validator: (_, value) =>
                amountValidator({
                  value,
                  price: 1,
                  side: getSide(),
                  byQuantity: true,
                  orderType: 'marketPrise',
                }),
            },
          ]}
          validateTrigger={['onChange', 'onSubmit']}
        >
          <ValidateTooltip form={form} fieldName="amount">
            <StyledInputNumber
              min={0}
              fullWidth
              size="large"
              controls={false}
              disableUnderline
              step={baseIncrement}
              precision={basePrecision}
              formatter={numberFormatter}
              labelProps={{ shrink: true }}
              containerClassName={inputClassName}
              placeholder={_t('cSiaBqQzStCUgacqsiDcVe')}
              label={<Fragment>{_t('trd.form.amount')}({baseName})</Fragment>}
            />
          </ValidateTooltip>
        </FormItem>
      </Form>
    </div>
  );
};
QuickOrderForm.displayName = 'QuickOrderForm';

export default React.memo(QuickOrderForm);

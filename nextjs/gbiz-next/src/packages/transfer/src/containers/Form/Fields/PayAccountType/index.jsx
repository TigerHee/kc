/**
 * Owner: solar@kupotech.com
 */
// import { Select } from '@kux/mui';
import { useCallback } from 'react';
import { useTransferSelector, useTransferDispatch } from '@transfer/utils/redux';
import { kcsensorsClick as trackClick } from '@transfer/utils/ga';
import { useFormField } from '@transfer/hooks/fields';
import Account from '../../../Account';

function withPay(Component) {
  return (props) => {
    const payAccountOptions = useTransferSelector((state) => state.payAccountOptions);
    const payAccountLabel = useTransferSelector((state) => state.payAccountLabel);
    const payAccountSubOptions = useTransferSelector((state) => state.payAccountSubOptions);
    const dispatchTransfer = useTransferDispatch();
    const currency = useFormField('currency');

    const { onChange, ...rest } = props;
    const handleChange = useCallback(
      (...params) => {
        onChange(...params);
        if (params && params[0]) {
          trackClick(['transferPopup', 'fromAccountSelect'], {
            accountName: params[0],
            currency,
          });
        }

        dispatchTransfer({
          type: 'update',
          payload: {
            payTag: '',
          },
        });
      },
      [currency, dispatchTransfer],
    );
    return (
      <Component
        {...rest}
        onChange={handleChange}
        topOptions={payAccountOptions}
        label={payAccountLabel}
        subOptions={payAccountSubOptions}
        type="pay"
      />
    );
  };
}

export default withPay(Account);

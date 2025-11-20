/**
 * Owner: solar@kupotech.com
 */
// import { Select } from '@kux/mui';
import { useCallback } from 'react';
import { useTransferSelector, useTransferDispatch } from '@transfer/utils/redux';
import { kcsensorsClick as trackClick } from '@packages/transfer/src/utils/ga';
import { useFormField } from '@transfer/hooks/fields';
import Account from '../../../Account';

function withRec(Component) {
  return (props) => {
    const recAccountOptions = useTransferSelector((state) => state.recAccountOptions);
    const recAccountLabel = useTransferSelector((state) => state.recAccountLabel);
    const recAccountSubOptions = useTransferSelector((state) => state.recAccountSubOptions);
    const currency = useFormField('currency');

    const dispatchTransfer = useTransferDispatch();
    const { onChange, ...rest } = props;
    const handleChange = useCallback(
      (...params) => {
        onChange(...params);
        if (params && params[0]) {
          trackClick(['transferPopup', 'toAccountSelect'], {
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
        topOptions={recAccountOptions}
        label={recAccountLabel}
        subOptions={recAccountSubOptions}
        type="rec"
      />
    );
  };
}

export default withRec(Account);

/**
 * Owner: solar@kupotech.com
 */
/**
 * Owner: solar@kupotech.com
 */
import { useMemo, useCallback } from 'react';
import { useSnackbar } from '@kux/mui';
import { useTranslation } from 'tools/i18n';
import { useFormField } from '@transfer/hooks/fields';
import throttle from 'lodash-es/throttle';

import {
  useTransferDispatch,
  useTransferSelector,
  useTransferLoading,
} from '@transfer/utils/redux';
import { useProps } from '@transfer/hooks/props';
import { MAX_SELECTION } from '@transfer/constants';
import { setNumToPrecision } from '@transfer/utils/number';
import { TransferEvent } from '../../../../event';
import { StyledConfirm } from './style';

function useConfirmButtonProps() {
  const dispatchTransfer = useTransferDispatch();
  const { t: _t } = useTranslation('transfer');
  const payAccountType = useFormField('payAccountType');
  const recAccountType = useFormField('recAccountType');
  const payTag = useFormField('payTag');
  const recTag = useFormField('recTag');
  const amount = useFormField('amount');
  const currency = useFormField('currency');

  const isBatchEnable = useTransferSelector((state) => state.isBatchEnable);
  const currencies = useTransferSelector((state) => state.currencies);
  const hasError = useTransferSelector((state) => state.hasError);
  const selectedKeys = useTransferSelector((state) => state.selectedKeys);
  const precision = useTransferSelector((state) => state.precision);
  const totalLoading = useTransferSelector((state) => state.totalLoading);
  const batchApplyLoading = useTransferLoading('transferBatchApply');
  const applyLoading = useTransferLoading('transferApply');

  const loading = batchApplyLoading || applyLoading || totalLoading;
  const hasInputed = useMemo(() => {
    return amount && +amount;
  }, [amount]);
  const disabled = useMemo(() => {
    if (isBatchEnable) {
      return !selectedKeys.length;
    }
    return !(hasInputed && !hasError);
  }, [isBatchEnable, hasError, hasInputed, selectedKeys]);
  const { message } = useSnackbar();
  const { onClose, successCallback } = useProps();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onClick = useCallback(
    throttle(
      () => {
        if (isBatchEnable) {
          const _currencies = selectedKeys.map((item) => {
            const _currency = currencies.find((_item) => _item.currency === item);
            return {
              currency: _currency.currency,
              amount: _currency.total,
            };
          });
          dispatchTransfer({
            type: 'transferBatchApply',
            payload: {
              payAccountType,
              recAccountType,
              currencies: _currencies,
            },
          })
            .then(() => {
              message.success(_t('operation.succeed'));
              successCallback();
              TransferEvent.emit('transfer.success', {
                from: [payAccountType, payTag],
                to: [recAccountType, recTag],
                currencies: _currencies,
              });
              setTimeout(() => {
                onClose();
              }, 2000);
            })
            .catch((results) => {
              dispatchTransfer({
                type: 'update',
                payload: {
                  failReasons: results.filter((res) => !res.result),
                },
              });
            });
          return;
        }
        const optionalParams = {};
        if (payTag) {
          optionalParams.payTag = payTag;
        }
        if (recTag) {
          optionalParams.recTag = recTag;
        }
        dispatchTransfer({
          type: 'transferApply',
          payload: {
            payAccountType,
            recAccountType,
            amount: setNumToPrecision(amount, precision),
            currency,
            t: _t,
            ...optionalParams,
          },
        }).then((res) => {
          message.success(res.customMsg || _t('operation.succeed'));
          successCallback();
          TransferEvent.emit('transfer.success', {
            from: [payAccountType, payTag],
            to: [recAccountType, recTag],
            currencies: [currency],
          });
          setTimeout(() => {
            onClose();
          }, 1000);
        });
      },
      2000,
      { leading: true },
    ),
    // onClose外部传来不能保证引用稳定
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      payAccountType,
      recAccountType,
      amount,
      currency,
      payTag,
      recTag,
      dispatchTransfer,
      message,
      isBatchEnable,
      currencies,
      onClose,
      successCallback,
      selectedKeys,
    ],
  );
  return useMemo(
    () => ({
      disabled,
      onClick,
      loading,
    }),
    [disabled, onClick, loading],
  );
}

export default function ConfirmButton() {
  const isBatchEnable = useTransferSelector((state) => state.isBatchEnable);
  const selectedKeys = useTransferSelector((state) => state.selectedKeys);
  const buttonProps = useConfirmButtonProps();
  const { t: _t } = useTranslation('transfer');
  return (
    <StyledConfirm fullWidth size="large" data-inspector="transfer-confirm" {...buttonProps}>
      {_t('confirm')}
      {isBatchEnable && `(${selectedKeys.length}/${MAX_SELECTION})`}
    </StyledConfirm>
  );
}

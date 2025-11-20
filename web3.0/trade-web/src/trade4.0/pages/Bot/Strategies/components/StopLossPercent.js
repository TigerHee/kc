/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback } from 'react';
import { Form, FormItem } from 'Bot/components/Common/CForm';
import DialogRef, { useBindDialogButton } from 'Bot/components/Common/DialogRef';
import InputNumber from 'Bot/components/Common/InputNumber';
import { setStopLossAndProfitPrice } from 'Bot/services/running';
import useStateRef from '@/hooks/common/useStateRef';
import { _t, _tHTML } from 'Bot/utils/lang';
import { formatNumber, div100, times100 } from 'Bot/helper';
import Row from 'Bot/components/Common/Row';
import { Text } from 'Bot/components/Widgets';

const StopLoss = ({ item, symbolInfo, actionSheetRef, onFresh, type }) => {
  const [form] = Form.useForm();
  Form.useWatch([], form);
  const { id } = item;
  const stopLossPercent = Number(item.stopLossPercent)
    ? times100(item.stopLossPercent)
    : item.stopLossPercent;
  let price = item.price;
  price = +price;

  const { pricePrecision, quota } = symbolInfo;

  const submitRef = useStateRef((value, loadingType) => {
    actionSheetRef.current.updateBtnProps({
      okButtonProps: {
        loading: loadingType === 'confirm',
      },
      cancelButtonProps: {
        loading: loadingType === 'cancel',
      },
    });
    try {
      setStopLossAndProfitPrice({
        taskId: id,
        stopLossPercent: loadingType === 'confirm' ? div100(value) : value,
      })
        .then((_) => {
          actionSheetRef.current.toggle();
          onFresh();
        })
        .finally(() => {
          actionSheetRef.current.updateBtnProps({
            okButtonProps: {
              loading: false,
            },
            cancelButtonProps: {
              loading: false,
            },
          });
        });
    } catch (error) {
      console.log(error);
    }
  });

  // 取消设置-1， run_params中返回0未设置
  const onDelete = useCallback(() => {
    submitRef.current('', 'cancel');
  }, []);
  const onConfirm = useCallback(() => {
    form.validateFields().then((values) => {
      submitRef.current(values.stopLossPercent, 'confirm');
    });
  }, [form]);
  useBindDialogButton(actionSheetRef, {
    onConfirm,
    onCancel: onDelete,
  });
  return (
    <Form
      form={form}
      initialValues={{
        stopLossPercent: Number(stopLossPercent) ? stopLossPercent : '',
      }}
    >
      <Text color="text" fs={14} mb={8} as="div">
        {_t('lossstop')}(0 ~ 99.9%)
      </Text>
      <FormItem
        name="stopLossPercent"
        rules={[
          {
            required: true,
            validator: (rule, value, cb) => {
              if (!Number(value)) return cb(_t('form.number.required'));
              cb();
            },
          },
        ]}
      >
        <InputNumber
          placeholder={_t('lossstop')}
          label={_t('lossstop')}
          maxPrecision={1}
          unit="%"
          max={99.9}
          min={0}
        />
      </FormItem>
      <Row label={_t('card12')} value={formatNumber(price, pricePrecision)} unit={quota} />
    </Form>
  );
};

const StopLossWrap = React.memo(({ actionSheetRef, onFresh, type }) => {
  return (
    <DialogRef
      ref={actionSheetRef}
      title={_t('lossstop')}
      onOk={() => actionSheetRef.current.confirm()}
      cancelButtonProps={{ onClick: () => actionSheetRef.current.cancel() }}
      onCancel={() => actionSheetRef.current.close()}
      cancelText={_t('delete')}
      okText={_t('btnsetting')}
      size="medium"
      maskClosable
    >
      <StopLoss actionSheetRef={actionSheetRef} onFresh={onFresh} type={type} />
    </DialogRef>
  );
});

export default StopLossWrap;

/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback } from 'react';
import { Form } from 'Bot/components/Common/CForm';
import DialogRef, { useBindDialogButton } from 'Bot/components/Common/DialogRef';
import InputNumber from 'Bot/components/Common/InputNumber';
import { setStopLossAndProfitPrice } from 'Bot/services/running';
import useStateRef from '@/hooks/common/useStateRef';
import { _t, _tHTML } from 'Bot/utils/lang';
import { formatNumber, getFormErr } from 'Bot/helper';
import { Text } from 'Bot/components/Widgets';
import Row from 'Bot/components/Common/Row';
import FormHelperText from 'Bot/components/Common/CForm/FormHelperText';
import { Box } from './StopLoss';

// 根据策略类型显示文案提示
const showLabelHint = (type, data) => {
  if (type === 'classicgrid') {
    return _t(`futrgrid.stopprofitpricedialoghintlong`);
  } else if (type === 'futuregrid') {
    return _t(`futrgrid.stopprofitpricedialoghint${data.direction}`);
  } else if (type === 'infinitygrid') {
    return _t(`futrgrid.stopprofitpricedialoghintlong`);
  }
  return null;
};
// 根据策略类型 表单值 显示红色文案 但允许提交 只是给一个提示
const showFormHint = (type, data, form) => {
  // 出现下面情况 只是给一个红色提示 但是允许提交
  let isShowHint = '';
  const hasFormErr = getFormErr(form.getFieldError('stopProfitPrice'));
  let stopProfitPriceValue = form.getFieldValue('stopProfitPrice');
  stopProfitPriceValue = +stopProfitPriceValue;

  // 在表单有值 并且没有报错的情况下显示
  if (!stopProfitPriceValue || hasFormErr) {
    return null;
  }

  if (type === 'classicgrid') {
    isShowHint = data.price > stopProfitPriceValue ? _t('futrgrid.stoplonghintmore') : '';
  } else if (type === 'futuregrid') {
    if (data.direction === 'long') {
      if (data.price > stopProfitPriceValue) {
        isShowHint = _t('futrgrid.stoplonghintmore');
      }
    } else if (data.direction === 'short') {
      if (data.price < stopProfitPriceValue) {
        isShowHint = _t('futrgrid.stopshorthintless');
      }
    }
  } else if (type === 'infinitygrid') {
    isShowHint = data.price > stopProfitPriceValue ? _t('futrgrid.stoplonghintmore') : '';
  }
  return isShowHint;
};
const StopProfit = ({ item, symbolInfo, actionSheetRef, onFresh, type }) => {
  const [form] = Form.useForm();
  Form.useWatch([], form);
  const { id, down, up, stopProfitPrice } = item;
  let price = item.price;
  price = +price;
  const { pricePrecision, quota, priceIncrement } = symbolInfo;
  const data = {
    ...item,
    ...symbolInfo,
    price,
  };
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
        stopProfitPrice: value,
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
    submitRef.current(-1, 'cancel');
  }, []);
  const onConfirm = useCallback(() => {
    form.validateFields().then((values) => {
      submitRef.current(values.stopProfitPrice, 'confirm');
    });
  }, [form]);
  useBindDialogButton(actionSheetRef, {
    onConfirm,
    onCancel: onDelete,
  });
  const justWarningMsg = showFormHint(type, data, form);
  return (
    <Form
      form={form}
      initialValues={{
        stopProfitPrice: Number(stopProfitPrice) ? stopProfitPrice : '',
      }}
    >
      <Text color="text" fs={14} mb={8} as="div">
        {showLabelHint(type, data)}
      </Text>
      <Box showMinHeight={!justWarningMsg}>
        <Form.FormItem
          name="stopProfitPrice"
          rules={[
            {
              validator: (rule, value, cb) => {
                if (!Number(value)) return cb(_t('pc.enterstopprofitprice'));
                cb();
              },
            },
          ]}
        >
          <InputNumber
            unit={quota}
            placeholder={_t('futrgrid.stopprofitprice')}
            label={_t('futrgrid.stopprofitprice')}
            maxPrecision={pricePrecision}
            step={priceIncrement}
          />
        </Form.FormItem>
      </Box>
      <FormHelperText>{justWarningMsg}</FormHelperText>

      <Row label={_t('card12')} value={formatNumber(price, pricePrecision)} unit={quota} />

      {type !== 'infinitygrid' && (
        <Row
          label={_t('card13')}
          value={`${formatNumber(down, pricePrecision)}～${formatNumber(up, pricePrecision)}`}
          unit={quota}
        />
      )}
      {type === 'infinitygrid' && (
        <Row label={_t('minprice')} value={formatNumber(down, pricePrecision)} unit={quota} />
      )}
    </Form>
  );
};

const StopProfitWrap = ({ actionSheetRef, onFresh, type }) => {
  return (
    <DialogRef
      ref={actionSheetRef}
      title={_t('updatestopprofitprice')}
      cancelButtonProps={{ onClick: () => actionSheetRef.current.cancel() }}
      onCancel={() => actionSheetRef.current.close()}
      onOk={() => actionSheetRef.current.confirm()}
      cancelText={_t('delete')}
      okText={_t('btnsetting')}
      size="medium"
      maskClosable
    >
      <StopProfit actionSheetRef={actionSheetRef} onFresh={onFresh} type={type} />
    </DialogRef>
  );
};

export default StopProfitWrap;

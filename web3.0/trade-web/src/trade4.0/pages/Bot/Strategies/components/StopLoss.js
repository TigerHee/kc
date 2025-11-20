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
import styled from '@emotion/styled';

export const Box = styled.div`
  div.KuxForm-itemHelp {
    min-height: ${({ showMinHeight }) => (showMinHeight ? '24px' : 'auto')};
  }
`;
// 根据策略类型显示文案提示
const showLabelHint = (type, data) => {
  if (type === 'classicgrid') {
    return _t('robotparams5', { base: data.base });
  } else if (type === 'futuregrid') {
    return _t(`futrgrid.stoppricedialoghint${data.direction}`);
  } else if (type === 'infinitygrid') {
    return _t('robotparams5', { base: data.base });
  }
  return null;
};
// 根据策略类型 表单值 显示红色文案 但允许提交 只是给一个提示
const showFormHint = (type, data, form) => {
  // 出现下面情况 只是给一个红色提示 但是允许提交
  let isShowHint = '';
  const hasFormErr = getFormErr(form.getFieldError('stopLossPrice'));
  let stopLossPriceValue = form.getFieldValue('stopLossPrice');
  stopLossPriceValue = +stopLossPriceValue;

  // 在表单有值 并且没有报错的情况下显示
  if (!stopLossPriceValue || hasFormErr) {
    return null;
  }

  if (type === 'classicgrid') {
    isShowHint = data.price < stopLossPriceValue ? _t('stoppricelesscurrenthint') : '';
  } else if (type === 'futuregrid') {
    if (data.direction === 'long') {
      if (data.price < stopLossPriceValue) {
        isShowHint = _t('futrgrid.stoplonghintless');
      }
    } else if (data.direction === 'short') {
      if (data.price > stopLossPriceValue) {
        isShowHint = _t('futrgrid.stopshorthintmore');
      }
    }
  } else if (type === 'infinitygrid') {
    isShowHint = data.price < stopLossPriceValue ? _t('stoppricelesscurrenthint') : '';
  }
  return isShowHint;
};
const StopLoss = ({ item, symbolInfo, actionSheetRef, onFresh, type }) => {
  const [form] = Form.useForm();
  Form.useWatch([], form);
  const { id, down, up, stopLossPrice } = item;
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
        stopLossPrice: value,
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
      submitRef.current(values.stopLossPrice, 'confirm');
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
        stopLossPrice: Number(stopLossPrice) ? stopLossPrice : '',
      }}
    >
      <Text color="text" fs={14} mb={8} as="div">
        {showLabelHint(type, data)}
      </Text>
      <Box showMinHeight={!justWarningMsg}>
        <Form.FormItem
          name="stopLossPrice"
          rules={[
            {
              validator: (rule, value, cb) => {
                if (!Number(value)) return cb(_t('robotparams8'));
                cb();
              },
            },
          ]}
        >
          <InputNumber
            unit={quota}
            placeholder={_t('robotparams11')}
            label={_t('robotparams11')}
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

const StopLossWrap = React.memo(({ actionSheetRef, onFresh, type }) => {
  return (
    <DialogRef
      ref={actionSheetRef}
      title={_t('robotparams4')}
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

/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, useState, useCallback, useEffect } from 'react';
import Dialog from '@mui/Dialog';
import { Tabs } from '@mui/Tabs';
import styled from '@emotion/styled';
import Form from '@mui/Form';
import Radio from '@mui/Radio';
import InputNumber from '@mui/InputNumber';
import SymbolSelect from './SymbolSelect';
import CoinCodeToName from '@/components/CoinCodeToName';
import { useDispatch, useSelector } from 'dva';
import { _t } from 'utils/lang';

import { TabWrapper } from './style';

const { FormItem, useForm } = Form;
const RadioGroup = Radio.Group;
const numReg = /^[0-9]+(\.?[0-9]*)?$/;

const DialogWrapper = styled(Dialog)`
  .KuxModalHeader-root {
    padding: 0 32px;
    height: 88px !important;
  }
  .KuxDialog-content {
    padding-top: 32px;
  }
`;

const { Tab } = Tabs;

export const Title = (props) => {
  const { value, onChange } = props;

  const handleChange = useCallback((_, v) => {
    if (onChange) {
      onChange(v);
    }
  }, []);

  return (
    <TabWrapper>
      <Tabs value={value} onChange={handleChange} variant="line">
        <Tab label={_t('pricewarn.title')} value={0} />
        <Tab label={_t('amplitude.alert')} value={1} />
      </Tabs>
    </TabWrapper>
  );
};

/**
 * WranDialog
 * 预警设置弹窗
 */
const WranDialog = (props) => {
  const { open, onOk, ...restProps } = props;
  const [form] = useForm();
  const { validateFields, setFieldsValue, resetFields } = form;
  const currentSymbol = useSelector((state) => state.trade.currentSymbol);
  const symbolsMap = useSelector((state) => state.symbols.symbolsMap);
  const confirmLoading = useSelector(
    (state) =>
      state.loading.effects['priceWarn/creactAmplitudeWarn'] ||
      state.loading.effects['priceWarn/create'],
  );

  const dispatch = useDispatch();
  const [tab, setTab] = useState(0);
  const [symbol, setSymbol] = useState(currentSymbol);

  const isPrice = tab === 0;

  const pair = symbol.split('-')[1];
  const symbolInfo = (symbolsMap || {})[symbol] || {};
  const { pricePrecision = 8 } = symbolInfo;

  useEffect(() => {
    setSymbol(currentSymbol);
  }, [currentSymbol]);

  useEffect(() => {
    resetFields();
    setFieldsValue({ symbol, ...(tab === 0 ? { warnType: '0' } : {}) });
  }, [tab]);

  useEffect(() => {
    if (open) {
      setTab(0);
      setFieldsValue({
        symbol,
        warnType: '0',
        warnAmount: undefined,
      });
    } else {
      resetFields();
    }
  }, [open]);

  const handleTabChange = useCallback((v) => {
    setTab(v);
  }, []);

  const handleSymbolChange = useCallback((v) => {
    setSymbol(v);
  }, []);

  const handleOk = useCallback(async () => {
    const values = await validateFields();
    if (isPrice) {
      values.warnType = +values.warnType;
      // 通知类型暂时只有 0-站内
      values.noticeType = 0;
      await dispatch({
        type: 'priceWarn/create',
        payload: { values },
      });
    } else {
      await dispatch({
        type: 'priceWarn/creactAmplitudeWarn',
        payload: values,
      });
    }
    if (onOk) {
      await onOk(values);
    }
  }, [isPrice]);

  const validatePriceInput = useCallback((rule, value) => {
    if (value === '') {
      return Promise.reject(_t('pricewarn.price.null'));
    }
    if (!numReg.test(value)) {
      return Promise.reject(_t('trans.amount.num.err'));
    }
    if (+value <= 0) {
      return Promise.reject(_t('pricewarn.format.error'));
    }
    return Promise.resolve();
  }, []);

  const validateThreshold = useCallback((rule, value) => {
    if (value === '' || value === undefined) {
      return Promise.reject(_t('form.required'));
    }
    if (!numReg.test(value)) {
      return Promise.reject(_t('trans.amount.num.err'));
    }
    if (+value < 1 || +value > 100) {
      return Promise.reject(_t('alert.ampltude.range'));
    }
    return Promise.resolve();
  }, []);

  return (
    <DialogWrapper
      title={<Title onChange={handleTabChange} value={tab} />}
      open={open}
      onOk={handleOk}
      okButtonProps={{ loading: confirmLoading }}
      cancelText={_t('cancel')}
      okText={_t('confirmed')}
      headerProps={{ border: true }}
      {...restProps}
    >
      <Form form={form}>
        {isPrice && (
          <FormItem name="warnType">
            <RadioGroup
              options={[
                { label: _t('pricewarn.up'), value: '0' },
                { label: _t('pricewarn.down'), value: '1' },
              ]}
            />
          </FormItem>
        )}
        <FormItem name="symbol" label={_t('orders.col.symbol')}>
          <SymbolSelect onChange={handleSymbolChange} />
        </FormItem>
        {isPrice && (
          <FormItem
            name="warnAmount"
            label={_t('span.price')}
            rules={[{ validator: validatePriceInput }]}
          >
            <InputNumber
              precision={pricePrecision}
              unit={<CoinCodeToName coin={pair} />}
              size="xlarge"
              min={0}
            />
          </FormItem>
        )}
        {!isPrice && (
          <FormItem
            name="threshold"
            label={_t('amplitude.period', { m: 5 })}
            rules={[{ validator: validateThreshold }]}
          >
            <InputNumber
              unit="%"
              precision={2}
              controls={false}
              size="xlarge"
              min={0}
              max={100}
            />
          </FormItem>
        )}
      </Form>
    </DialogWrapper>
  );
};

export default memo(WranDialog);

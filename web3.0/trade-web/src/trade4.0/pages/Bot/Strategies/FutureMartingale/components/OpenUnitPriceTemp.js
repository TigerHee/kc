/**
 * Owner: mike@kupotech.com
 */
// 配置文件
import React, { useState } from 'react';
import { useBindDialogButton } from 'Bot/components/Common/DialogRef';
import InputNumber from 'Bot/components/Common/InputNumber';
import { _t, _tHTML } from 'Bot/utils/lang';
import Radio from '@mui/Radio';
import { Form, FormItem } from 'Bot/components/Common/CForm';
import styled from '@emotion/styled';

export const MRadioGroup = styled(Radio.Group)`
  flex-direction: column;
  display: flex;
  >label {
    &:first-of-type {
      /* margin-bottom: 12px; */
    }
  }
`;
export const MRadio = styled(Radio)`
  display: flex;
  .KuxRadio-text {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
  }
  .KuxForm-item {
    width: 200px;
    /* margin-bottom: -24px; */
  }
`;
// 首轮开仓条件
const OpenUnitPrice = ({ formKey, sheetRef, model = {}, validator }) => {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form) ?? {};

  const { formData, setMergeState, symbolInfo } = model;
  const [tab, setTab] = useState(formData[formKey] ? 1 : 0);
  const onCancel = () => {
    sheetRef.current.close();
  };
  const onSubmit = async () => {
    if (tab === 0) {
      setMergeState({ [formKey]: '' });
      sheetRef.current.close();
    } else {
      try {
        const results = await form.validateFields();
        setMergeState({ [formKey]: results.amount });
        sheetRef.current.close();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const setTabHandle = (e) => {
    e = +e.target.value;
    if (e === 0) {
      form.resetFields();
    }
    setTab(e);
  };
  useBindDialogButton(sheetRef, {
    onConfirm: onSubmit,
    onCancel,
  });
  return (
    <Form
      form={form}
      initialValues={{
        amount: formData[formKey] || formData.price,
      }}
    >
      <MRadioGroup value={tab} onChange={setTabHandle} className="mb-24">
        <Radio value={0}>{_t('startnow')}</Radio>
        <MRadio value={1}>
          <span>{_t('pw17fbbk45az8cyYg3yjr4')}</span>
          <FormItem name="amount" rules={[{ validator }]}>
            <InputNumber
              unit={symbolInfo.quota}
              placeholder={formData.price}
              disabled={tab === 0}
              maxPrecision={symbolInfo.pricePrecision}
              step={symbolInfo.priceIncrement}
            />
          </FormItem>
        </MRadio>
      </MRadioGroup>
    </Form>
  );
};

export default OpenUnitPrice;

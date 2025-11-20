/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { useBindDialogButton } from 'Bot/components/Common/DialogRef';
import InputNumber from 'Bot/components/Common/InputNumber';
import { _t, _tHTML } from 'Bot/utils/lang';
import { Form, FormItem } from 'Bot/components/Common/CForm';
import styled from '@emotion/styled';
import { Text } from 'Bot/components/Widgets';

const Wave = styled.div`
  color: ${({ theme }) => theme.colors.text40};
  font-size: 14px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 40px;
`;
/**
 * @description: 开仓价格区间
 * @param {*} Form
 * @param {*} sheetRef
 * @param {Object} model 当不实用context传递数据时， 用model传第props
 * @return {*}
 */
const OpenPriceRange = ({ form, sheetRef, model = {}, minPriceValidator, maxPriceValidator }) => {
  const { formData = {}, setMergeState, symbolInfo = {}, formRequired: required } = model;
  const onCancel = () => {
    setMergeState({
      minPrice: '',
      maxPrice: '',
    });
    sheetRef.current.close();
  };
  const onSubmit = async () => {
    try {
      const results = await form.validateFields();
      setMergeState(results);
      sheetRef.current.close();
    } catch (error) {
      console.log(error);
    }
  };

  useBindDialogButton(sheetRef, {
    onConfirm: onSubmit,
    onCancel,
  });
  return (
    <Form
      form={form}
      initialValues={{
        minPrice: formData.minPrice,
        maxPrice: formData.maxPrice,
      }}
    >
      <Text fs={14} color="text40" lh="130%" as="div" mb={8}>
        {_t('g7VQsQSvnwTQ19cKnCM1ip')}
      </Text>
      <div className="Flex sb">
        <FormItem
          className="flex1"
          name="minPrice"
          rules={[
            {
              required,
              validator: minPriceValidator,
            },
          ]}
        >
          <InputNumber
            fullWidth
            unit={symbolInfo.quota}
            autofocus
            min={0}
            autoFixPrecision
            autoFixMinOnBlur
            placeholder="> 0"
            maxPrecision={symbolInfo.pricePrecision}
            step={symbolInfo.priceIncrement}
          />
        </FormItem>
        <Wave>～</Wave>
        <FormItem
          className="flex1"
          name="maxPrice"
          rules={[
            {
              required,
              validator: maxPriceValidator,
            },
          ]}
        >
          <InputNumber
            fullWidth
            min={0}
            autoFixPrecision
            autoFixMinOnBlur
            unit={symbolInfo.quota}
            maxPrecision={symbolInfo.pricePrecision}
            step={symbolInfo.priceIncrement}
          />
        </FormItem>
      </div>
    </Form>
  );
};

export default OpenPriceRange;

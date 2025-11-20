/**
 * Owner: john.zhang@kupotech.com
 */

import { Form, styled } from '@kux/mui';
import { useState } from 'react';
import { getBeforeTaxFreeDateKey, getUnitCostKey } from '../utils';

const { FormItem } = Form;

export const AssetsForm = styled(Form)`
  .KuxForm-item {
    margin-bottom: -24px;
  }
  .KuxForm-itemError {
    padding-bottom: 4px;
    padding-left: 0;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    .KuxForm-item {
      width: 100%;
      min-width: 100%;
    }
    .KuxForm-itemError {
      width: 100%;
      max-width: max-content;
    }
  }
`;

export const useAssetsTaxForm = (assetsForm) => {
  const [_, setFormData] = useState(assetsForm?.getFieldsValue());
  const formData = assetsForm?.getFieldsValue();

  return {
    assetsForm,
    formData,
    updateFormData: (itemList) => {
      if (!itemList?.length) {
        return;
      }
      const values = {};
      itemList.forEach((data) => {
        const beforeDateKey = getBeforeTaxFreeDateKey(data);
        const unitCostKey = getUnitCostKey(data);
        values[beforeDateKey] = data?.needTax;
        values[unitCostKey] = data?.unitCost;
      });
      const newData = { ...formData, ...values };
      assetsForm.setFieldsValue(newData);
      setFormData(newData);
    },
    refresh: () => {
      const values = assetsForm.getFieldsValue();
      setFormData(values);
    },
    formCheck: assetsForm.validateFields,
  };
};

export const AssetsFormItem = styled(FormItem)`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100%;
    .KuxForm-itemError {
      width: 100%;
    }
  }
`;

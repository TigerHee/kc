/**
 * Owner: john.zhang@kupotech.com
 */

import { _t } from 'src/tools/i18n';
import { MAX_UNIT_COST } from './constants';

// 获取动态表单"needTax"字段的form key
export const getBeforeTaxFreeDateKey = (record) => `${record.currency}_beforeTaxFreeDate`;

// 获取动态表单"unitCost"字段的form key
export const getUnitCostKey = (record) => `${record.currency}_unitCost`;

// 校验 "单位成本"的有效输入，无效时提示: 仅支持正数，最多保留两位小数。
export const unitCostVilidator = (value, record, formData, callback) => {
  const twoDecimalPrecision = /^\d*(\.\d{0,2})?$/;

  const key = getBeforeTaxFreeDateKey(record);
  const isBefore = formData[key];
  if (typeof isBefore !== 'boolean' || isBefore) {
    callback();
    return;
  }

  if (!value || value === '.' || value <= 0 || !twoDecimalPrecision.test(value)) {
    callback(_t('1370cdea4dd64800a05e'));
  }

  if (value > MAX_UNIT_COST) {
    callback(_t('a12d35a593064000a2f5'));
  }

  callback();
};

export const getCoinCurrency = (record, categories = {}) => {
  return categories[record?.currency]?.precision;
};

export const compareDiff = (table1 = [], table2 = []) => {
  if (table1.length !== table2.length) {
    return false;
  }
  let result = true;
  for (let i = 0; i < table1.length; i++) {
    if (
      table1[i]?.currency !== table2[i]?.currency ||
      table1[i]?.totalAmount !== table2[i]?.totalAmount
    ) {
      result = false;
    }
  }

  return result;
};

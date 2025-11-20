/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-12-19 15:03:44
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-12-26 20:03:17
 * @FilePath: /trade-web/src/trade4.0/pages/OrderForm/components/TradeForm/components/Advanced/AdvancedSelect.js
 * @Description:
 */
import React, { useState } from 'react';
import { DropdownSpan } from './style';
import DropdownSelect from '@/components/DropdownSelect';
import { ADVANCED_LIMIT_MODEL } from '@/pages/OrderForm/config.js';
import IntroTips from '@/pages/OrderForm/components/OrderTypeTab/Introduce/IntroTips.js';
import Form from '@mui/Form';

const { useFormInstance } = Form;
const AdvancedSelect = React.memo(({ onChange }) => {
  const form = useFormInstance();
  const initialValue = form.getFieldValue('timeInForce');
  return (
    <DropdownSpan>
      <IntroTips defaultKey="advancedLimit" />
      <DropdownSelect
        configs={ADVANCED_LIMIT_MODEL}
        onChange={onChange}
        value={initialValue}
      />
    </DropdownSpan>
  );
});

export default AdvancedSelect;

/**
 * Owner: john.zhang@kupotech.com
 */

import { InputNumber, styled } from '@kux/mui';
import { memo } from 'react';
import { _t } from 'src/tools/i18n';
import { getBeforeTaxFreeDateKey, getUnitCostKey } from '../utils';
import FreeTaxText from './FreeTaxText';

const UnitInput = styled(InputNumber)`
  min-width: 200px;
  width: 100%;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 100%;
    min-width: 100%;
  }
`;

const TaxUnitCost = (props) => {
  const { record, formData } = props;
  const beforeKey = getBeforeTaxFreeDateKey(record);

  const isBeforeTaxFreeDate = formData[beforeKey] ?? record?.needTax;

  // 未选择 "购买日期" 字段时，显示 '--'
  if (typeof isBeforeTaxFreeDate !== 'boolean') {
    return '--';
  }
  /**
   * 购买日期之前=true, 免税
   * 购买日期之前=false, 扣税
   */
  if (isBeforeTaxFreeDate) {
    return <FreeTaxText />;
  }

  const unitKey = getUnitCostKey(record);
  const defaultValue = formData[unitKey] ?? record?.unitCost;

  return (
    <UnitInput
      placeholder={_t('f89b2d5eb1c44800ac0d')}
      controls={false}
      size="large"
      defaultValue={defaultValue}
      {...props}
    />
  );
};

export default memo(TaxUnitCost);

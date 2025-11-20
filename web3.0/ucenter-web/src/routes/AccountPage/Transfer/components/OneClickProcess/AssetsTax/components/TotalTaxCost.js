/**
 * Owner: john.zhang@kupotech.com
 */

import { styled } from '@kux/mui';
import NumberFormat from 'src/components/common/NumberFormat';

export const TotalTaxComponent = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
  /* width: 200px; */
  width: max-content;
  overflow-wrap: anywhere;
`;

const TotalTaxText = ({ formData, record }) => {
  if (!record.totalCost) {
    return '--';
  }

  // const beforeKey = getBeforeTaxFreeDateKey(record);
  // const currencyData = categories[currency];
  // const precision = Number(currencyData?.precision);

  // const unitKey = getUnitCostKey(record);
  // const isBefore = record?.needTax;
  // const unitCost = formData[unitKey];

  // // if (!unitCost || isBefore || unitCost <= 0 || !precision) {
  // //   return '--';
  // // }

  // const result = multiplyFloor(Number(totalAmount), Number(unitCost), precision || 8);

  return (
    <TotalTaxComponent>
      <NumberFormat>{record.totalCost}</NumberFormat>
    </TotalTaxComponent>
  );
};

export default TotalTaxText;

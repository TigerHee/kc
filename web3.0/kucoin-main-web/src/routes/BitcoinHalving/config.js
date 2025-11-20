/**
 * Owner: ella@kupotech.com
 */
import { NumberFormat } from '@kux/mui';
import { isNil } from 'lodash';

export const percentComp = (num, currentLang) => {
  if (isNil(num) || num === '' || Number.isNaN(+num)) {
    return '--';
  }

  return (
    <NumberFormat
      options={{ style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }}
      lang={currentLang}
      isPositive={+num !== 0}
    >
      {num}
    </NumberFormat>
  );
};

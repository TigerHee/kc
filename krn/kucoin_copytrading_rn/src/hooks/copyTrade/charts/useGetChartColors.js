import {useTheme} from '@krn/ui';

import {getEnhanceColorByType} from 'utils/color-helper';

export const useGetChartColors = () => {
  const {type} = useTheme();

  const [red, green] = [
    getEnhanceColorByType(type, 'brandRed'),
    getEnhanceColorByType(type, 'lineGreen'),
  ];

  return {
    red,
    green,
  };
};

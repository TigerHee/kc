import {enhanceColors} from 'constants';

export const getEnhanceColorByType = (themeType = 'light', colorKey = '') => {
  const visitKey = themeType !== 'light' ? 'dark' : 'light';

  if (!colorKey) return enhanceColors[visitKey];
  return enhanceColors[visitKey]?.[colorKey];
};

export const isLight = type => type === 'light';

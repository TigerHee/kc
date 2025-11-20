import colors from '@krn/ui/lib/theme/colors';

import {enhanceColors} from 'constants/enhance-colors';

/** 定义不同类型的按钮颜色 **/
export const BUTTON_LIGHT_AND_NIGHT_COLOR_MAP = {
  black: {
    backgroundColor: [
      enhanceColors.light.primaryButton,
      enhanceColors.dark.primaryButton,
    ],
    color: [
      enhanceColors.light.primaryButtonText,
      enhanceColors.dark.primaryButtonText,
    ],
  },
  green: {
    backgroundColor: [colors.lightV2.primary, colors.darkV2.primary],
    color: [colors.lightV2.text, colors.darkV2.text],
  },
  complementary: {
    backgroundColor: [colors.lightV2.cover4, colors.lightV2.complementary4],
    color: [colors.lightV2.cover, colors.darkV2.primary],
  },
};

/** 定义不同大小的按钮高度 **/
export const BUTTON_HEIGHT_MAP = {
  large: 48,
  default: 40,
  small: 32,
};

export const BUTTON_TEXT_SIZE_MAP = {
  large: 16,
  default: 14,
  small: 14,
};

/** 按钮的类型，black, green, complementary 默认 black */
export const BUTTON_TYPE = {
  Black: 'black',
  Green: 'green',
  Complementary: 'complementary',
};

export const DEFAULT_SIZE = 'default';

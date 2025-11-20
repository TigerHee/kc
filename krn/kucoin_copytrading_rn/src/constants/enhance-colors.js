import {fadeColor} from '@krn/ui';
import colors from '@krn/ui/lib/theme/colors';

// 亮暗通用
const baseColor = {
  primary: '#01BC8D',
  darkText40: colors.darkV2.text40,
  darkText: colors.darkV2.text,
  illustrationGreen: '#25D17F',
  darkSecondaryButtonBackground: colors.darkV2.secondaryButtonBackground,
  lightBackground: colors.lightV2.background,
  darkBackground: colors.darkV2.background,
  // colors.
};

const light = {
  ...baseColor,
  brandRed: '#F65454',
  brandRed8: fadeColor('#F65454', '0.08'),
  primaryButton: '#1D1D1D',
  primaryButtonText: '#01BC8D',
  //兼容安卓 border 异常 light EDEDED , 1D1D1D
  androidBorderDivider8: '#EDEDED',
  lineGreen: '#2DBF5C',
  lineGreen4: fadeColor('#18CA51', '0.04'),
  lineGreen8: fadeColor('#18CA51', '0.08'),
  tableRowBg: '#f7f7f7',
  quickGuideContentImgBg: '#EAF8F4',
};

const dark = {
  ...baseColor,
  brandRed: '#F66754',
  brandRed8: fadeColor('#F66754', '0.08'),
  primaryButton: '#01BC8D',
  primaryButtonText: '#ffffff',
  //兼容安卓 border 异常 light EDEDED , 1D1D1D
  androidBorderDivider8: '#323233',
  lineGreen: '#0CC372',
  lineGreen4: fadeColor('#0CC372', '0.04'),
  lineGreen8: fadeColor('#0CC372', '0.08'),
  tableRowBg: '#1a1a1a',
  quickGuideContentImgBg: '#19342C',
};

/** 增强补充krn/ui themeContext不具备颜色映射
 *  白天/夜间模式颜色 */
export const enhanceColors = {
  dark,
  light,
  baseColor,
};

/**  line 图标颜色 */
export const ECHART_LINE_COLORS_MAP = {
  green: '#17CA51',
  red: '#EB4C6D',
};

/**
 * Owner: Ray.Lee@kupotech.com
 */

import { flattenDeep, findLast } from 'lodash';

/**
 * 因为 font-weight 样式不生效，需要用 font-family 来代替对应的字重
 * font-weight 对应 字体字重枚举映射
 */
const FONT_WEIGHT_FAMILY_ENUM = {
  400: 'KCNBFont-Regular',
  500: 'KCNBFont-Medium',
  600: 'KCNBFont-SemiBold',
  700: 'KCNBFont-Bold',
  bold: 'KCNBFont-Bold',
  normal: 'KCNBFont-Regular',
};

const convertFontWeightToFamily = (props, newFontsAvailable) => {
  if (!newFontsAvailable) return null;

  try {
    const flattenStyle = flattenDeep(props.style) || [];
    const fontWeight = findLast(flattenStyle, (item) => item?.fontWeight)?.fontWeight;
    if (fontWeight) {
      const fontFamily = FONT_WEIGHT_FAMILY_ENUM[fontWeight || '400'];
      return fontFamily;
    }

    return null;
  } catch (error) {
    return null;
  }
};

export default convertFontWeightToFamily;

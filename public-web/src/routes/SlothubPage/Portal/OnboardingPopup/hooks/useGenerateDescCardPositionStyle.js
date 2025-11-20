/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-20 15:48:13
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-25 14:46:53
 */
import { useSize } from 'ahooks';
import { useMemo, useRef } from 'react';
import { triangleDirections } from '../constant';

const DESC_CARD_COMPARE_CONTENT_HORIZONTAL_OFFSET = 21;
const baseStyle = {
  position: 'absolute',
};
// 目前isVerticallyCentered 只出现topRight 场景，其他场景需补充样式
export const useGenerateDescCardPositionStyle = ({ descCardDirection, isVerticallyCentered }) => {
  const cardRef = useRef(null);
  const size = useSize(cardRef);

  const style = useMemo(() => {
    if (!size) return baseStyle;

    if (descCardDirection === triangleDirections.topRight) {
      const verticalStyle = {
        marginTop: DESC_CARD_COMPARE_CONTENT_HORIZONTAL_OFFSET,
        marginLeft: 'auto',
      };
      const absoluteStyle = {
        ...baseStyle,
        bottom: -(size.height + DESC_CARD_COMPARE_CONTENT_HORIZONTAL_OFFSET),
        right: 0,
      };

      return isVerticallyCentered ? verticalStyle : absoluteStyle;
    }

    if (descCardDirection === triangleDirections.bottomRight) {
      return {
        ...baseStyle,
        top: -(size.height + DESC_CARD_COMPARE_CONTENT_HORIZONTAL_OFFSET),
        right: 0,
      };
    }
    if (descCardDirection === triangleDirections.left) {
      return {
        ...baseStyle,
        top: 36,
        right: -16,
      };
    }
  }, [size, isVerticallyCentered, descCardDirection]);

  return [cardRef, style];
};

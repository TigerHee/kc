/**
 * Owner: jessie@kupotech.com
 */
import { useCallback, useRef } from 'react';
import { isNil } from 'lodash';
import { _t } from 'utils/lang';
import { useTheme } from '@kux/mui';
import usePriceChangeColor from '@/hooks/usePriceChangeColor';

const usePositionLine = ({ tvWidget }) => {
  const positionRef = useRef(null);

  const { colors } = useTheme();
  const priceChangeColor = usePriceChangeColor();

  // 更新
  const updatePositionLine = useCallback(
    ({ text, price, quantity, textTooltip, modifyTooltip, cancelTooltip, onCancel }) => {
      if (positionRef.current) {
        if (!isNil(text)) {
          positionRef.current.setText(text);
        }

        if (!isNil(textTooltip)) {
          positionRef.current.setTooltip(textTooltip);
        }

        if (!isNil(price)) {
          positionRef.current.setPrice(+price);
        }

        if (!isNil(quantity)) {
          positionRef.current.setQuantity(`${quantity}`);
        }

        // if (!isNil(modifyTooltip)) {
        //   positionRef.current.setReverseTooltip('modifyTooltip');
        // }
        if (!isNil(cancelTooltip)) {
          positionRef.current.setCloseTooltip(cancelTooltip);
        }

        let sideColor;
        if (quantity >= 0) {
          sideColor = priceChangeColor.up || colors.primary;
        } else {
          sideColor = priceChangeColor.down || colors.secondary;
        }

        positionRef.current
          .setLineColor(sideColor)
          .setBodyBorderColor(sideColor)
          .setBodyBackgroundColor(sideColor)
          .setBodyTextColor(colors.textEmphasis)
          .setBodyFont('500 12px Roboto')
          .setQuantityBorderColor(colors.divider8)
          .setQuantityBackgroundColor(colors.overlay)
          .setQuantityTextColor(sideColor)
          .setQuantityFont('500 12px Roboto');

        if (onCancel) {
          positionRef.current
            .setCloseButtonBorderColor(colors.divider8)
            .setCloseButtonBackgroundColor(colors.overlay)
            .setCloseButtonIconColor(sideColor);
        }
      }
    },
    [colors, priceChangeColor],
  );

  // 移除
  const removePositionLine = useCallback(() => {
    if (positionRef.current) {
      positionRef.current.remove();
      positionRef.current = undefined;
    }
  }, []);

  // 创建line
  const createOPositionLine = useCallback(
    ({ data, onCancel } = {}) => {
      try {
        const chart = tvWidget?.chart();
        if (chart) {
          positionRef.current = chart
            .createPositionLine({ disableUndo: true })
            .setExtendLeft(true)
            .setLineStyle(1)
            .setLineLength(80);

          updatePositionLine({ ...data, onCancel });
          if (onCancel) {
            positionRef.current.onClose(onCancel);
          }
        }
      } catch (e) {
        console.log(e, 'createOPositionLine error');
      }
    },
    [tvWidget, updatePositionLine],
  );

  return {
    createOPositionLine,
    removePositionLine,
    updatePositionLine,
  };
};

export default usePositionLine;

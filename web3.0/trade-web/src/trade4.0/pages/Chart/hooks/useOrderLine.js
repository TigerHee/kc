/**
 * Owner: jessie@kupotech.com
 */
import { useCallback, useRef } from 'react';
import { isNil } from 'lodash';
import { _t } from 'utils/lang';
import { useTheme } from '@kux/mui';
import usePriceChangeColor from '@/hooks/usePriceChangeColor';

const useOrderLine = ({ tvWidget }) => {
  const orderRef = useRef(null);

  const { colors } = useTheme();
  const priceChangeColor = usePriceChangeColor();

  // 更新
  const updateOrderLineData = useCallback(
    ({ text, price, quantity, textTooltip, modifyTooltip, cancelTooltip, lineLength }) => {
      if (orderRef.current) {
        if (!isNil(text)) {
          orderRef.current.setText(text);
        }

        if (!isNil(textTooltip)) {
          orderRef.current.setTooltip(textTooltip);
        }

        if (!isNil(price)) {
          orderRef.current.setPrice(+price);
        }

        if (!isNil(quantity)) {
          orderRef.current.setQuantity(`${quantity}`);
        }

        if (!isNil(modifyTooltip)) {
          orderRef.current.setModifyTooltip(modifyTooltip);
        }

        if (!isNil(cancelTooltip)) {
          orderRef.current.setCancelTooltip(cancelTooltip);
        }

        if (!isNil(lineLength)) {
          orderRef.current.setLineLength(lineLength);
        }
      }
    },
    [],
  );

  // 移除
  const removeOrderLine = useCallback(() => {
    if (orderRef.current) {
      orderRef.current.remove();
      orderRef.current = undefined;
    }
  }, []);

  // 更新config
  const updateOrderLineConfig = useCallback(
    ({ side, onCancel }) => {
      if (orderRef.current) {
        let sideColor;
        if (side === 'buy') {
          sideColor = priceChangeColor.up || colors.primary;
        } else {
          sideColor = priceChangeColor.down || colors.secondary;
        }

        orderRef.current
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
          orderRef.current
            .setCancelButtonBorderColor(colors.divider8)
            .setCancelButtonBackgroundColor(colors.overlay)
            .setCancelButtonIconColor(colors.icon);
        }
      }
    },
    [priceChangeColor, colors],
  );

  // 创建orderLine
  const createOrderLine = useCallback(
    ({ data, onCancel } = {}) => {
      try {
        const chart = tvWidget?.chart();
        if (chart) {
          orderRef.current = chart
            .createOrderLine({ disableUndo: true })
            .setExtendLeft(true)
            .setLineStyle(2)
            .setEditable(true)
            .onModify('onModify called', () => {});

          updateOrderLineConfig({ side: data?.side, onCancel });
          updateOrderLineData(data);
          if (onCancel) {
            orderRef.current.onCancel(onCancel).setCancellable(true);
          }
        }
      } catch (e) {
        console.log(e, 'createOrderLine error');
      }
    },
    [tvWidget, updateOrderLineConfig, updateOrderLineData],
  );

  return {
    createOrderLine,
    removeOrderLine,
    updateOrderLineConfig,
    updateOrderLineData,
  };
};

export default useOrderLine;

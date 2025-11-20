/*
 * owner: Clyne@kupotech.com
 */
import { namespace } from '../config';
import { getStore } from 'src/utils/createApp';
import TradeUtils from 'utils/tradeUtils';
import { formatNumber } from '@/utils/format';
import voiceQueue from 'src/trade4.0/utils/voice';

export const useEvent = () => {
  // price，amount，total的点击事件
  const listClick = ({ price, amount }, e) => {
    if (e.target) {
      const itemType = e.target.getAttribute('data-item-type');
      if (!itemType) {
        return;
      }
      const { precision, amountPrecision } = getStore().getState()[namespace];

      const _data = {
        price: formatNumber(price, { fixed: precision, pointed: false }),
        amount: formatNumber(amount, { fixed: amountPrecision, pointed: false }),
      };

      let fields = [];
      if (itemType === 'all') {
        fields = [
          {
            fieldName: 'price',
            fieldValue: _data.price,
            decimal: precision,
          },
          {
            fieldName: 'amount',
            fieldValue: _data.amount,
            decimal: amountPrecision,
          },
        ];
      } else {
        fields.push({
          fieldName: itemType,
          fieldValue: _data[itemType],
          decimal: itemType === 'price' ? precision : amountPrecision,
        });
      }

      if (fields.length) {
        voiceQueue.notify('order_book_click');
        TradeUtils.setTradeForm(fields);
      }
      console.log(fields);
    }
  };

  return { listClick };
};

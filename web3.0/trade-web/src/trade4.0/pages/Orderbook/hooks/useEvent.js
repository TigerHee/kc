/*
 * owner: Clyne@kupotech.com
 */
import { namespace } from '@/pages/Orderbook/config';
import voiceQueue from 'src/trade4.0/utils/voice';
import { getPrecisionFromIncrement, evtEmitter } from 'helper';
import { getStore } from 'src/utils/createApp';
import TradeUtils from 'utils/tradeUtils';

const event = evtEmitter.getEvt();

export const useEvent = () => {
  // price，amount，total的点击事件
  const listClick = (data, e) => {
    let fields = [];
    const futuresData = {};
    const { currentDepth, amountPrecision } = getStore().getState()[namespace];
    data.pricePrecision = getPrecisionFromIncrement(currentDepth);
    data.amountPrecision = amountPrecision;

    if (e.target) {
      const itemType = e.target.getAttribute('data-item-type');
      if (!itemType) {
        return;
      }
      if (itemType === 'all') {
        // 合约适配
        futuresData.price = data.price;
        futuresData.size = data.amount;
        fields = [
          {
            fieldName: 'price',
            fieldValue: data.price,
            decimal: data.pricePrecision,
          },
          {
            fieldName: 'amount',
            fieldValue: data.amount,
            decimal: data.amountPrecision,
          },
        ];
      } else {
        // total实际的使用的精度与名称都是amount的
        const fieldNameAndDecimalKey = itemType === 'total' ? 'amount' : itemType;
        // 合约适配
        if (fieldNameAndDecimalKey === 'amount') {
          futuresData.size = data[itemType];
        } else {
          futuresData.price = data[itemType];
        }
        fields.push({
          fieldName: fieldNameAndDecimalKey,
          fieldValue: data[itemType],
          decimal: data[`${fieldNameAndDecimalKey}Precision`],
        });
      }

      if (fields.length) {
        voiceQueue.notify('order_book_click');
        TradeUtils.setTradeForm(fields);
        console.log('======', futuresData);
        event.emit('event/orderBook@click', futuresData);
      }
    }
  };

  return { listClick };
};

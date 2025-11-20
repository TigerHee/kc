import { getEvt, setTradeForm } from 'src/utils/tradeUtils';

const tradeEvent = getEvt();
const mockCallBack = jest.fn();

tradeEvent.on('trade.form.fast', mockCallBack);

describe('表单快速设置', () => {
  test('设置下单', () => {
    setTradeForm([{
      fieldName: 'price',
      fieldValue: 3.129,
      decimal: 2,
    }]);
    expect(mockCallBack.mock.calls[0][0]).toMatchObject({
      price: '3.12'
    });

    setTradeForm([{
      fieldName: 'amount',
      fieldValue: 100000,
      decimal: 3,
    }]);
    expect(mockCallBack.mock.calls[1][0]).toMatchObject({
      amount: '100000.000',
    });

    setTradeForm([{
      fieldName: 'triggerPrice',
      fieldValue: 4.2340,
      decimal: 8,
    }]);
    expect(mockCallBack.mock.calls[2][0]).toMatchObject({
      triggerPrice: '4.23400000',
    });
  });

});
/**
 * Owner: tiger@kupotech.com
 */
import '@testing-library/jest-dom';
import MoneyAmountFormat from 'src/components/common/MoneyAmountFormat';
import { customRender } from 'src/test/setup';

const baseState = {
  currency: {
    currency: 'CNY',
    prices: {
      CNY: 2,
      USDT: 2,
    },
    rates: {
      CNY: 2,
      USDT: 2,
    },
  },
};

describe('test MoneyAmountFormat', () => {
  test('test MoneyAmountFormat default', async () => {
    customRender(<MoneyAmountFormat value="1" />, baseState);
  });
  test('test MoneyAmountFormat 10000000', async () => {
    customRender(<MoneyAmountFormat value={10000000} />, baseState);
  });

  test('test MoneyAmountFormat 10 ** 15', async () => {
    customRender(<MoneyAmountFormat value={10 ** 15} showChar={false} />, baseState);
  });

  test('test MoneyAmountFormat showLegalCurrency', async () => {
    customRender(<MoneyAmountFormat value={10 ** 9} showLegalCurrency />, baseState);
  });

  test('test MoneyAmountFormat needTransfer', async () => {
    customRender(<MoneyAmountFormat value={10 ** 12} needTransfer={false} />, baseState);
  });
});

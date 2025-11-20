/**
 * Owner: tiger@kupotech.com
 */
import '@testing-library/jest-dom';
import AmountFormatter from 'src/components/common/AmountFormatter';
import { customRender } from 'src/test/setup';

describe('test AmountFormatter', () => {
  test('test AmountFormatter 1', async () => {
    customRender(<AmountFormatter value={1} />, {});
  });

  test('test AmountFormatter 1000000', async () => {
    customRender(<AmountFormatter value={1000000} />, {});
  });

  test('test AmountFormatter 10 ** 9', async () => {
    customRender(<AmountFormatter value={10 ** 9} />, {});
  });

  test('test AmountFormatter 10 ** 12', async () => {
    customRender(<AmountFormatter value={10 ** 12} />, {});
  });

  test('test AmountFormatter 10 ** 15', async () => {
    customRender(<AmountFormatter value={10 ** 15} />, {});
  });

  test('test AmountFormatter no value', async () => {
    customRender(<AmountFormatter />, {});
  });
});

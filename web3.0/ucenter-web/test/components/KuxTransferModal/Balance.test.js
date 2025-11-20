/**
 * Owner: tiger@kupotech.com
 */
import Balance from 'src/components/KuxTransferModal/Balance';
import { customRender } from 'test/setup';

describe('test Balance', () => {
  test('test Balance render', () => {
    customRender(<Balance />);
  });
});

/**
 * Owner: sean.shi@kupotech.com
 */
import { BoardWithdraw } from 'src/components/Assets/Withdraw/Board';
import { customRender } from 'test/setup';

describe('test BoardWithdraw', () => {
  test('test BoardWithdraw', () => {
    customRender(<BoardWithdraw />);
  });
});

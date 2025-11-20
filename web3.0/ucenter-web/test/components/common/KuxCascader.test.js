/**
 * Owner: tiger@kupotech.com
 */
import KuxCascader from 'src/components/common/KuxCascader';
import { customRender } from 'test/setup';

describe('test KuxCascader', () => {
  test('test KuxCascader render', () => {
    customRender(<KuxCascader />);
  });
});

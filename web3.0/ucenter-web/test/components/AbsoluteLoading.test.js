/**
 * Owner: melon@kupotech.com
 */

import { customRender } from 'test/setup';

import AbsoluteLoading from 'src/components/AbsoluteLoading';

describe('test /components/AbsoluteLoading', () => {
  test('test AbsoluteLoading', () => {
    customRender(<AbsoluteLoading />);
  });
});

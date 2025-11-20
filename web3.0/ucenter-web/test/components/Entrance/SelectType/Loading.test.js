/**
 * Owner: melon@kupotech.com
 */

/**
 * 单测文件
 */

import Loading from 'src/routes/Ucenter/SelectType/Loading';

import { customRender } from 'test/setup';

describe('test src/routes/Ucenter/SelectType/Loading.js', () => {
  test('test Loading', () => {
    customRender(<Loading />, {});
  });
});

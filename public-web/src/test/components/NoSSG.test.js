/**
 * Owner: jessie@kupotech.com
 */
import NoSSG from 'src/components/NoSSG';
import { customRender } from '../setup';

describe('test NoSSG', () => {
  test('test NoSSG with no', () => {
    customRender(<NoSSG>NoSSG</NoSSG>, {});
  });
  test('test NoSSG with have', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'SSG_ENV',
      writable: true,
    });
    customRender(<NoSSG>NoSSG</NoSSG>, {});
  });
});

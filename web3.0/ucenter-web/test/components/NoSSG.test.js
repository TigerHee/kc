import NoSSG from 'src/components/NoSSG';
import { customRender } from 'test/setup';

describe('test NoSSG', () => {
  test('test NoSSG', () => {
    customRender(<NoSSG>NoSSG</NoSSG>, {});
  });

  test('test NoSSG', () => {
    customRender(<NoSSG>{undefined}</NoSSG>, {});
  });
});

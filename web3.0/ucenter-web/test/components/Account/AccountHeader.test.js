import AccountHeader from 'src/components/Account/AccountHeader';
import { customRender } from 'test/setup';

describe('test AccountHeader', () => {
  test('test AccountHeader', () => {
    customRender(<AccountHeader />, {});
    customRender(<AccountHeader>AccountHeader</AccountHeader>, {});
  });
});

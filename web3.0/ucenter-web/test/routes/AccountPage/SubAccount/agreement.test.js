import { FUTURE_AGREEMENT } from 'src/routes/AccountPage/SubAccount/agreement';
import { customRender } from 'test/setup';

describe('test FUTURE_AGREEMENT', () => {
  test('test FUTURE_AGREEMENT', () => {
    customRender(<>{FUTURE_AGREEMENT}</>);
  });
});

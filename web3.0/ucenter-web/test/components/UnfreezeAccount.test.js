import UnfreezeAccount from 'src/components/UnfreezeAccount';
import { customRender } from 'test/setup';

describe('test UnfreezeAccount', () => {
  test('test UnfreezeAccount', () => {
    customRender(<UnfreezeAccount />, { account_freeze: {} });
    customRender(<UnfreezeAccount canApply timer={0} />, {
      account_freeze: { hasFreezeSub: true },
    });
  });
});
